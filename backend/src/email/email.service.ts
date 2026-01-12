import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendActivationEmail(
    email: string,
    firstName: string,
    lastName: string,
    activationToken: string,
  ) {
    console.log('📧 === DÉBUT ENVOI EMAIL ACTIVATION ===');
    console.log('📧 Destinataire:', email);
    console.log('📧 Nom:', firstName, lastName);
    console.log('📧 Token:', activationToken);

    const frontendUrl = this.configService.get('FRONTEND_URL');
    console.log('🌐 Frontend URL:', frontendUrl);
    
    const activationLink = `${frontendUrl}/activate?token=${activationToken}`;
    console.log('🔗 Lien activation complet:', activationLink);

    // Vérifier la config email
    console.log('⚙️ EMAIL_HOST:', this.configService.get('EMAIL_HOST'));
    console.log('⚙️ EMAIL_PORT:', this.configService.get('EMAIL_PORT'));
    console.log('⚙️ EMAIL_USER:', this.configService.get('EMAIL_USER'));
    console.log('⚙️ EMAIL_FROM:', this.configService.get('EMAIL_FROM'));

    try {
      console.log('📤 Envoi en cours...');
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activez votre compte - Plateforme Éducative',
        html: `
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
        `,
      });
      
      console.log('✅ Email envoyé avec SUCCÈS à:', email);
      console.log('📧 === FIN ENVOI EMAIL (SUCCÈS) ===');
      return { success: true };
      
    } catch (error) {
      console.error('❌ === ERREUR ENVOI EMAIL ===');
      console.error('❌ Type d\'erreur:', error.constructor.name);
      console.error('❌ Message:', error.message);
      console.error('❌ Code:', error.code);
      console.error('❌ Response:', error.response);
      console.error('❌ Stack complet:', error.stack);
      console.error('❌ === FIN ERREUR ===');
      
      // Throw l'erreur pour qu'elle remonte
      throw error;
    }
  }

  async sendActivationReminderEmail(
    email: string,
    firstName: string,
    activationToken: string,
  ) {
    console.log('🔄 === DÉBUT ENVOI EMAIL RAPPEL ===');
    console.log('📧 Destinataire:', email);
    
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const activationLink = `${frontendUrl}/activate?token=${activationToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Rappel : Activez votre compte',
        html: `
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
        `,
      });
      
      console.log('✅ Email rappel envoyé avec succès');
      console.log('🔄 === FIN ENVOI EMAIL RAPPEL (SUCCÈS) ===');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur envoi reminder:', error);
      console.error('❌ Message:', error.message);
      throw error;
    }
  }
}