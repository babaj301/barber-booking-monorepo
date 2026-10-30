import request from 'supertest';
import app from '../../app';

export type TestUserInput = {
  name: string;
  email: string;
  password: string;
  user_role?: string;
};

export type AuthenticatedUser = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    user_role?: string;
  };
  headers: {
    Authorization: string;
  };
};

export async function registerUser(user: TestUserInput) {
  const response = await request(app).post('/api/auth/register').send(user);

  if (response.status !== 201) {
    throw new Error(
      `Failed to register test user: ${response.status} ${response.body?.message ?? ''}`,
    );
  }

  return response.body.user;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await request(app).post('/api/auth/login').send(credentials);

  if (response.status !== 200) {
    throw new Error(
      `Failed to login test user: ${response.status} ${response.body?.message ?? ''}`,
    );
  }

  return {
    token: response.body.token,
    user: response.body.user,
    response,
  };
}

export async function registerAndLoginUser(
  user: TestUserInput,
): Promise<AuthenticatedUser> {
  const registeredUser = await registerUser(user);
  const loggedInUser = await loginUser({
    email: user.email,
    password: user.password,
  });

  return {
    token: loggedInUser.token,
    user: registeredUser,
    headers: {
      Authorization: `Bearer ${loggedInUser.token}`,
    },
  };
}

export function buildAuthHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
