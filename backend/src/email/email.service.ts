import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;

  constructor(private configService: ConfigService) {
    console.log('🔧 Initialisation Brevo API...');
    const apiKey = this.configService.get('BREVO_API_KEY');
    console.log('🔑 API Key présente:', !!apiKey);
    
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }

  async sendActivationEmail(
    email: string,
    firstName: string,
    lastName: string,
    activationToken: string,
  ) {
    console.log('📧 === DÉBUT ENVOI EMAIL VIA API BREVO ===');
    console.log('📧 Destinataire:', email);
    
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const activationLink = `${frontendUrl}/activate?token=${activationToken}`;
    console.log('🔗 Lien:', activationLink);

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name: `${firstName} ${lastName}` }];
    sendSmtpEmail.sender = {
      email: this.configService.get('EMAIL_FROM'),
      name: 'Plateforme Éducative SETICE'
    };
    sendSmtpEmail.subject = 'Activez votre compte - Plateforme Éducative';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bienvenue ${firstName} ${lastName} !</h2>
        <p>Un compte a été créé pour vous sur la plateforme éducative.</p>
        <p>Pour activer votre compte et définir votre mot de passe, cliquez sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Activer mon compte
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Ce lien est valable pendant 7 jours.<br>
          Si vous n'avez pas demandé cette inscription, ignorez ce message.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
          <a href="${activationLink}">${activationLink}</a>
        </p>
      </div>
    `;

    try {
      console.log('📤 Envoi via API Brevo...');
      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Email envoyé ! Message ID:', result.body.messageId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur API Brevo:', error);
      console.error('❌ Response:', error.response?.body);
      throw error;
    }
  }

  async sendActivationReminderEmail(
    email: string,
    firstName: string,
    activationToken: string,
  ) {
    console.log('🔄 === ENVOI EMAIL RAPPEL VIA API ===');
    
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const activationLink = `${frontendUrl}/activate?token=${activationToken}`;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name: firstName }];
    sendSmtpEmail.sender = {
      email: this.configService.get('EMAIL_FROM'),
      name: 'Plateforme Éducative SETICE'
    };
    sendSmtpEmail.subject = 'Rappel : Activez votre compte';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bonjour ${firstName},</h2>
        <p>Nous remarquons que vous n'avez pas encore activé votre compte.</p>
        <p>Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" 
             style="background-color: #FF9800; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Activer maintenant
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Ce lien expirera bientôt. Activez votre compte dès maintenant pour ne pas perdre l'accès.
        </p>
      </div>
    `;

    try {
      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Email rappel envoyé ! Message ID:', result.body.messageId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur rappel:', error);
      throw error;
    }
  }
}
