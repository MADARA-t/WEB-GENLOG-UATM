import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async createAccount(registerDto: RegisterDto) {
    console.log('🔵 DÉBUT création compte pour:', registerDto.email);
    
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const activationToken = randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

    console.log('🟡 Création utilisateur dans la BDD...');
    const user = await this.usersService.create({
      ...registerDto,
      activationToken,
      tokenExpiresAt,
      isActive: false,
    });
    console.log('🟢 Utilisateur créé, ID:', user.id);

    // ENVOYER L'EMAIL D'ACTIVATION
    console.log('📧 Tentative envoi email à:', user.email);
    console.log('🔑 Token généré:', activationToken);
    
    try {
      const result = await this.emailService.sendActivationEmail(
        user.email,
        user.firstName,
        user.lastName,
        activationToken,
      );
      console.log('✅ Résultat envoi email:', result);
    } catch (error) {
      console.error('❌ ERREUR dans auth.service lors envoi email:', error);
      console.error('❌ Message d\'erreur:', error.message);
      // On ne throw pas l'erreur pour que le compte soit quand même créé
    }

    console.log('🎉 Processus de création terminé');
    return {
      message: 'Compte créé avec succès. Un email d\'activation a été envoyé.',
      userId: user.id,
    };
  }

  // ✨ NOUVELLE MÉTHODE : Renvoyer l'email d'activation
  async resendActivationEmail(userId: number) {
    console.log('🔄 Renvoi email activation pour userId:', userId);
    
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.isActive) {
      throw new BadRequestException('Ce compte est déjà activé');
    }

    // Générer un nouveau token si l'ancien a expiré
    let activationToken = user.activationToken;
    if (!activationToken || (user.tokenExpiresAt && new Date() > user.tokenExpiresAt)) {
      console.log('🔑 Génération nouveau token...');
      activationToken = randomBytes(32).toString('hex');
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

      await this.usersService.update(user.id, {
        activationToken,
        tokenExpiresAt,
      });
    }

    // Envoyer l'email de rappel
    console.log('📧 Envoi email de rappel à:', user.email);
    try {
      await this.emailService.sendActivationReminderEmail(
        user.email,
        user.firstName,
        activationToken,
      );
      console.log('✅ Email de rappel envoyé');
    } catch (error) {
      console.error('❌ Erreur envoi email de rappel:', error);
      throw error;
    }

    return {
      message: 'Email de relance envoyé avec succès',
    };
  }

  async activateAccount(activateDto: ActivateAccountDto) {
    const { token, password } = activateDto;

    const user = await this.usersService.findByActivationToken(token);
    
    if (!user) {
      throw new BadRequestException('Token d\'activation invalide');
    }

    if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
      throw new BadRequestException('Le token d\'activation a expiré');
    }

    if (user.isActive) {
      throw new BadRequestException('Ce compte est déjà activé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      isActive: true,
      activationToken: null,
      tokenExpiresAt: null,
    });

    return {
      message: 'Compte activé avec succès. Vous pouvez maintenant vous connecter.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Votre compte n\'est pas encore activé. Vérifiez vos emails.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Connexion réussie',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(userId: number) {
    return await this.usersService.findOne(userId);
  }
}