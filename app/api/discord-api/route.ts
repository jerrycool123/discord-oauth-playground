import { createDiscordApiRequestBodySchema } from '../../../libs/common/discord';
import { createDiscordApiRequest } from '../../../libs/server/discord';

export const POST = async (req: Request) => {
  const rawBody = await req
    .json()
    .then((data) => data as unknown)
    .catch((error) => {
      console.error(error);
      return null;
    });
  const parsedBody = createDiscordApiRequestBodySchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return new Response('Invalid request body', { status: 400 });
  }

  const { method, path, headers, body } = parsedBody.data;

  try {
    const metadata = await createDiscordApiRequest(method, path, headers, body);

    return new Response(JSON.stringify({ metadata }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
  }

  return new Response('Failed to create Discord API request', { status: 500 });
};
