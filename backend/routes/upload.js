const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuração do multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Máximo 5 arquivos
  },
  fileFilter: (req, file, cb) => {
    // Tipos permitidos
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

// Upload de imagem com otimização
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Nenhum arquivo enviado'
      });
    }

    const { userId, folder = 'uploads' } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID do usuário é obrigatório'
      });
    }

    // Otimizar imagem com sharp
    let processedBuffer = req.file.buffer;
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    if (req.file.mimetype.startsWith('image/')) {
      processedBuffer = await sharp(req.file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          mozjpeg: true 
        })
        .toBuffer();
    }

    // Upload para Supabase Storage
    const filePath = `${folder}/${userId}/${filename}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, processedBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    // Salvar metadados no banco
    const { data: fileRecord, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        user_id: userId,
        filename: filename,
        original_name: req.file.originalname,
        file_path: filePath,
        file_size: processedBuffer.length,
        mime_type: 'image/jpeg',
        public_url: urlData.publicUrl,
        folder: folder,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar metadados:', dbError);
    }

    res.json({
      success: true,
      file: {
        id: fileRecord?.id,
        filename: filename,
        url: urlData.publicUrl,
        size: processedBuffer.length,
        type: 'image/jpeg'
      }
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      error: 'Erro no upload',
      message: error.message
    });
  }
});

// Upload múltiplo de arquivos
router.post('/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Nenhum arquivo enviado'
      });
    }

    const { userId, folder = 'uploads' } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID do usuário é obrigatório'
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        let processedBuffer = file.buffer;
        let contentType = file.mimetype;
        let extension = file.originalname.split('.').pop();

        // Otimizar imagens
        if (file.mimetype.startsWith('image/')) {
          processedBuffer = await sharp(file.buffer)
            .resize(1920, 1080, { 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .jpeg({ quality: 85 })
            .toBuffer();
          
          contentType = 'image/jpeg';
          extension = 'jpg';
        }

        const filePath = `${folder}/${userId}/${filename}.${extension}`;

        // Upload para Supabase
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(filePath, processedBuffer, {
            contentType: contentType,
            cacheControl: '3600'
          });

        if (error) {
          console.error(`Erro no upload de ${file.originalname}:`, error);
          continue;
        }

        // URL pública
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        // Salvar metadados
        const { data: fileRecord } = await supabase
          .from('uploaded_files')
          .insert({
            user_id: userId,
            filename: filename,
            original_name: file.originalname,
            file_path: filePath,
            file_size: processedBuffer.length,
            mime_type: contentType,
            public_url: urlData.publicUrl,
            folder: folder,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        uploadedFiles.push({
          id: fileRecord?.id,
          filename: filename,
          originalName: file.originalname,
          url: urlData.publicUrl,
          size: processedBuffer.length,
          type: contentType
        });

      } catch (fileError) {
        console.error(`Erro ao processar ${file.originalname}:`, fileError);
      }
    }

    res.json({
      success: true,
      files: uploadedFiles,
      total: uploadedFiles.length
    });

  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({
      error: 'Erro no upload múltiplo',
      message: error.message
    });
  }
});

// Deletar arquivo
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'ID do usuário é obrigatório'
      });
    }

    // Buscar arquivo
    const { data: file, error: fetchError } = await supabase
      .from('uploaded_files')
      .select('file_path, user_id')
      .eq('id', fileId)
      .single();

    if (fetchError || !file) {
      return res.status(404).json({
        error: 'Arquivo não encontrado'
      });
    }

    // Verificar se é o dono do arquivo
    if (file.user_id !== userId) {
      return res.status(403).json({
        error: 'Não autorizado a deletar este arquivo'
      });
    }

    // Deletar do storage
    const { error: storageError } = await supabase.storage
      .from('uploads')
      .remove([file.file_path]);

    if (storageError) {
      console.error('Erro ao deletar do storage:', storageError);
    }

    // Deletar do banco
    const { error: dbError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;

    res.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({
      error: 'Erro ao deletar arquivo',
      message: error.message
    });
  }
});

// Listar arquivos do usuário
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { folder, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('uploaded_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (folder) {
      query = query.eq('folder', folder);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      files: data,
      total: data.length
    });

  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({
      error: 'Erro ao listar arquivos',
      message: error.message
    });
  }
});

// Error handler para multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Arquivo muito grande. Máximo 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Muitos arquivos. Máximo 5 arquivos.'
      });
    }
  }
  
  if (error.message === 'Tipo de arquivo não permitido') {
    return res.status(400).json({
      error: 'Tipo de arquivo não permitido'
    });
  }

  next(error);
});

module.exports = router; 