import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  async generateSecret(email: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const secret = speakeasy.generateSecret({
      name: `SGU ERP (${email})`,
      length: 32,
    });

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: email,
      issuer: 'SGU ERP',
      encoding: 'base32',
    });

    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 1 minute time drift
    });
  }

  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }
}
