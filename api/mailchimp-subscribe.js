// Vercel serverless function for Mailchimp using ES modules syntax

// Helper to ensure we always return valid JSON
const safeJsonResponse = (res, statusCode, data) => {
  // Set JSON content type header 
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).json(data);
};

// Main handler function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return safeJsonResponse(res, 204, {});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return safeJsonResponse(res, 405, { 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('Mailchimp API endpoint triggered');
    
    // Parse request body if needed
    let data;
    try {
      data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Parsed data:', data);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return safeJsonResponse(res, 400, { 
        success: false, 
        error: 'Invalid JSON', 
        detail: parseError.message 
      });
    }
    
    // Extract fields
    const email = data.email;
    const name = data.name || (data.mergeFields && data.mergeFields.NAME);
    const phone = data.phone || (data.mergeFields && data.mergeFields.PHONE);
    const company = data.company || (data.mergeFields && data.mergeFields.COMPANY);
    const message = data.message || (data.mergeFields && data.mergeFields.MESSAGE);
    
    console.log('Received form data:', { email, name, phone, company, hasMessage: !!message });

    // Validate required fields
    if (!email) {
      return safeJsonResponse(res, 400, { 
        success: false, 
        error: 'Email is required' 
      });
    }

    // For now, return success without calling Mailchimp API
    return safeJsonResponse(res, 200, {
      success: true,
      message: 'Test mode - Form data received',
      detail: `Form data for ${email} received successfully.`,
      formData: { email, name, phone, company, hasMessage: !!message },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        hasMailchimpVars: {
          apiKey: !!process.env.MAILCHIMP_API_KEY,
          listId: !!process.env.MAILCHIMP_LIST_ID,
          serverPrefix: !!process.env.MAILCHIMP_SERVER_PREFIX
        }
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return safeJsonResponse(res, 500, {
      success: false,
      error: 'Internal server error',
      detail: error.message || 'An unexpected error occurred'
    });
  }
} 