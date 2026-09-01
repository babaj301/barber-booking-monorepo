import { NextFunction, Request, Response } from 'express';
import {
  createBarber,
  getBarbers,
  getBarberById,
  editBarber,
  deleteBarber,
  reActivateBarber,
} from '../services/barbers.service';

export async function getBarbersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { search } = req.query;
    const barbers = search
      ? await getBarbers(String(search))
      : await getBarbers();
    res.status(200).json({ barbers });
  } catch (error) {
    console.error('Error fetching barbers', error);
    res.status(404).json({ message: "Couldn't find barbers" });
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
    res.status(200).json({ barber });
  } catch (error) {
    console.error('Error fetching barber', error);
    res.status(404).json({ message: "Couldn't find barber" });
  }
}

export async function createBarbersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { user_id, bio, is_active } = req.body;
    if (!user_id) {
      throw new Error('Incomplete credentials');
    }
    const newBarber = await createBarber(user_id, bio, is_active);
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
      message: 'Barber edited',
      barber,
    });
  } catch (error) {
    console.error('Error editing barber', error);
    res.status(404).json({ message: "Couldn't find barber" });
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
      message: 'Barber deactivated',
      barber,
    });
  } catch (error) {
    console.error('Error deleting barber', error);
    res.status(404).json({ message: "Couldn't find barber" });
  }
}

export async function reactivateBarberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const barber = await reActivateBarber(id);
    res.status(200).json({
      message: 'Barber reactivated',
      barber,
    });
  } catch (error) {
    console.error('Error reactivating barber', error);
    res.status(404).json({ message: "Couldn't find barber" });
  }
}