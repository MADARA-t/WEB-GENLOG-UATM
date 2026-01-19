import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PedagogicalSpacesService } from './pedagogical-spaces/pedagogical-spaces.service';
import { UsersService } from './users/users.service';
import { PromotionsService } from './promotions/promotions.service';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const usersService = app.get(UsersService);
    const promotionsService = app.get(PromotionsService);
    const spacesService = app.get(PedagogicalSpacesService);

    console.log('Seeding data...');

    // 1. Create Formateur
    let formateur = await usersService.findByEmail('formateur@demo.com');
    if (!formateur) {
        console.log('Creating Formateur...');
        // Note: Assuming create method hashes password, or we need to handle it. 
        // Checking UsersService create method logic would be ideal, but for now passing raw object
        // If UsersService.create expects a DTO, we should match it.
        // Based on standard NestJS patterns:
        formateur = await usersService.create({
            email: 'formateur@demo.com',
            password: 'password123',
            firstName: 'Jean',
            lastName: 'Dupont',
            role: UserRole.FORMATEUR,
            isActive: true,
        } as any);
    }

    // 2. Create Promotion
    let promotion = await promotionsService.findAll();
    let demoPromotion;
    if (promotion.length === 0) {
        console.log('Creating Promotion...');
        demoPromotion = await promotionsService.create({
            name: 'Promotion 2026',
            year: '2026',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
            createdBy: formateur.id
        } as any);
    } else {
        demoPromotion = promotion[0];
    }

    // 3. Create Pedagogical Space
    const spaces = await spacesService.findAll();
    if (spaces.length === 0) {
        console.log('Creating Pedagogical Space...');
        await spacesService.create({
            name: 'Espace Démo NestJS',
            description: 'Espace pédagogique pour le cours de Backend Avancé',
            promotionId: demoPromotion.id,
            formateurId: formateur.id,
            technicienId: null,
        });
        console.log('Pedagogical Space created!');
    } else {
        console.log('Pedagogical Space already exists.');
    }

    await app.close();
    console.log('Seeding complete.');
}

bootstrap();
