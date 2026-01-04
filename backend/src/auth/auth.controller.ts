import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ENDPOINT TEMPORAIRE POUR HASHER UN MOT DE PASSE
  @Get('hash-password')
  async hashPassword(@Query('password') password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return { password, hashed };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.createAccount(registerDto);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Body() activateDto: ActivateAccountDto) {
    return this.authService.activateAccount(activateDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Déconnexion réussie' };
  }
}
