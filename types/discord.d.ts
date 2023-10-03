import type { z } from 'zod';

export type DiscordOAuth2Scope =
  | 'activities.read'
  | 'activities.write'
  | 'applications.builds.read'
  | 'applications.builds.upload'
  | 'applications.commands'
  | 'applications.commands.update'
  | 'applications.commands.permissions.update'
  | 'applications.entitlements'
  | 'applications.store.update'
  | 'bot'
  | 'connections'
  | 'dm_channels.read'
  | 'email'
  | 'gdm.join'
  | 'guilds'
  | 'guilds.join'
  | 'guilds.members.read'
  | 'identify'
  | 'messages.read'
  | 'relationships.read'
  | 'role_connections.write'
  | 'rpc'
  | 'rpc.notifications.read'
  | 'rpc.voice.read'
  | 'rpc.voice.write'
  | 'rpc.video.read'
  | 'rpc.video.write'
  | 'rpc.screenshare.read'
  | 'rpc.screenshare.write'
  | 'rpc.activities.write'
  | 'voice'
  | 'webhook.incoming';

export interface APISpec<Query extends object = object, Body extends object = object> {
  name: string;
  category: 'user';
  doc: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  auth: {
    bot: boolean;
    bearer: boolean;
  };
  scopes: DiscordOAuth2Scope[];
  query: z.ZodType<Query, z.ZodTypeDef, Partial<Query>>;
  body: z.ZodType<Body, z.ZodTypeDef, Partial<Body>>;
  res: 'json';
}
