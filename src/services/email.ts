import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface N8nWebhookPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter?: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (process.env.EMAIL_PROVIDER === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';

      if (emailProvider === 'n8n') {
        return await this.sendViaWebhook(options);
      } else {
        return await this.sendViaSmtp(options);
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  private async sendViaSmtp(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      throw new Error('Transporter SMTP não configurado');
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('Credenciais SMTP não configuradas');
    }

    const mailOptions = {
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || this.stripHtml(options.html),
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Email enviado via SMTP:', info.messageId);
    return true;
  }

  private async sendViaWebhook(options: N8nWebhookPayload): Promise<boolean> {
    if (!process.env.N8N_WEBHOOK_URL) {
      throw new Error('URL do webhook n8n não configurada');
    }

    const payload = {
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || this.stripHtml(options.html),
      from: process.env.NEXT_PUBLIC_APP_NAME || 'Sistema',
    };

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro no webhook n8n: ${response.status} ${response.statusText}`);
    }

    console.log('Email enviado via webhook n8n');
    return true;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 10px;
              border: 1px solid #ddd;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${process.env.NEXT_PUBLIC_APP_NAME || 'Sistema'}</h1>
              <p>Redefinição de Senha</p>
            </div>
            
            <div class="content">
              <p>Olá,</p>
              
              <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </div>
              
              <p>Ou copie e cole o link abaixo no seu navegador:</p>
              <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                  <li>Este link expira em 1 hora</li>
                  <li>Se você não solicitou esta redefinição, ignore este email</li>
                  <li>Nunca compartilhe este link com outras pessoas</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Este é um email automático, não responda.</p>
              <p>© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME || 'Sistema'}. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Redefinição de Senha - ${process.env.NEXT_PUBLIC_APP_NAME || 'Sistema'}
      
      Olá,
      
      Você solicitou a redefinição de sua senha. Acesse o link abaixo para criar uma nova senha:
      
      ${resetUrl}
      
      IMPORTANTE:
      - Este link expira em 1 hora
      - Se você não solicitou esta redefinição, ignore este email
      - Nunca compartilhe este link com outras pessoas
      
      Este é um email automático, não responda.
    `;

    return this.sendEmail({
      to: email,
      subject: `Redefinir Senha - ${process.env.NEXT_PUBLIC_APP_NAME || 'Sistema'}`,
      html,
      text,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';

      if (emailProvider === 'n8n') {
        if (!process.env.N8N_WEBHOOK_URL) {
          throw new Error('URL do webhook n8n não configurada');
        }
        
        const response = await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'HEAD',
        });
        
        return response.ok;
      } else {
        if (!this.transporter) {
          throw new Error('Transporter SMTP não configurado');
        }

        await this.transporter.verify();
        return true;
      }
    } catch (error) {
      console.error('Erro ao testar conexão de email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();