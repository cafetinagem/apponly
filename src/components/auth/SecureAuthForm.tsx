
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface SecureAuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export function SecureAuthForm({ type, onSubmit, loading }: SecureAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    if (type === 'signup') {
      setPasswordStrength(calculatePasswordStrength(pwd));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const isSignUp = type === 'signup';
  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Fraca';
    if (passwordStrength < 75) return 'Média';
    return 'Forte';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${type}-email`}>Email</Label>
        <Input
          id={`${type}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="seu@email.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${type}-password`}>Senha</Label>
        <div className="relative">
          <Input
            id={`${type}-password`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
            minLength={isSignUp ? 8 : undefined}
            disabled={loading}
            placeholder={isSignUp ? 'Mínimo 8 caracteres' : 'Sua senha'}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {isSignUp && password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Força da senha:</span>
              <span className={passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                {getStrengthText()}
              </span>
            </div>
            <Progress 
              value={passwordStrength} 
              className="h-2"
            />
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || (isSignUp && passwordStrength < 75)}
      >
        <Shield className="h-4 w-4 mr-2" />
        {loading ? (isSignUp ? 'Validando segurança...' : 'Entrando...') : (isSignUp ? 'Cadastro Seguro' : 'Entrar')}
      </Button>
      
      {isSignUp && passwordStrength < 75 && password && (
        <p className="text-xs text-red-600 text-center">
          Senha deve ser forte para prosseguir com o cadastro seguro
        </p>
      )}
    </form>
  );
}
