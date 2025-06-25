
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export function AuthForm({ type, onSubmit, loading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const isSignUp = type === 'signup';

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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${type}-password`}>Senha</Label>
        <div className="relative">
          <Input
            id={`${type}-password`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isSignUp ? 6 : undefined}
            disabled={loading}
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
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (isSignUp ? 'Cadastrando...' : 'Entrando...') : (isSignUp ? 'Cadastrar' : 'Entrar')}
      </Button>
    </form>
  );
}
