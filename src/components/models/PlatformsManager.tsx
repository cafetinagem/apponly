import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { InstagramForm, TelegramForm, PrivacyForm } from './PlatformForms';

interface PlatformData {
  id: string;
  type: 'instagram' | 'telegram' | 'privacy';
  name: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

interface PlatformsManagerProps {
  platforms: PlatformData[];
  onAddPlatform: (type: 'instagram' | 'telegram' | 'privacy') => void;
  onUpdatePlatform: (id: string, field: string, value: string) => void;
  onRemovePlatform: (id: string) => void;
  showPassword: Record<string, boolean>;
  onTogglePassword: (platformId: string) => void;
}

export const PlatformsManager = ({
  platforms,
  onAddPlatform,
  onUpdatePlatform,
  onRemovePlatform,
  showPassword,
  onTogglePassword
}: PlatformsManagerProps) => {
  const renderPlatformForm = (platform: PlatformData) => {
    switch (platform.type) {
      case 'instagram':
        return (
          <InstagramForm
            key={platform.id}
            platform={platform}
            onUpdate={onUpdatePlatform}
            onRemove={onRemovePlatform}
            showPassword={showPassword[platform.id]}
            onTogglePassword={onTogglePassword}
          />
        );
      case 'telegram':
        return (
          <TelegramForm
            key={platform.id}
            platform={platform}
            onUpdate={onUpdatePlatform}
            onRemove={onRemovePlatform}
          />
        );
      case 'privacy':
        return (
          <PrivacyForm
            key={platform.id}
            platform={platform}
            onUpdate={onUpdatePlatform}
            onRemove={onRemovePlatform}
            showPassword={showPassword[platform.id]}
            onTogglePassword={onTogglePassword}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onAddPlatform('instagram')}
          className="flex items-center space-x-2 px-4 py-2.5 text-sm border border-border bg-background hover:bg-accent transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Instagram</span>
        </button>
        <button
          type="button"
          onClick={() => onAddPlatform('telegram')}
          className="flex items-center space-x-2 px-4 py-2.5 text-sm border border-border bg-background hover:bg-accent transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Telegram</span>
        </button>
        <button
          type="button"
          onClick={() => onAddPlatform('privacy')}
          className="flex items-center space-x-2 px-4 py-2.5 text-sm border border-border bg-background hover:bg-accent transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Privacy</span>
        </button>
      </div>

      {/* Platform Forms */}
      <div className="space-y-4">
        {platforms.length > 0 ? (
          platforms.map(platform => renderPlatformForm(platform))
        ) : (
          <div className="min-h-[100px] p-6 border-2 border-dashed border-border bg-accent/20">
            <div className="text-center text-muted-foreground">
              <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Nenhuma plataforma configurada</p>
              <p className="text-xs mt-1">
                Clique nos botões acima para adicionar Instagram, Telegram ou Privacy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
