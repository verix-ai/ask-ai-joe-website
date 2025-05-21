import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
// Mock Mailchimp API handler for development
const mailchimpHandler = (req: IncomingMessage, res: ServerResponse) => {
  // Set CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        console.log('[DEV] Received POST to /api/mailchimp with body:', body);
        
        // Always set the content type for JSON responses
        res.setHeader('Content-Type', 'application/json');
        
        if (!body) {
          res.statusCode = 400;
          res.end(JSON.stringify({
            success: false,
            error: 'Empty request body',
            detail: 'The request body cannot be empty'
          }));
          return;
        }
        
        const data = JSON.parse(body);
        const { email, listId, mergeFields = {} } = data;
        
        console.log(`[DEV] Mailchimp subscription request:`, { email, listId, mergeFields });
        
        // Log the specific merge fields received for debugging
        if (mergeFields) {
          console.log('[DEV] Mailchimp merge fields:', {
            NAME: mergeFields.NAME,
            EMAIL: mergeFields.EMAIL,
            PHONE: mergeFields.PHONE,
            COMPANY: mergeFields.COMPANY,
            MESSAGE: mergeFields.MESSAGE
          });
        }
        
        if (!email || !listId) {
          res.statusCode = 400;
          res.end(JSON.stringify({
            success: false,
            error: !email ? 'Email is required' : 'List ID is required',
            detail: 'Please provide all required fields'
          }));
          return;
        }
        
        // Return a mock success response - ensure proper JSON is returned
        const responseData = {
          success: true,
          status: "Success",
          message: "Successfully subscribed!",
          detail: `${email} has been added to the mailing list.`,
          submitted_fields: mergeFields || {}
        };
        
        console.log('[DEV] Sending response:', responseData);
        res.statusCode = 200;
        res.end(JSON.stringify(responseData));
      } catch (err) {
        console.error('[DEV] Error processing Mailchimp request:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          error: 'Internal server error',
          detail: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    });
  } else {
    res.statusCode = 405; // Method Not Allowed
    res.end();
  }
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {},
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/mailchimp', mailchimpHandler);
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
