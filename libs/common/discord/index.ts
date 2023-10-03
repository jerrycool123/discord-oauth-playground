import { OAuth2Routes, type RESTOAuth2AuthorizationQuery } from 'discord-api-types/v10';
import qs from 'qs';
import { z } from 'zod';

import type { DiscordOAuth2Scope } from '../../../types/discord';
import publicEnv from '../../client/public-env';

export const getAuthorizationUrl = (clientId: string, scopes: string) => {
  const query: RESTOAuth2AuthorizationQuery = {
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: publicEnv.NEXT_PUBLIC_APP_URL,
    prompt: 'consent',
  };

  return `${OAuth2Routes.authorizationURL}${qs.stringify(query, { addQueryPrefix: true })}`;
};

export const exchangeAccessTokenRequestBodySchema = z.object({
  code: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
});

export const exchangeAccessTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});

export const createDiscordApiRequestBodySchema = z.object({
  method: z.union([
    z.literal('GET'),
    z.literal('POST'),
    z.literal('PUT'),
    z.literal('PATCH'),
    z.literal('DELETE'),
  ]),
  path: z.string(),
  headers: z.record(z.string()),
  body: z.string().nullable(),
});

export const oauthScopeMap: Record<DiscordOAuth2Scope, string> = {
  'activities.read':
    "allows your app to fetch data from a user's 'Now Playing/Recently Played' list — not currently available for apps",
  'activities.write':
    "allows your app to update a user's activity - not currently available for apps (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER)",
  'applications.builds.read': "allows your app to read build data for a user's applications",
  'applications.builds.upload':
    "allows your app to upload/update builds for a user's applications - requires Discord approval",
  'applications.commands': 'allows your app to use commands in a guild',
  'applications.commands.update':
    'allows your app to update its commands using a Bearer token - client credentials grant only',
  'applications.commands.permissions.update':
    'allows your app to update permissions for its commands in a guild a user has permissions to',
  'applications.entitlements': "allows your app to read entitlements for a user's applications",
  'applications.store.update':
    "allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications",
  'bot': "for oauth2 bots, this puts the bot in the user's selected guild by default",
  'connections': 'allows /users/@me/connections to return linked third-party accounts',
  'dm_channels.read':
    "allows your app to see information about the user's DMs and group DMs - requires Discord approval",
  'email': 'enables /users/@me to return an email',
  'gdm.join': 'allows your app to join users to a group dm',
  'guilds': "allows /users/@me/guilds to return basic information about all of a user's guilds",
  'guilds.join':
    'allows /guilds/{guild.id}/members/{user.id} to be used for joining users to a guild',
  'guilds.members.read':
    "allows /users/@me/guilds/{guild.id}/member to return a user's member information in a guild",
  'identify': 'allows /users/@me without email',
  'messages.read':
    'for local rpc server api access, this allows you to read messages from all client channels (otherwise restricted to channels/guilds your app creates)',
  'relationships.read':
    "allows your app to know a user's friends and implicit relationships - requires Discord approval",
  'role_connections.write':
    "allows your app to update a user's connection and metadata for the app",
  'rpc':
    "for local rpc server access, this allows you to control a user's local Discord client - requires Discord approval",
  'rpc.activities.write':
    "for local rpc server access, this allows you to update a user's activity - requires Discord approval",
  'rpc.notifications.read':
    'for local rpc server access, this allows you to receive notifications pushed out to the user - requires Discord approval',
  'rpc.video.read': 'rpc.video.read',
  'rpc.video.write': 'rpc.video.write',
  'rpc.screenshare.read': 'rpc.screenshare.read',
  'rpc.screenshare.write': 'rpc.screenshare.write',
  'rpc.voice.read':
    "for local rpc server access, this allows you to read a user's voice settings and listen for voice events - requires Discord approval",
  'rpc.voice.write':
    "for local rpc server access, this allows you to update a user's voice settings - requires Discord approval",
  'voice':
    "allows your app to connect to voice on the user's behalf and see all the voice members - requires Discord approval",
  'webhook.incoming':
    'this generates a webhook that is returned in the oauth token response for authorization code grants',
};
