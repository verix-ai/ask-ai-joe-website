// A simple serverless function that can be deployed to Vercel or Netlify
// This acts as a proxy for Mailchimp API calls to avoid exposing your API key in the browser

// Mock implementation for local testing
// In production, deploy this as a serverless function
export async function handleSubscription(req) {
  const { email, listId, mergeFields = {} } = req;

  if (!email) {
    return {
      status: 400,
      body: JSON.stringify({
        error: "Email is required",
        success: false
      })
    };
  }

  if (!listId) {
    return {
      status: 400,
      body: JSON.stringify({
        error: "List ID is required",
        success: false
      })
    };
  }

  console.log(`[Mailchimp Proxy] Subscribing ${email} to list ${listId} with fields:`, mergeFields);

  // For local development, return a mock success response
  // In production, you would make the actual Mailchimp API call here
  return {
    status: 200,
    body: JSON.stringify({
      success: true,
      status: "Success",
      message: "Successfully subscribed!",
      detail: `${email} has been added to the mailing list.`
    })
  };
}
