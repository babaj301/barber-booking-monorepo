import { NextFunction, Request, Response } from 'express';
import {
  createBarber,
  getBarbers,
  getBarberById,
  editBarber,
  deleteBarber,
} from '../services/barbers.service';

export async function getBarbersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const barbers = await getBarbers();
    if (barbers) {
      res.status(200).json({
        barbers,
      });
    }
    console.log(barbers);
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find barbers',
    });
  }
}

export async function getBarbersByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const barber = await getBarberById(id);
    res.status(200).json({
      barber,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find barber',
    });
  }
}

export async function createBarbersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, user_id, bio, name, is_active } = req.body;
    if (!id || !user_id) {
      throw new Error('Incomplete credentials');
    }
    const newBarber = await createBarber(id, user_id, bio, is_active);
    return res
      .status(201)
      .json({ message: 'Barber created succesfully', barber: newBarber });
  } catch (error) {
    console.error('Error creating barber', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function editBarberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const { bio } = req.body;
    const barber = await editBarber(id, bio);
    res.status(200).json({
      barber,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find barber',
    });
  }
}

export async function deleteBarberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const barber = await deleteBarber(id);
    res.status(200).json({
      barber,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Couldnt find barber',
    });
  }
}
