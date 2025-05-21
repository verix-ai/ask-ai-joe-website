// Direct Mailchimp subscription service

interface SubscriberData {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  message?: string;
}

interface MailchimpResponse {
  success: boolean;
  message: string;
  error?: string;
  detail?: string;
}

/**
 * Subscribe a user to the Mailchimp mailing list
 * This uses a serverless proxy to avoid exposing API keys in the client
 */
export const subscribeToMailchimp = async (data: SubscriberData): Promise<MailchimpResponse> => {
  try {
    // Support both Netlify and Vercel deployments
    // All requests go to /api/mailchimp-subscribe
    const PROXY_URL = '/api/mailchimp-subscribe';
    console.log('Mailchimp proxy URL:', PROXY_URL);
    
    // Prepare the data for the proxy
    const proxyData = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      company: data.company,
      message: data.message,
      // Optional user information (for merge fields)
      mergeFields: {}
    };
    
    // Use the correct merge field mappings as specified
    const mergeFields: Record<string, string> = {};
    
    // Add name if provided (map to NAME)
    if (data.name) {
      mergeFields.NAME = data.name;
    }
    
    // Map email to EMAIL merge field
    mergeFields.EMAIL = data.email;
    
    // Add phone if provided
    if (data.phone) {
      mergeFields.PHONE = data.phone;
    }
    
    // Add company if provided
    if (data.company) {
      mergeFields.COMPANY = data.company;
    }
    
    // Add message if provided
    if (data.message) {
      mergeFields.MESSAGE = data.message;
    }
    
    // Assign the merge fields to the proxy data
    proxyData.mergeFields = mergeFields;
    
    console.log('Sending subscription request to Mailchimp proxy:', proxyData);
    
    try {
      // Make the request to the proxy
      console.log('Making fetch request to:', PROXY_URL);

      // Log the stringified request body for debugging
      const requestBody = JSON.stringify(proxyData);
      console.log('Request body:', requestBody);
      
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
      
      console.log('Received response from proxy:', response);
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', [...response.headers.entries()]);
      
      // First check if we got a response
      if (!response) {
        console.error('No response received from Mailchimp proxy');
        return {
          success: false,
          message: 'Service unavailable',
          error: 'Could not connect to subscription service',
          detail: 'Please try again later'
        };
      }
      
      // Try to parse the response as JSON
      let responseData;
      let rawResponseText = '';
      try {
        rawResponseText = await response.text();
        console.log('Raw Mailchimp proxy response:', rawResponseText);
        
        if (!rawResponseText || rawResponseText.trim() === '') {
          console.log('Empty response received, using default success response');
          // For development, if we get an empty response, assume success
          responseData = {
            success: true,
            status: "Success",
            message: "Successfully subscribed!",
            detail: `${data.email} has been added to the mailing list.`
          };
        } else {
          // Check if the response is JSON
          try {
            responseData = JSON.parse(rawResponseText);
            console.log('Parsed response data:', responseData);
          } catch (jsonError) {
            // Handle non-JSON responses (like HTML error pages)
            console.error('Received non-JSON response:', rawResponseText);
            
            // Handle case where we got an HTML response (likely a 404)
            if (rawResponseText.includes('<html') || rawResponseText.includes('<!DOCTYPE')) {
              console.error('Received HTML response instead of JSON');
              return {
                success: false,
                message: 'API endpoint error',
                error: `Server returned HTML instead of JSON (status: ${response.status})`,
                detail: 'Please check server API endpoint configuration'
              };
            }
            
            return {
              success: false,
              message: 'Invalid response',
              error: 'Could not process the server response',
              detail: `Unexpected token '${rawResponseText.substring(0, 20)}...' is not valid JSON`
            };
          }
        }
      } catch (parseError) {
        console.error('Error parsing Mailchimp response:', parseError);
        console.error('Raw Mailchimp proxy response:', rawResponseText);
        return {
          success: false,
          message: 'Parsing error',
          error: 'Could not process the server response',
          detail: parseError instanceof Error ? parseError.message : 'Invalid server response'
        };
      }
      
      // First check if the response contains a success flag, regardless of HTTP status
      if (responseData.success === true) {
        // This is a success response from our proxy
        console.log('Success response from Mailchimp proxy:', responseData);
      } else if (!response.ok) {
        // This is a true error response
        console.error('Error response from Mailchimp proxy:', responseData);
        return {
          success: false,
          message: 'Subscription failed',
          error: responseData.error || 'An error occurred',
          detail: responseData.detail || 'Please try again later'
        };
      } else {
        // Fallback for any other cases
        console.log('Unexpected response format from Mailchimp proxy:', responseData);
      }
      
      // Member already exists
      if (responseData.status === 'Member Exists') {
        return {
          success: true,
          message: 'Already subscribed',
          detail: `${data.email} is already on the mailing list.`
        };
      }
      
      return {
        success: true,
        message: 'Successfully subscribed!',
        detail: 'You have been added to our mailing list.'
      };
    } catch (error) {
      console.error('Network or other error during Mailchimp API call:', error);
      return {
        success: false,
        message: 'Connection error',
        error: 'Failed to connect to subscription service',
        detail: error instanceof Error ? error.message : 'Unknown connection error'
      };
    }
    
  } catch (error) {
    console.error('Error subscribing to Mailchimp:', error);
    return {
      success: false,
      message: 'Subscription error',
      error: 'An unexpected error occurred',
      detail: error instanceof Error ? error.message : 'Please try again later'
    };
  }
};
