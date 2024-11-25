import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { RateLimiter } from "../rate-limit.ts";
import { CryptoService } from "../crypto.ts";

const rateLimiter = new RateLimiter();

serve(async (req) => {
  const ipAddress = req.headers.get("x-real-ip");
  const clientKey = req.headers.get("x-client-key");
  const requestSignature = req.headers.get("x-request-signature");
  
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verify client key
  const { data: keyData, error: keyError } = await supabase
    .from("client_keys")
    .select("key_hash, attempts, blocked_until")
    .eq("ip_address", ipAddress)
    .single();

  if (keyError || !keyData || !await CryptoService.verifyKey(clientKey!, keyData.key_hash)) {
    return new Response(
      JSON.stringify({ error: "Invalid client key" }),
      { status: 401 }
    );
  }

  // Check if blocked
  if (keyData.blocked_until && new Date(keyData.blocked_until) > new Date()) {
    return new Response(
      JSON.stringify({ 
        error: "Account temporarily blocked",
        blockedUntil: keyData.blocked_until 
      }),
      { status: 429 }
    );
  }

  // Rate limiting
  const { allowed, waitTime } = rateLimiter.checkRateLimit(ipAddress!);
  if (!allowed) {
    // Update blocked_until in database
    await supabase
      .from("client_keys")
      .update({ 
        blocked_until: new Date(Date.now() + waitTime).toISOString() 
      })
      .eq("ip_address", ipAddress);

    return new Response(
      JSON.stringify({ 
        error: "Too many attempts",
        waitTime 
      }),
      { status: 429 }
    );
  }

  // Verify request body signature
  const body = await req.json();
  if (!await CryptoService.verifyHMAC(JSON.stringify(body), requestSignature!)) {
    return new Response(
      JSON.stringify({ error: "Invalid request signature" }),
      { status: 401 }
    );
  }

  try {
    // Attempt authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    });

    if (authError) {
      // Increment failed attempts
      await supabase
        .from("client_keys")
        .update({ 
          attempts: keyData.attempts + 1 
        })
        .eq("ip_address", ipAddress);

      throw authError;
    }

    // Reset attempts on successful login
    await supabase
      .from("client_keys")
      .update({ 
        attempts: 0,
        blocked_until: null 
      })
      .eq("ip_address", ipAddress);

    // Log successful authentication
    await supabase
      .from("auth_audit_log")
      .insert({
        ip_address: ipAddress,
        event_type: "login_success",
        user_email: body.email,
        success: true
      });

    // Generate response signature
    const responseData = JSON.stringify({ 
      session: authData.session,
      user: authData.user 
    });
    const responseSignature = await CryptoService.generateHMAC(responseData);

    return new Response(responseData, {
      headers: {
        "Content-Type": "application/json",
        "X-Response-Signature": responseSignature
      }
    });

  } catch (error) {
    // Log failed attempt
    await supabase
      .from("auth_audit_log")
      .insert({
        ip_address: ipAddress,
        event_type: "login_failed",
        user_email: body.email,
        success: false,
        metadata: { error: error.message }
      });

    return new Response(
      JSON.stringify({ error: "Authentication failed" }),
      { status: 401 }
    );
  }
}); 