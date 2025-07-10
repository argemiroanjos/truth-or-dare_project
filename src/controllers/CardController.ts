import { Request, Response, RequestHandler } from 'express';
import Card from '../models/Card';
import { literal } from 'sequelize';

const getRandomCard: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { type, level } = req.query;

    const card = await Card.findOne({
      where: {
        type: type as string,
        level: Number(level),
      },
      order: literal('RAND()'),
    });

    if (!card) {
      res
        .status(404)
        .json({ message: 'Nenhuma carta encontrada com esses critérios.' });
      return;
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Erro ao buscar carta aleatória:', error);
    res.status(500).json({ message: 'Erro ao buscar carta aleatória.' });
  }
};

export const CardController = {
  getRandomCard,
};
