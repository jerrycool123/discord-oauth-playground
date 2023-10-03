import 'server-only';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const privateEnv = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET!,
  HOST_NAME: process.env.HOST_NAME!,
};

Object.entries(privateEnv).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`${key} must be defined.`);
  }
});

export default privateEnv;
