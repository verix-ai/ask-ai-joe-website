// Vercel serverless function for Mailchimp debugging

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed'
    });
  }

  try {
    // For now, just return a success response to test API connectivity
    // This bypasses Mailchimp integration to isolate the issue
    return res.status(200).json({
      success: true,
      status: "Debug Mode",
      message: "API endpoint is working!",
      detail: "This is a mock response to test API connectivity",
      receivedData: req.body,
      timestamp: new Date().toISOString(),
      mailchimpCredentials: {
        hasApiKey: !!process.env.MAILCHIMP_API_KEY,
        hasListId: !!process.env.MAILCHIMP_LIST_ID,
        hasServerPrefix: !!process.env.MAILCHIMP_SERVER_PREFIX
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 