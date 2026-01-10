import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as XLSX from 'xlsx';
import { randomBytes } from 'crypto';
import { Express } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByActivationToken(token: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { activationToken: token } 
    });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findInactiveAccounts(): Promise<User[]> {
    return await this.usersRepository.find({ 
      where: { isActive: false } 
    });
  }

  // NOUVELLE MÉTHODE : Import CSV
  async importUsersFromCSV(file: any) { 
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Vérifier l'extension du fichier
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Format de fichier non supporté. Utilisez .xlsx, .xls ou .csv');
    }

    // Lire le fichier Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Vérifier la limite de 5000 lignes
    if (data.length > 5000) {
      throw new BadRequestException('Le fichier ne doit pas contenir plus de 5000 lignes');
    }

    const results = {
      total: data.length,
      success: 0,
      errors: [] as any[],
    };

    // Traiter chaque ligne
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Valider les champs requis
        if (!row.nom || !row.prenom || !row.email || !row.role) {
          results.errors.push({
            line: i + 2, // +2 car ligne 1 = header
            email: row.email || 'N/A',
            error: 'Champs obligatoires manquants (nom, prenom, email, role)',
          });
          continue;
        }

        // Nettoyer les données
        const email = row.email.toString().trim().toLowerCase();
        const firstName = row.prenom.toString().trim();
        const lastName = row.nom.toString().trim();
        const role = row.role.toString().trim().toLowerCase();

        // Valider l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          results.errors.push({
            line: i + 2,
            email,
            error: 'Email invalide',
          });
          continue;
        }

        // Valider le rôle
        const validRoles = ['directeur', 'formateur', 'etudiant', 'technicien'];
        if (!validRoles.includes(role)) {
          results.errors.push({
            line: i + 2,
            email,
            error: `Rôle invalide. Valeurs acceptées: ${validRoles.join(', ')}`,
          });
          continue;
        }

        // Vérifier si l'email existe déjà
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
          results.errors.push({
            line: i + 2,
            email,
            error: 'Cet email existe déjà',
          });
          continue;
        }

        // Générer token d'activation
        const activationToken = randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

        // Créer l'utilisateur
        await this.create({
          email,
          firstName,
          lastName,
          role: role as any,
          activationToken,
          tokenExpiresAt,
          isActive: false,
          password: null,
        });

        results.success++;

      } catch (error) {
        results.errors.push({
          line: i + 2,
          email: row.email || 'N/A',
          error: error.message || 'Erreur inconnue',
        });
      }
    }

    return results;
  }
}