import express, { Request, Response } from 'express';
import { testDataBaseConnection } from './database'; 
import cardRoutes from './routes/cardRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota principal de teste.
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor voando!');
});

// Rota de cards.
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  testDataBaseConnection();
  console.log(`Servidor rodando na porta ${PORT}`);
});
