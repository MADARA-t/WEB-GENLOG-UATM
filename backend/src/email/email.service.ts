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
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const activationLink = `${frontendUrl}/activate?token=${activationToken}`;

    try {
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
      return { success: true };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, error };
    }
  }

  async sendActivationReminderEmail(
    email: string,
    firstName: string,
    activationToken: string,
  ) {
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
      return { success: true };
    } catch (error) {
      console.error('Erreur envoi reminder:', error);
      return { success: false, error };
    }
  }
}