
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Eye, EyeOff } from 'lucide-react';

interface PlatformData {
  id: string;
  type: 'instagram' | 'telegram' | 'privacy';
  name: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

interface PlatformFormProps {
  platform: PlatformData;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
  showPassword?: boolean;
  onTogglePassword?: (platformId: string) => void;
}

export const InstagramForm = ({ platform, onUpdate, onRemove, showPassword, onTogglePassword }: PlatformFormProps) => {
  return (
    <div className="border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div>
            <span className="font-medium text-foreground">Instagram</span>
            <p className="text-xs text-muted-foreground">Configure a conta do Instagram</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(platform.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Nome da Plataforma</Label>
          <Input
            value={platform.name}
            onChange={(e) => onUpdate(platform.id, 'name', e.target.value)}
            placeholder="Instagram"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Username</Label>
          <Input
            value={platform.username || ''}
            onChange={(e) => onUpdate(platform.id, 'username', e.target.value)}
            placeholder="@username"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Email</Label>
          <Input
            type="email"
            value={platform.email || ''}
            onChange={(e) => onUpdate(platform.id, 'email', e.target.value)}
            placeholder="email@gmail.com"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Senha</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={platform.password || ''}
              onChange={(e) => onUpdate(platform.id, 'password', e.target.value)}
              placeholder="Senha da conta"
              className="bg-background border-input text-foreground pr-10"
            />
            {onTogglePassword && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => onTogglePassword(platform.id)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TelegramForm = ({ platform, onUpdate, onRemove }: PlatformFormProps) => {
  return (
    <div className="border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <div>
            <span className="font-medium text-foreground">Telegram</span>
            <p className="text-xs text-muted-foreground">Configure a conta do Telegram</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(platform.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Nome da Plataforma</Label>
          <Input
            value={platform.name}
            onChange={(e) => onUpdate(platform.id, 'name', e.target.value)}
            placeholder="Telegram"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Username</Label>
          <Input
            value={platform.username || ''}
            onChange={(e) => onUpdate(platform.id, 'username', e.target.value)}
            placeholder="@username"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-foreground">Número de Telefone</Label>
          <Input
            value={platform.phoneNumber || ''}
            onChange={(e) => onUpdate(platform.id, 'phoneNumber', e.target.value)}
            placeholder="+5511999999999"
            className="bg-background border-input text-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export const PrivacyForm = ({ platform, onUpdate, onRemove, showPassword, onTogglePassword }: PlatformFormProps) => {
  return (
    <div className="border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div>
            <span className="font-medium text-foreground">Privacy</span>
            <p className="text-xs text-muted-foreground">Configure a conta do Privacy</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(platform.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Nome da Plataforma</Label>
          <Input
            value={platform.name}
            onChange={(e) => onUpdate(platform.id, 'name', e.target.value)}
            placeholder="Privacy"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Email</Label>
          <Input
            type="email"
            value={platform.email || ''}
            onChange={(e) => onUpdate(platform.id, 'email', e.target.value)}
            placeholder="email@privacy.com"
            className="bg-background border-input text-foreground"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label className="text-sm font-medium text-foreground">Senha</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={platform.password || ''}
              onChange={(e) => onUpdate(platform.id, 'password', e.target.value)}
              placeholder="Senha da conta"
              className="bg-background border-input text-foreground pr-10"
            />
            {onTogglePassword && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => onTogglePassword(platform.id)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
