
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts' // Using a slightly more recent std version
import { corsHeaders } from '../_shared/cors.ts'

console.log("Mailchimp subscribe function initializing.");

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Received new request:", req.method);
    const body = await req.json();
    const { email, name, phone, company } = body;
    console.log("Request body parsed:", body);

    if (!email) {
      console.error("Email is required, but not provided.");
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const MAILCHIMP_API_KEY = Deno.env.get('MAILCHIMP_API_KEY');
    const MAILCHIMP_SERVER_PREFIX = Deno.env.get('MAILCHIMP_SERVER_PREFIX');
    const MAILCHIMP_LIST_ID = Deno.env.get('MAILCHIMP_LIST_ID');

    console.log("Mailchimp Env Vars:", { hasApiKey: !!MAILCHIMP_API_KEY, hasServerPrefix: !!MAILCHIMP_SERVER_PREFIX, hasListId: !!MAILCHIMP_LIST_ID });


    if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
      console.error('Mailchimp environment variables not set in Supabase project secrets.');
      return new Response(JSON.stringify({ error: 'Mailchimp configuration error on server.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const mailchimpApiUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
    console.log("Mailchimp API URL:", mailchimpApiUrl);

    // Prepare subscriber data
    const mergeFields: { [key: string]: string | undefined } = {};
    if (name) {
      const nameParts = name.split(' ');
      mergeFields.FNAME = nameParts[0];
      if (nameParts.length > 1) {
        mergeFields.LNAME = nameParts.slice(1).join(' ');
      }
    }
    if (phone) mergeFields.PHONE = phone; // Assumes Mailchimp merge tag is 'PHONE'
    if (company) mergeFields.COMPANY = company; // Assumes Mailchimp merge tag is 'COMPANY'
    
    // Note: If your Mailchimp audience uses different merge field tags (e.g., MMERGE1 for phone),
    // you'll need to adjust 'PHONE', 'COMPANY', 'FNAME', 'LNAME' above accordingly.

    const subscriberData = {
      email_address: email,
      status: 'subscribed', // Use 'pending' if double opt-in is enabled in Mailchimp
      merge_fields: mergeFields,
    };
    console.log("Subscriber data to send:", JSON.stringify(subscriberData, null, 2));

    const mailchimpResponse = await fetch(mailchimpApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    const responseBodyText = await mailchimpResponse.text(); // Read body as text first for debugging
    console.log("Mailchimp API raw response status:", mailchimpResponse.status);
    console.log("Mailchimp API raw response body:", responseBodyText);

    if (!mailchimpResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseBodyText); // Try to parse as JSON
      } catch (e) {
        errorData = { title: "Mailchimp API Error", detail: responseBodyText || "Unknown error from Mailchimp" };
      }
      
      console.error('Mailchimp API error details:', errorData);
      const errorMessage = errorData.title || 'Failed to subscribe.';
      let detailMessage = errorData.detail || 'Please check your details or try again later.';
      if (errorData.title === "Member Exists" || (errorData.detail && errorData.detail.toLowerCase().includes("already a list member"))) {
        errorMessage_ = "Already Subscribed"; // Overriding error title
        detailMessage = `${email} is already subscribed to this list.`;
      } else if (errorData.title === "Invalid Resource") {
         detailMessage = `There was an issue with the data sent: ${errorData.detail}. Please check your email format.`;
      }


      return new Response(JSON.stringify({ error: errorMessage, detail: detailMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: mailchimpResponse.status,
      });
    }
    
    // Attempt to parse successful response as JSON
    let responseData;
    try {
        responseData = JSON.parse(responseBodyText);
    } catch (e) {
        console.warn("Could not parse successful Mailchimp response as JSON, but status was OK:", responseBodyText);
        responseData = { id: "unknown", message: "Successfully subscribed (non-JSON response)." };
    }
    console.log('Successfully subscribed to Mailchimp:', responseData);

    return new Response(JSON.stringify({ message: 'Successfully subscribed!', mailchimpResponse: responseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in mailchimp-subscribe function:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Internal server error', detail: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})

