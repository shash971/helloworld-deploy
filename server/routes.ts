import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// API base URL for the existing backend
const API_BASE_URL = "http://127.0.0.1:8000";

// Path to the backend code
const BACKEND_PATH = path.join(process.cwd(), 'backend_extract');

// Function to start the FastAPI backend
async function startBackendServer() {
  try {
    // Check if uvicorn is available
    console.log("Starting FastAPI backend server...");
    console.log(`Backend path: ${BACKEND_PATH}`);
    
    // Start the FastAPI server using the extracted code
    const backendProcess = spawn('python3', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'], {
      cwd: BACKEND_PATH,
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      stdio: 'pipe'
    });
    
    // Log output from the backend
    backendProcess.stdout.on('data', (data) => {
      console.log(`[FastAPI] ${data.toString()}`);
    });
    
    backendProcess.stderr.on('data', (data) => {
      console.error(`[FastAPI Error] ${data.toString()}`);
    });
    
    backendProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Backend process exited with code ${code}`);
      }
    });
    
    // Give the backend a moment to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("FastAPI backend started successfully");
    return true;
  } catch (error) {
    console.error("Failed to start FastAPI backend:", error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the backend server
  const backendStarted = await startBackendServer();
  
  if (!backendStarted) {
    console.warn("Warning: Backend server failed to start. API proxy may not work correctly.");
  }
  
  // Add proxy middleware to forward requests to the existing backend
  app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Remove /api prefix before forwarding to backend
      const apiPath = req.url;
      const targetUrl = `${API_BASE_URL}${apiPath}`;
      
      console.log(`Proxying request to: ${targetUrl}, Method: ${req.method}`);
      
      // Create fetch options based on original request
      const fetchOptions: any = {
        method: req.method,
        headers: {
          ...req.headers,
          host: '127.0.0.1:8000',
        },
      };
      
      // Handle different content types appropriately
      if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        if (req.headers['content-type']?.includes('application/json')) {
          fetchOptions.body = JSON.stringify(req.body);
          fetchOptions.headers['content-type'] = 'application/json';
        } else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
          // For form-urlencoded data, forward as-is
          fetchOptions.body = req.body;
        } else {
          // For other content types, forward raw body
          fetchOptions.body = req.body;
        }
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
        // Avoid setting problematic headers
        if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });
      
      // Forward response body
      const data = await response.text();
      console.log(`Response from backend (${response.status}): ${data.length > 100 ? data.substring(0, 100) + '...' : data}`);
      res.send(data);
      
    } catch (error) {
      console.error('API proxy error:', error);
      // Send a user-friendly error
      res.status(502).json({
        error: 'Bad Gateway', 
        message: 'Unable to connect to the backend service',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
