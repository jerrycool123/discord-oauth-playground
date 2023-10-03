import {
  exchangeAccessTokenRequestBodySchema,
  exchangeAccessTokenResponseSchema,
} from '../../../libs/common/discord';
import { exchangeAccessToken } from '../../../libs/server/discord';

export const POST = async (req: Request) => {
  const rawBody = await req
    .json()
    .then((data) => data as unknown)
    .catch((error) => {
      console.error(error);
      return null;
    });
  const parsedBody = exchangeAccessTokenRequestBodySchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return new Response('Invalid request body', { status: 400 });
  }

  const { code, clientId, clientSecret } = parsedBody.data;

  try {
    const metadata = await exchangeAccessToken(code, clientId, clientSecret);

    const parsedData = exchangeAccessTokenResponseSchema.safeParse(
      metadata.response.body === null ? null : JSON.parse(metadata.response.body),
    );
    return new Response(
      JSON.stringify({ data: parsedData.success ? parsedData.data : null, metadata }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error(error);
  }

  return new Response('Failed to exchange access token', { status: 500 });
};
