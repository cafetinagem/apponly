const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { body, validationResult } = require('express-validator');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Log de tentativa de acesso não autorizado
router.post('/log-unauthorized', [
  body('email').isEmail().normalizeEmail(),
  body('userId').isUUID(),
  body('attemptedResource').isString().trim(),
  body('userAgent').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { email, userId, attemptedResource, userAgent } = req.body;

    // Log no Supabase
    const { error } = await supabase
      .from('security_logs')
      .insert({
        user_id: userId,
        email: email,
        event_type: 'unauthorized_access_attempt',
        resource: attemptedResource,
        user_agent: userAgent,
        ip_address: req.ip,
        timestamp: new Date().toISOString(),
        metadata: {
          headers: req.headers,
          path: attemptedResource
        }
      });

    if (error) {
      console.error('Erro ao salvar log de segurança:', error);
    }

    // Log no console para monitoramento
    console.warn('🚨 TENTATIVA DE ACESSO NÃO AUTORIZADO:', {
      email,
      userId,
      resource: attemptedResource,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Log registrado'
    });

  } catch (error) {
    console.error('Erro no log de segurança:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar status de aprovação do usuário
router.get('/approval-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: 'ID do usuário é obrigatório'
      });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('status_conta, role, nome, email')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar status:', error);
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: data
    });

  } catch (error) {
    console.error('Erro ao verificar aprovação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Listar usuários pendentes (apenas admin)
router.get('/pending-users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de autorização necessário'
      });
    }

    // Verificar se é admin via Supabase
    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    // Verificar se é admin
    if (user.user.email !== 'onlycatbrasil@gmail.com') {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }
    }

    // Buscar usuários pendentes
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('status_conta', 'pendente')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      users: data
    });

  } catch (error) {
    console.error('Erro ao buscar usuários pendentes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Aprovar usuário (apenas admin)
router.post('/approve-user', [
  body('userId').isUUID(),
  body('adminId').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { userId, adminId } = req.body;

    // Verificar se quem está aprovando é admin
    const { data: adminProfile } = await supabase
      .from('user_profiles')
      .select('role, email')
      .eq('user_id', adminId)
      .single();

    if (!adminProfile || (adminProfile.role !== 'admin' && adminProfile.email !== 'onlycatbrasil@gmail.com')) {
      return res.status(403).json({
        error: 'Apenas administradores podem aprovar usuários'
      });
    }

    // Aprovar usuário
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        status_conta: 'aprovado',
        data_aprovacao: new Date().toISOString(),
        aprovado_por: adminId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Log da aprovação
    await supabase
      .from('security_logs')
      .insert({
        user_id: adminId,
        event_type: 'user_approval',
        resource: 'admin_panel',
        metadata: {
          approved_user: userId,
          approved_user_email: data.email
        },
        timestamp: new Date().toISOString()
      });

    res.json({
      success: true,
      message: 'Usuário aprovado com sucesso',
      user: data
    });

  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router; 