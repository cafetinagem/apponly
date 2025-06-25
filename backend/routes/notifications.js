const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Criar notificação
router.post('/create', async (req, res) => {
  try {
    const { userId, title, message, type = 'info', priority = 'normal' } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({
        error: 'userId, title e message são obrigatórios'
      });
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: title,
        message: message,
        type: type,
        priority: priority,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      notification: data
    });

  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({
      error: 'Erro ao criar notificação',
      message: error.message
    });
  }
});

// Listar notificações do usuário
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, unreadOnly = false } = req.query;

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly === 'true') {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      notifications: data,
      total: data.length
    });

  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    res.status(500).json({
      error: 'Erro ao listar notificações',
      message: error.message
    });
  }
});

// Marcar como lida
router.put('/mark-read/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      notification: data
    });

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({
      error: 'Erro ao marcar notificação como lida',
      message: error.message
    });
  }
});

module.exports = router; 