import { Router } from 'express';
import { CardController } from '../controllers/CardController';

const cardRoutes = Router();

cardRoutes.get('/random', CardController.getRandomCard);

export default cardRoutes;
