import 'dotenv/config';
import express from 'express';

import {
  getBarbersController,
  createBarbersController,
} from '../controllers/barbers.controller';

const router = express.Router();

router.get('/', getBarbersController);
router.post('/', createBarbersController);

export default router;
