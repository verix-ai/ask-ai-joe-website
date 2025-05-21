// Simple test API endpoint for Vercel

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Return a simple JSON response
  return res.status(200).json({
    success: true,
    message: 'API endpoint is working!',
    timestamp: new Date().toISOString()
  });
}; 