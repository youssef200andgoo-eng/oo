import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST) - invalid credentials should fail', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@sgu.edu.eg', password: 'WrongPassword123!' })
      .expect(401);
  });

  it('/api/v1/auth/login (POST) - valid admin credentials should return tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@sgu.edu.eg', password: 'Admin@SGU2026!' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.tokens).toBeDefined();
    expect(response.body.tokens.accessToken).toBeDefined();
    expect(response.body.tokens.refreshToken).toBeDefined();

    accessToken = response.body.tokens.accessToken;
    refreshToken = response.body.tokens.refreshToken;
  });

  it('/api/v1/auth/me (GET) - with JWT token should return profile', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toBe('admin@sgu.edu.eg');
      });
  });

  it('/api/v1/auth/refresh (POST) - refresh access token', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.tokens.accessToken).toBeDefined();
      });
  });
});
