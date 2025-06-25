
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SecuritySettings {
  otpExpiryMinutes: number;
  passwordStrengthEnabled: boolean;
  breachedPasswordProtection: boolean;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
}

export function useAuthSecurity() {
  const [settings, setSettings] = useState<SecuritySettings>({
    otpExpiryMinutes: 5,
    passwordStrengthEnabled: true,
    breachedPasswordProtection: true,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15
  });

  // Validate password against known breaches (client-side check)
  const checkPasswordBreach = async (password: string): Promise<boolean> => {
    try {
      // Use SHA-1 hash for HaveIBeenPwned API (first 5 chars only)
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5).toUpperCase();
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) {
        console.warn('⚠️ [AuthSecurity] Breach check service unavailable');
        return false; // Fail open for security check
      }
      
      const results = await response.text();
      
      return results.includes(suffix);
    } catch (error) {
      console.warn('⚠️ [AuthSecurity] Password breach check failed:', error);
      return false; // Fail open for security check
    }
  };

  const validatePassword = async (password: string): Promise<{ isValid: boolean; error?: string }> => {
    // Basic strength validation
    if (password.length < 8) {
      return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, error: 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número' };
    }

    // Check for common weak patterns
    const weakPatterns = [
      /(.)\1{2,}/, // Repeated characters
      /123456|abcdef|qwerty/i, // Common sequences
      /password|admin|user/i, // Common words
    ];

    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        return { isValid: false, error: 'Senha contém padrões muito comuns. Escolha uma senha mais complexa.' };
      }
    }

    // Check against breached passwords if enabled
    if (settings.breachedPasswordProtection) {
      const isBreached = await checkPasswordBreach(password);
      if (isBreached) {
        return { 
          isValid: false, 
          error: 'Esta senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente para sua segurança.' 
        };
      }
    }

    return { isValid: true };
  };

  // Rate limiting for login attempts
  const checkRateLimit = (email: string): boolean => {
    const key = `login_attempts_${email}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const now = Date.now();
    
    // Clean old attempts (older than lockout duration)
    const recentAttempts = attempts.filter((timestamp: number) => 
      now - timestamp < settings.lockoutDurationMinutes * 60 * 1000
    );
    
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return recentAttempts.length < settings.maxLoginAttempts;
  };

  const recordLoginAttempt = (email: string): void => {
    const key = `login_attempts_${email}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    attempts.push(Date.now());
    localStorage.setItem(key, JSON.stringify(attempts));
  };

  const clearLoginAttempts = (email: string): void => {
    const key = `login_attempts_${email}`;
    localStorage.removeItem(key);
  };

  return {
    settings,
    validatePassword,
    checkPasswordBreach,
    checkRateLimit,
    recordLoginAttempt,
    clearLoginAttempts
  };
}
