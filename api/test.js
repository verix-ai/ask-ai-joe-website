// Test API endpoint using ES modules syntax

export default function handler(req, res) {
  // Set CORS headers and JSON response type
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Return a simple JSON response
  return res.status(200).json({
    success: true,
    message: 'Test API is working',
    method: req.method,
    query: req.query,
    timestamp: new Date().toISOString()
  });
} 