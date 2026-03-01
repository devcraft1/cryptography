import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User, UserProfile, Streak } from '../entities';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserProfile, Streak]),
    PassportModule.register({ defaultStrategy: 'game-jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'ciphervault-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class GameAuthModule {}
