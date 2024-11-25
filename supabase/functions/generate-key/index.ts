import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { RateLimiter } from "../rate-limit.ts";
import { CryptoService } from "../crypto.ts";

const rateLimiter = new RateLimiter();
const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN"),
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type, X-Request-Signature",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const ipAddress = req.headers.get("x-real-ip");
  const origin = req.headers.get("origin");
  const requestSignature = req.headers.get("x-request-signature");

  // Verify request origin
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: originData } = await supabase
    .from("allowed_origins")
    .select("origin")
    .eq("origin", origin)
    .single();

  if (!originData) {
    return new Response(
      JSON.stringify({ error: "Invalid origin" }),
      { 
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  // Check rate limits
  const { allowed, waitTime } = rateLimiter.checkRateLimit(ipAddress!);
  if (!allowed) {
    return new Response(
      JSON.stringify({ 
        error: "Rate limit exceeded",
        waitTime 
      }),
      { 
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  // Generate new client key
  const { key, hash } = await CryptoService.generateClientKey();
  
  // Store key hash
  const { error } = await supabase
    .from("client_keys")
    .upsert({
      ip_address: ipAddress,
      key_hash: hash,
      key_time: new Date().toISOString(),
      attempts: 0,
      last_attempt: new Date().toISOString()
    }, {
      onConflict: "ip_address"
    });

  if (error) {
    // Log the error to audit log
    await supabase
      .from("auth_audit_log")
      .insert({
        ip_address: ipAddress,
        event_type: "key_generation_failed",
        success: false,
        metadata: { error: error.message }
      });

    return new Response(
      JSON.stringify({ error: "Failed to generate key" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  // Log successful key generation
  await supabase
    .from("auth_audit_log")
    .insert({
      ip_address: ipAddress,
      event_type: "key_generated",
      success: true
    });

  // Generate HMAC for the response
  const responseData = JSON.stringify({ key });
  const signature = await CryptoService.generateHMAC(responseData);

  return new Response(
    responseData,
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Response-Signature": signature
      }
    }
  );
}); 