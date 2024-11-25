import { crypto } from "https://deno.land/std/crypto/mod.ts";
import { encode as base64Encode } from "https://deno.land/std/encoding/base64.ts";

export class CryptoService {
  private static readonly KEY_SALT_LENGTH = 32;
  private static readonly HMAC_KEY = Deno.env.get('HMAC_SECRET_KEY');

  static async generateClientKey(): Promise<{ key: string; hash: string }> {
    const key = crypto.randomUUID();
    const salt = crypto.getRandomValues(new Uint8Array(this.KEY_SALT_LENGTH));
    const hash = await this.hashKey(key, salt);
    
    return {
      key,
      hash: `${base64Encode(salt)}.${hash}`
    };
  }

  static async hashKey(key: string, salt: Uint8Array): Promise<string> {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(key);
    
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new Uint8Array([...salt, ...keyBuffer])
    );
    
    return base64Encode(new Uint8Array(hashBuffer));
  }

  static async generateHMAC(data: string): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.HMAC_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(data)
    );

    return base64Encode(new Uint8Array(signature));
  }

  static async verifyHMAC(data: string, signature: string): Promise<boolean> {
    const expectedSignature = await this.generateHMAC(data);
    return signature === expectedSignature;
  }
} 