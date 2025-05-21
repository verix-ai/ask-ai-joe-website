// Netlify serverless function for Mailchimp subscription
// This will handle real submissions to the Mailchimp API

const mailchimp = require('@mailchimp/mailchimp_marketing');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  // DEBUG: Print all env vars
  console.log('ALL ENV VARS:', Object.keys(process.env));
  console.log('Mailchimp API Key exists:', !!process.env.MAILCHIMP_API_KEY);
  console.log('Mailchimp List ID exists:', !!process.env.MAILCHIMP_LIST_ID);
  console.log('Mailchimp Server Prefix exists:', !!process.env.MAILCHIMP_SERVER_PREFIX);
  
  // Set CORS headers for browser clients
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Request body:', event.body);
    
    // Parse request body
    const data = JSON.parse(event.body);
    console.log('Parsed data:', data);
    
    // Extract fields from both direct properties and mergeFields
    const email = data.email;
    let name = data.name || (data.mergeFields && data.mergeFields.NAME);
    let phone = data.phone || (data.mergeFields && data.mergeFields.PHONE);
    let company = data.company || (data.mergeFields && data.mergeFields.COMPANY);
    let message = data.message || (data.mergeFields && data.mergeFields.MESSAGE);
    
    console.log('Received form data:', { email, name, phone, company, hasMessage: !!message });

    // Validate required fields
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Email is required' 
        })
      };
    }
    
    console.log('Email validation passed');

    // Get environment variables or use hardcoded values for testing
    // IMPORTANT: Replace these with environment variables in production
    const apiKey = process.env.MAILCHIMP_API_KEY || '42709f9c4232a35cae6d405124b84886-us5';
    const listId = process.env.MAILCHIMP_LIST_ID || '9e58ad0be4';
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us5';

    // Validate environment variables
    console.log('Mailchimp env check:', {
      hasApiKey: !!apiKey,
      apiKeyMasked: apiKey ? apiKey.slice(0, 4) + '...' : undefined,
      hasListId: !!listId,
      listId,
      hasServerPrefix: !!serverPrefix,
      serverPrefix
    });
    if (!apiKey || !listId || !serverPrefix) {
      console.error('Missing Mailchimp configuration:', { 
        hasApiKey: !!apiKey, 
        hasListId: !!listId, 
        hasServerPrefix: !!serverPrefix 
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Server configuration error',
          detail: 'Mailchimp is not properly configured on the server. Please check your environment variables.'
        })
      };
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status: "Success",
          message: "Successfully subscribed!",
          detail: `${email} has been added to the mailing list.`,
          mailchimpResponse: response
        })
      };
    } catch (err) {
      console.error('Mailchimp API error:', err.status, err.response ? err.response.text : '', err.message);
      
      // Handle the "already a member" case specially
      if (err.status === 400 && err.response && err.response.body) {
        const errorBody = JSON.parse(err.response.text || '{}');
        
        if (errorBody.title === "Member Exists" || 
            (errorBody.detail && errorBody.detail.toLowerCase().includes("already a list member"))) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              status: "Member Exists",
              message: "Already subscribed",
              detail: `${email} is already on the mailing list.`
            })
          };
        }
        
        return {
          statusCode: err.status,
          headers,
          body: JSON.stringify({
            success: false,
            error: errorBody.title || 'Subscription failed',
            detail: errorBody.detail || 'Please check your details or try again later',
            mailchimpResponse: errorBody
          })
        };
      }
      
      return {
        statusCode: err.status || 502,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Mailchimp API error',
          detail: err.message || 'Unknown error',
          mailchimpResponse: err.response ? err.response.text : null
        })
      };
    }
  } catch (error) {
    console.error('Server error:', error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        detail: error.message
      })
    };
  }
};
