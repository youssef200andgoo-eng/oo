import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Students Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@sgu.edu.eg', password: 'Admin@SGU2026!' });

    accessToken = loginRes.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/students (GET) - get all students with valid bearer token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/students')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/api/v1/students (GET) - without token should fail with 401', () => {
    return request(app.getHttpServer())
      .get('/api/v1/students')
      .expect(401);
  });
});
