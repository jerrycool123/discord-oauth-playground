import type { RESTPatchAPICurrentUserJSONBody } from 'discord-api-types/v10';
import { z } from 'zod';

import type { APISpec } from '../../../../types/discord';

export const getCurrentUserApi: APISpec = {
  name: 'Get Current User',
  category: 'user',
  doc: 'https://discord.com/developers/docs/resources/user#get-current-user',
  method: 'GET',
  path: '/users/@me',
  auth: {
    bot: true,
    bearer: true,
  },
  scopes: ['identify'],
  query: z.object({}),
  body: z.object({}),
  res: 'json',
};

export const getUserApi: APISpec = {
  name: 'Get User',
  category: 'user',
  doc: 'https://discord.com/developers/docs/resources/user#get-user',
  method: 'GET',
  path: '/users/{userId}',
  auth: {
    bot: true,
    bearer: false,
  },
  scopes: [],
  query: z.object({}),
  body: z.object({}),
  res: 'json',
};

export const modifyCurrentUserApi: APISpec<object, RESTPatchAPICurrentUserJSONBody> = {
  name: 'Modify Current User',
  category: 'user',
  doc: 'https://discord.com/developers/docs/resources/user#modify-current-user',
  method: 'PATCH',
  path: '/users/@me',
  auth: {
    bot: true,
    bearer: false,
  },
  scopes: [],
  query: z.object({}),
  body: z.object({
    username: z.union([z.string(), z.undefined()]).optional(),
    avatar: z.union([z.string(), z.undefined()]).optional().nullable(),
  }),
  res: 'json',
};
