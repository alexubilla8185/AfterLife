import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  // Set up common CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle CORS preflight requests sent by the browser
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // These are public keys, but we serve them from a function to avoid
  // exposing them in the git repo and to have a single source of truth from env vars.
  const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: "Supabase environment variables are not set on the server." }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      supabaseUrl,
      supabaseAnonKey,
    }),
  };
};

export { handler };
