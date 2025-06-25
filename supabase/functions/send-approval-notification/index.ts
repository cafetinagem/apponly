
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  userEmail: string;
  userName: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, userId }: ApprovalEmailRequest = await req.json();

    console.log(`📧 Enviando notificação de aprovação para novo usuário: ${userEmail}`);

    // Enviar email para o administrador (onlycatbrasil@gmail.com)
    const emailResponse = await resend.emails.send({
      from: "OnlyCat System <noreply@resend.dev>",
      to: ["onlycatbrasil@gmail.com"], // Email correto do administrador
      subject: "🔔 Novo Usuário Aguardando Aprovação - OnlyCat Brasil",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">🔔 Nova Solicitação de Acesso</h1>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">Detalhes do Usuário:</h2>
            <p><strong>Nome:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>ID do Usuário:</strong> ${userId}</p>
            <p><strong>Data da Solicitação:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              ⚠️ <strong>Ação Necessária:</strong> Este usuário está aguardando aprovação manual para acessar o sistema OnlyCat Brasil.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">Para aprovar ou rejeitar este usuário, acesse o painel administrativo do sistema.</p>
            <a href="https://only-cat-command-center.lovable.app/" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
              Acessar Painel Admin
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Este é um email automático do sistema OnlyCat Brasil. Não responda este email.
          </p>
        </div>
      `,
    });

    console.log("✅ Email de notificação enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Notificação enviada com sucesso",
      emailId: emailResponse.data?.id,
      recipient: "onlycatbrasil@gmail.com"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Erro ao enviar notificação de aprovação:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
