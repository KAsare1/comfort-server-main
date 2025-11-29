// src/drivers/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DriversService } from '../drivers/drivers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'driver-jwt') {
  constructor(
    private driversService: DriversService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const driver = await this.driversService.findById(payload.sub);
    
    if (!driver) {
      throw new UnauthorizedException('Driver not found');
    }

    // Remove password from response
    const { password, ...driverWithoutPassword } = driver;
    return driverWithoutPassword;
  }
}