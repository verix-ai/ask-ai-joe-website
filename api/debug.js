// Debug endpoint to check Vercel configuration using ES modules

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Return debug information
  return res.status(200).json({
    success: true,
    message: 'Debug endpoint is working',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION
    },
    mailchimpConfig: {
      hasApiKey: !!process.env.MAILCHIMP_API_KEY,
      hasListId: !!process.env.MAILCHIMP_LIST_ID,
      hasServerPrefix: !!process.env.MAILCHIMP_SERVER_PREFIX
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    },
    timestamp: new Date().toISOString()
  });
} 