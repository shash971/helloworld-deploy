import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// API base URL for the existing backend
const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add proxy middleware to forward requests to the existing backend
  app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUrl = `${API_BASE_URL}${req.url}`;
      
      // Create fetch options based on original request
      const fetchOptions: any = {
        method: req.method,
        headers: {
          ...req.headers,
          host: new URL(API_BASE_URL).host,
        },
      };
      
      // Forward request body for POST, PUT, PATCH methods
      if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        fetchOptions.body = JSON.stringify(req.body);
        fetchOptions.headers['content-type'] = 'application/json';
      }
      
      // Forward authorization header if present
      if (req.headers.authorization) {
        fetchOptions.headers.authorization = req.headers.authorization;
      }
      
      // Make request to the backend API
      const response = await fetch(targetUrl, fetchOptions);
      
      // Forward status code
      res.status(response.status);
      
      // Forward response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Forward response body
      const data = await response.text();
      res.send(data);
      
    } catch (error) {
      console.error('API proxy error:', error);
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
