import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateTrainingSession } from "./openai";
import { getMockSession, getRandomLoadingPhrase } from "./mock-data";
import { sessionGenerationSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found, Stripe functionality will be disabled');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Check quota middleware
  const checkQuota = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = req.user;
    const now = new Date();
    
    // Reset quota if past reset date
    if (now >= user.resetDate) {
      await storage.resetUserGenerations(user.id);
      req.user = await storage.getUser(user.id);
    }

    // Check if user has generations left (unlimited for pro users)
    if (user.planType === "free" && user.generationsUsed >= user.generationsLimit) {
      return res.status(403).json({ 
        message: "Generation limit reached. Upgrade to Pro for unlimited sessions.",
        upgradeRequired: true
      });
    }

    next();
  };

  // Generate session endpoint
  app.post("/api/sessions/generate", checkQuota, async (req, res) => {
    try {
      const validationResult = sessionGenerationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request parameters",
          errors: validationResult.error.errors
        });
      }

      const params = validationResult.data;
      
      // Use mock data if in development mode to save API costs
      const useMockData = process.env.NODE_ENV === "development" && 
                         req.query.mock !== "false";
      
      let generatedSession;
      if (useMockData) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        generatedSession = getMockSession(params);
      } else {
        generatedSession = await generateTrainingSession(params);
      }
      
      // Increment user's generation count (only for free users)
      if (req.user!.planType === "free") {
        await storage.updateUserGenerations(req.user!.id, req.user!.generationsUsed + 1);
      }

      res.json(generatedSession);
    } catch (error) {
      console.error("Session generation error:", error);
      res.status(500).json({ message: "Failed to generate session" });
    }
  });

  // Get loading phrases for UI
  app.get("/api/loading-phrases", (req, res) => {
    res.json({ phrase: getRandomLoadingPhrase() });
  });

  // Save session endpoint
  app.post("/api/sessions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      console.log("Saving session data:", JSON.stringify(req.body, null, 2));
      const session = await storage.createSession({
        ...req.body,
        userId: req.user.id
      });
      console.log("Session saved successfully:", session.id);
      res.status(201).json(session);
    } catch (error) {
      console.error("Save session error:", error);
      res.status(500).json({ message: "Failed to save session" });
    }
  });

  // Get user's sessions
  app.get("/api/sessions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const sessions = await storage.getUserSessions(req.user.id);
      res.json(sessions);
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({ message: "Failed to retrieve sessions" });
    }
  });

  // Get specific session
  app.get("/api/sessions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const session = await storage.getSession(req.params.id);
      if (!session || session.userId !== req.user.id) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({ message: "Failed to retrieve session" });
    }
  });

  // Delete session
  app.delete("/api/sessions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const deleted = await storage.deleteSession(req.params.id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Delete session error:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  // Stripe subscription endpoints (if Stripe is configured)
  if (stripe) {
    app.post('/api/create-subscription', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      let user = req.user;

      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          res.json({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
          return;
        } catch (error) {
          console.error("Error retrieving existing subscription:", error);
        }
      }
      
      if (!user.email) {
        return res.status(400).json({ message: 'User email is required for subscription' });
      }

      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });

        user = await storage.updateUserStripeInfo(user.id, customer.id);

        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{
            price: process.env.STRIPE_PRICE_ID || 'price_1234', // This should be set by user
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);
    
        res.json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      } catch (error: any) {
        console.error("Stripe subscription error:", error);
        res.status(400).json({ message: error.message });
      }
    });
  }

  // User stats endpoint
  app.get("/api/user/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const sessions = await storage.getUserSessions(req.user.id);
      const user = req.user;
      
      // Calculate monthly generations
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyGenerations = sessions.filter(s => 
        new Date(s.createdAt) >= startOfMonth
      ).length;

      res.json({
        totalSessions: sessions.length,
        monthlyGenerations,
        remainingGenerations: user.planType === "pro" ? -1 : Math.max(0, user.generationsLimit - user.generationsUsed),
        planType: user.planType,
        resetDate: user.resetDate
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ message: "Failed to retrieve user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
