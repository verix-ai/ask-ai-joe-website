// Vercel serverless function for Mailchimp using ES modules syntax
import mailchimp from '@mailchimp/mailchimp_marketing';
import crypto from 'crypto';

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

    // Get environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    // Enhanced debug logging for Mailchimp credentials
    console.log('Mailchimp credentials check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyFirst4: apiKey ? apiKey.substring(0, 4) : null,
      apiKeyLast4: apiKey ? apiKey.substring(apiKey.length - 4) : null,
      listIdLength: listId ? listId.length : 0,
      listIdValue: listId || 'not set',
      serverPrefixValue: serverPrefix || 'not set'
    });
    
    if (!apiKey || !listId || !serverPrefix) {
      console.error('Missing Mailchimp configuration:', { 
        hasApiKey: !!apiKey, 
        hasListId: !!listId, 
        hasServerPrefix: !!serverPrefix 
      });
      return safeJsonResponse(res, 500, { 
        success: false, 
        error: 'Server configuration error',
        detail: 'Mailchimp is not properly configured on the server. Please check your environment variables.'
      });
    }
    
    try {
      // Configure Mailchimp client
      mailchimp.setConfig({
        apiKey: apiKey,
        server: serverPrefix
      });
      
      console.log('Mailchimp client configured with server:', serverPrefix);
      
      // Create MD5 hash of lowercase email for Mailchimp API
      const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
      
      // Prepare merge fields with correct mapping
      const mergeFields = {};
      if (name) mergeFields.NAME = name;
      if (phone) mergeFields.PHONE = phone;
      if (company) mergeFields.COMPANY = company;
      if (message) mergeFields.MESSAGE = message;

      // Prepare subscriber data
      const subscriberData = {
        email_address: email,
        status: 'subscribed', // Use 'pending' if double opt-in is enabled
        merge_fields: mergeFields
      };

      console.log(`Submitting to Mailchimp: ${email}`);
      console.log('Mailchimp List ID:', listId);
      console.log('Subscriber data:', JSON.stringify(subscriberData));

      // First try a simple ping to test API connectivity
      try {
        console.log('Testing Mailchimp API connectivity...');
        const pingResult = await mailchimp.ping.get();
        console.log('Mailchimp ping successful:', pingResult);
      } catch (pingError) {
        console.error('Mailchimp ping failed:', pingError);
        // Continue anyway to get the specific error from the actual API call
      }

      // Use the Mailchimp API client to add/update the member
      const response = await mailchimp.lists.setListMember(
        listId,
        emailHash,
        subscriberData
      );
      
      console.log('Mailchimp API response:', response);
      
      // Handle successful response
      console.log('Successfully subscribed to Mailchimp:', email);
      return safeJsonResponse(res, 200, {
        success: true,
        status: "Success",
        message: "Successfully subscribed!",
        detail: `${email} has been added to the mailing list.`
      });
    } catch (err) {
      console.error('Mailchimp API error:', err);
      console.error('Error details:', JSON.stringify({
        status: err.status,
        title: err.title,
        detail: err.detail,
        instance: err.instance,
        response: err.response ? {
          text: err.response.text,
          status: err.response.status
        } : 'No response data',
        stack: err.stack
      }));
      
      // Handle the "already a member" case specially
      if (err.status === 400 && err.response && err.response.text) {
        try {
          const errorBody = JSON.parse(err.response.text);
          
          if (errorBody.title === "Member Exists" || 
              (errorBody.detail && errorBody.detail.toLowerCase().includes("already a list member"))) {
            return safeJsonResponse(res, 200, {
              success: true,
              status: "Member Exists",
              message: "Already subscribed",
              detail: `${email} is already on the mailing list.`
            });
          }
          
          return safeJsonResponse(res, err.status, {
            success: false,
            error: errorBody.title || 'Subscription failed',
            detail: errorBody.detail || 'Please check your details or try again later'
          });
        } catch (parseError) {
          console.error('Error parsing Mailchimp error response:', parseError);
          return safeJsonResponse(res, 502, {
            success: false,
            error: 'Error processing Mailchimp response',
            detail: err.message || 'Unknown error'
          });
        }
      }
      
      // Handle unauthorized errors with more detailed information
      if (err.status === 401) {
        return safeJsonResponse(res, 401, {
          success: false,
          error: 'Mailchimp API error: Unauthorized',
          detail: 'API key or server prefix may be incorrect. Please check your Mailchimp credentials.'
        });
      }
      
      return safeJsonResponse(res, err.status || 502, {
        success: false,
        error: 'Mailchimp API error',
        detail: err.message || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return safeJsonResponse(res, 500, {
      success: false,
      error: 'Internal server error',
      detail: error.message || 'An unexpected error occurred'
    });
  }
} 