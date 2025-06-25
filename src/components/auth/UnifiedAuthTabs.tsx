
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Shield, UserPlus, LogIn } from 'lucide-react';

interface UnifiedAuthTabsProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
  mode?: 'standard' | 'secure';
  showSignUp?: boolean;
}

export function UnifiedAuthTabs({ 
  onSignIn, 
  onSignUp, 
  loading, 
  mode = 'standard',
  showSignUp = true 
}: UnifiedAuthTabsProps) {
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword.trim()) return;
    await onSignIn(signInEmail, signInPassword);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail.trim() || !signUpPassword.trim()) return;
    if (signUpPassword !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    await onSignUp(signUpEmail, signUpPassword);
  };

  const isSecureMode = mode === 'secure';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Entrar
        </TabsTrigger>
        {showSignUp && (
          <TabsTrigger value="signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Cadastrar
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="signin" className="space-y-4">
        <Card className={isSecureMode ? "border-green-200 shadow-lg" : ""}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              {isSecureMode && <Shield className="h-5 w-5 text-green-600" />}
              Acesso {isSecureMode ? 'Seguro' : 'ao Sistema'}
            </CardTitle>
            <CardDescription>
              {isSecureMode 
                ? 'Sistema com validações de segurança avançadas'
                : 'Entre com suas credenciais'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  disabled={loading}
                  className={isSecureMode ? "border-green-300 focus:border-green-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={loading}
                    className={isSecureMode ? "border-green-300 focus:border-green-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className={`w-full ${isSecureMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={loading || !signInEmail.trim() || !signInPassword.trim()}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {showSignUp && (
        <TabsContent value="signup" className="space-y-4">
          <Card className={isSecureMode ? "border-blue-200 shadow-lg" : ""}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                {isSecureMode && <Shield className="h-5 w-5 text-blue-600" />}
                Criar Conta {isSecureMode ? 'Segura' : ''}
              </CardTitle>
              <CardDescription>
                {isSecureMode 
                  ? 'Cadastro com validações de segurança rigorosas'
                  : 'Crie sua conta para acessar o sistema'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    disabled={loading}
                    className={isSecureMode ? "border-blue-300 focus:border-blue-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      disabled={loading}
                      className={isSecureMode ? "border-blue-300 focus:border-blue-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className={isSecureMode ? "border-blue-300 focus:border-blue-500" : ""}
                  />
                </div>
                <Button 
                  type="submit" 
                  className={`w-full ${isSecureMode ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  disabled={loading || !signUpEmail.trim() || !signUpPassword.trim() || signUpPassword !== confirmPassword}
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
