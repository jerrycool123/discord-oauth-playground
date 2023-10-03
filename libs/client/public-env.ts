/* eslint-disable @typescript-eslint/no-non-null-assertion */
const publicEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
};

Object.entries(publicEnv).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`${key} must be defined.`);
  }
});

export default publicEnv;
