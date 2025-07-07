import express, { Request, Response } from 'express';
import { testDataBaseConnection } from './database';
import test from 'node:test';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor voando!');
});

app.listen(PORT, () => {
  testDataBaseConnection();
  console.log(`Servidor rodando na porta ${PORT}`);
});