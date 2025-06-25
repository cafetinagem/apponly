import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useModels } from '@/hooks/useModels';
import { useConnectionDiagnostic } from '@/hooks/useConnectionDiagnostic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ModelsDebugInfo() {
  const { user, loading: authLoading, isApproved, isAdmin } = useAuth();
  const { models, loading: modelsLoading } = useModels();
  const { isConnected, isLoading: connectionLoading, error: connectionError, latency, lastCheck, recheckConnection } = useConnectionDiagnostic();

  return (
    <Card className="mb-6 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-600">🐛 Debug Info - Modelos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold mb-2">🔐 Autenticação</h4>
            <div className="space-y-1 text-sm">
              <div>Loading: <Badge variant={authLoading ? "destructive" : "default"}>{authLoading ? "Sim" : "Não"}</Badge></div>
              <div>User ID: <span className="font-mono">{user?.id || "null"}</span></div>
              <div>Email: <span className="font-mono">{user?.email || "null"}</span></div>
              <div>Aprovado: <Badge variant={isApproved ? "default" : "destructive"}>{isApproved ? "Sim" : "Não"}</Badge></div>
              <div>Admin: <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Sim" : "Não"}</Badge></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">👥 Modelos</h4>
            <div className="space-y-1 text-sm">
              <div>Loading: <Badge variant={modelsLoading ? "destructive" : "default"}>{modelsLoading ? "Sim" : "Não"}</Badge></div>
              <div>Quantidade: <span className="font-mono">{models.length}</span></div>
              <div>Status: 
                <div className="ml-2 mt-1">
                  {models.length === 0 ? (
                    <Badge variant="secondary">Nenhum modelo</Badge>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="default">
                        Ativos: {models.filter(m => m.status === 'active').length}
                      </Badge>
                      <Badge variant="secondary">
                        Pendentes: {models.filter(m => m.status === 'pending').length}
                      </Badge>
                      <Badge variant="destructive">
                        Inativos: {models.filter(m => m.status === 'inactive').length}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">🌐 Conectividade</h4>
            <div className="space-y-1 text-sm">
              <div>Status: <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Conectado" : "Desconectado"}</Badge></div>
              <div>Latência: <span className="font-mono">{latency ? `${latency}ms` : "N/A"}</span></div>
              <div>Última verificação: <span className="font-mono">{lastCheck ? lastCheck.toLocaleTimeString() : "Nunca"}</span></div>
              {connectionError && (
                <div className="text-red-600 text-xs">
                  Erro: {connectionError}
                </div>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={recheckConnection}
                disabled={connectionLoading}
              >
                {connectionLoading ? "Testando..." : "Testar Conexão"}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">🔍 Logs do Console</h4>
          <p className="text-sm text-gray-600">
            Abra o console do navegador (F12) para ver logs detalhados:
          </p>
          <ul className="text-sm text-gray-600 ml-4 mt-1 list-disc">
            <li>🔐 [UnifiedAuth] - Logs de autenticação</li>
            <li>📥 [Models] - Logs de carregamento de modelos</li>
            <li>❌ - Erros encontrados</li>
            <li>✅ - Operações bem-sucedidas</li>
          </ul>
        </div>

        {modelsLoading && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Carregamento em Andamento</h4>
            <p className="text-sm text-yellow-700">
              Se este status não mudar em alguns segundos, pode haver um problema de conexão com o banco de dados.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Verifique o console do navegador para mais detalhes.
            </p>
          </div>
        )}

        {!authLoading && !user && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-semibold text-red-800 mb-2">❌ Usuário Não Autenticado</h4>
            <p className="text-sm text-red-700">
              Você precisa fazer login para acessar os modelos.
            </p>
          </div>
        )}

        {user && !isApproved && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
            <h4 className="font-semibold text-orange-800 mb-2">⏳ Aguardando Aprovação</h4>
            <p className="text-sm text-orange-700">
              Sua conta ainda não foi aprovada por um administrador.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 