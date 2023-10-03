import { z } from 'zod';

export const isString = (value: unknown): value is string => z.string().safeParse(value).success;

export const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.length > 0;

export const isEmptyString = (value: unknown): value is string =>
  isString(value) && value.length === 0;
