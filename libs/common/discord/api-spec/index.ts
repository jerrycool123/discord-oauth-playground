import { APISpec } from '../../../../types/discord';
import { getCurrentUserApi, getUserApi, modifyCurrentUserApi } from './user';

export const apiSpecs: APISpec[] = [
  // User
  getCurrentUserApi,
  getUserApi,
  modifyCurrentUserApi,
];
