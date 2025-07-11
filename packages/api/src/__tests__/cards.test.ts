import request from 'supertest';
import { app, httpServer } from '../app';
import sequelize from '../database';

describe('Testando rota GET /cards/random', () => {
  // É executado depois de todos os testes
  afterAll(async () => {
    await sequelize.close();
    httpServer.close();
  });

  it('Deve retornar um card aleatório com status 200', async () => {
    const response = await request(app).get('/cards/random?type=truth&level=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('type', 'truth');
    expect(response.body).toHaveProperty('level', 1);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  it('Deve retornar status 404 quando não encontrar um card', async () => {
    const response = await request(app).get(
      '/cards/random?type=truth&level=999',
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Nenhuma carta encontrada com esses critérios.',
    });
  });
});
