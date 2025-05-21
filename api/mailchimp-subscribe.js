// Vercel serverless function for Mailchimp subscription

const mailchimp = require('@mailchimp/mailchimp_marketing');
const crypto = require('crypto');

/**
 * Vercel serverless function handler
 */
module.exports = async function handler(req, res) {
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
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('API endpoint triggered');
    
    // Parse request body (Vercel automatically parses JSON)
    let data;
    try {
      data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Parsed data:', data);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid JSON', 
        detail: parseError.message 
      });
    }
    
    // Extract fields from both direct properties and mergeFields
    const email = data.email;
    let name = data.name || (data.mergeFields && data.mergeFields.NAME);
    let phone = data.phone || (data.mergeFields && data.mergeFields.PHONE);
    let company = data.company || (data.mergeFields && data.mergeFields.COMPANY);
    let message = data.message || (data.mergeFields && data.mergeFields.MESSAGE);
    
    console.log('Received form data:', { email, name, phone, company, hasMessage: !!message });

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    console.log('Email validation passed');

    // Get environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    // Validate environment variables
    console.log('Mailchimp env check:', {
      hasApiKey: !!apiKey,
      apiKeyMasked: apiKey ? apiKey.slice(0, 4) + '...' : undefined,
      hasListId: !!listId,
      hasServerPrefix: !!serverPrefix
    });
    
    if (!apiKey || !listId || !serverPrefix) {
      console.error('Missing Mailchimp configuration:', { 
        hasApiKey: !!apiKey, 
        hasListId: !!listId, 
        hasServerPrefix: !!serverPrefix 
      });
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error',
        detail: 'Mailchimp is not properly configured on the server. Please check your environment variables.'
      });
    }
    console.log('Server configuration validated');

    // Configure Mailchimp client
    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix
    });
    
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

    try {
      // Use the Mailchimp API client to add/update the member
      const response = await mailchimp.lists.setListMember(
        listId,
        emailHash,
        subscriberData
      );
      
      console.log('Mailchimp API response:', response);
      
      // Handle successful response
      console.log('Successfully subscribed to Mailchimp:', email);
      return res.status(200).json({
        success: true,
        status: "Success",
        message: "Successfully subscribed!",
        detail: `${email} has been added to the mailing list.`,
        mailchimpResponse: response
      });
    } catch (err) {
      console.error('Mailchimp API error:', err.status, err.response ? err.response.text : '', err.message);
      
      // Handle the "already a member" case specially
      if (err.status === 400 && err.response && err.response.body) {
        try {
          const errorBody = JSON.parse(err.response.text || '{}');
          
          if (errorBody.title === "Member Exists" || 
              (errorBody.detail && errorBody.detail.toLowerCase().includes("already a list member"))) {
            return res.status(200).json({
              success: true,
              status: "Member Exists",
              message: "Already subscribed",
              detail: `${email} is already on the mailing list.`
            });
          }
          
          return res.status(err.status).json({
            success: false,
            error: errorBody.title || 'Subscription failed',
            detail: errorBody.detail || 'Please check your details or try again later',
            mailchimpResponse: errorBody
          });
        } catch (parseError) {
          console.error('Error parsing Mailchimp error response:', parseError);
          return res.status(502).json({
            success: false,
            error: 'Error processing Mailchimp response',
            detail: err.message || 'Unknown error'
          });
        }
      }
      
      return res.status(err.status || 502).json({
        success: false,
        error: 'Mailchimp API error',
        detail: err.message || 'Unknown error',
        mailchimpResponse: err.response ? err.response.text : null
      });
    }
  } catch (error) {
    console.error('Server error:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      detail: error.message
    });
  }
} 