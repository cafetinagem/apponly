const express = require('express');
const router = express.Router();
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configurações de email por provedor
const EMAIL_CONFIGS = {
  gmail: {
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  },
  outlook: {
    host: 'outlook.office365.com',
    port: 993,
    tls: true
  },
  yahoo: {
    host: 'imap.mail.yahoo.com',
    port: 993,
    tls: true
  }
};

// Teste de conexão de email
router.post('/test-connection', async (req, res) => {
  try {
    const { email, password, provider } = req.body;
    
    if (!email || !password || !provider) {
      return res.status(400).json({
        error: 'Email, password e provider são obrigatórios'
      });
    }

    const config = EMAIL_CONFIGS[provider];
    if (!config) {
      return res.status(400).json({
        error: 'Provedor não suportado'
      });
    }

    const imapConfig = {
      user: email,
      password: password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      authTimeout: 10000,
      connTimeout: 10000
    };

    return new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);
      
      const timeout = setTimeout(() => {
        imap.destroy();
        reject(new Error('Timeout na conexão'));
      }, 15000);

      imap.once('ready', () => {
        clearTimeout(timeout);
        imap.end();
        resolve(res.json({
          success: true,
          message: 'Conexão estabelecida com sucesso',
          provider: provider
        }));
      });

      imap.once('error', (err) => {
        clearTimeout(timeout);
        console.error('Erro IMAP:', err);
        reject(err);
      });

      try {
        imap.connect();
      } catch (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });

  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    res.status(500).json({
      error: 'Erro na conexão',
      message: error.message
    });
  }
});

// Sincronizar emails e extrair vendas
router.post('/sync-sales', async (req, res) => {
  try {
    const { email, password, provider, userId } = req.body;
    
    if (!email || !password || !provider || !userId) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios'
      });
    }

    const config = EMAIL_CONFIGS[provider];
    const imapConfig = {
      user: email,
      password: password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      authTimeout: 10000,
      connTimeout: 10000
    };

    const sales = await syncEmailsForSales(imapConfig, userId);
    
    res.json({
      success: true,
      salesFound: sales.length,
      sales: sales
    });

  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({
      error: 'Erro na sincronização',
      message: error.message
    });
  }
});

// Função para sincronizar emails e extrair vendas
async function syncEmailsForSales(imapConfig, userId) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const sales = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) return reject(err);

        // Buscar emails dos últimos 30 dias
        const since = new Date();
        since.setDate(since.getDate() - 30);
        
        const searchCriteria = [
          'UNSEEN',
          ['SINCE', since],
          ['OR', 
            ['SUBJECT', 'venda'],
            ['SUBJECT', 'recebido'],
            ['SUBJECT', 'payment'],
            ['SUBJECT', 'PIX'],
            ['SUBJECT', 'Privacy']
          ]
        ];

        imap.search(searchCriteria, (err, results) => {
          if (err || !results.length) {
            imap.end();
            return resolve(sales);
          }

          const fetch = imap.fetch(results, { bodies: '', markSeen: false });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) return;

                const saleData = extractSaleFromEmail(parsed);
                if (saleData) {
                  try {
                    // Salvar venda no Supabase
                    const { data, error } = await supabase
                      .from('sales')
                      .insert({
                        ...saleData,
                        user_id: userId,
                        source: 'email_automation',
                        created_at: new Date().toISOString()
                      });

                    if (!error) {
                      sales.push(saleData);
                    }
                  } catch (dbError) {
                    console.error('Erro ao salvar venda:', dbError);
                  }
                }
              });
            });
          });

          fetch.once('end', () => {
            imap.end();
            resolve(sales);
          });

          fetch.once('error', (err) => {
            imap.end();
            reject(err);
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

// Extrair dados de venda do email
function extractSaleFromEmail(parsed) {
  const subject = parsed.subject || '';
  const text = parsed.text || '';
  const html = parsed.html || '';
  const content = `${subject} ${text} ${html}`.toLowerCase();

  // Padrões para detectar valores
  const valuePatterns = [
    /r\$\s*(\d+(?:[.,]\d{2})?)/gi,
    /\$\s*(\d+(?:[.,]\d{2})?)/gi,
    /(\d+(?:[.,]\d{2}))\s*reais/gi,
    /valor.*?(\d+(?:[.,]\d{2}))/gi
  ];

  let amount = 0;
  let platform = 'unknown';

  // Detectar valor
  for (const pattern of valuePatterns) {
    const match = content.match(pattern);
    if (match) {
      const value = match[0].replace(/[^\d.,]/g, '').replace(',', '.');
      amount = parseFloat(value);
      break;
    }
  }

  if (amount === 0) return null;

  // Detectar plataforma
  if (content.includes('privacy')) platform = 'Privacy';
  else if (content.includes('pix')) platform = 'PIX';
  else if (content.includes('paypal')) platform = 'PayPal';
  else if (content.includes('stripe')) platform = 'Stripe';
  else if (content.includes('mercadopago')) platform = 'MercadoPago';

  return {
    amount: amount,
    platform: platform,
    description: subject.substring(0, 200),
    email_subject: subject,
    sale_date: parsed.date || new Date()
  };
}

// Configurar integração de email
router.post('/configure', async (req, res) => {
  try {
    const { userId, email, provider, isActive } = req.body;

    const { data, error } = await supabase
      .from('email_integrations')
      .upsert({
        user_id: userId,
        email: email,
        provider: provider,
        is_active: isActive,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Erro ao configurar integração:', error);
    res.status(500).json({
      error: 'Erro ao configurar integração',
      message: error.message
    });
  }
});

module.exports = router; 