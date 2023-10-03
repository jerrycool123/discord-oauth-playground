import {
  OAuth2Routes,
  type RESTPostOAuth2AccessTokenURLEncodedData,
  RouteBases,
} from 'discord-api-types/v10';
import qs from 'qs';

import publicEnv from '../client/public-env';
import { verboseRequest } from './request';

export const exchangeAccessToken = async (code: string, clientId: string, clientSecret: string) => {
  const data: RESTPostOAuth2AccessTokenURLEncodedData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: publicEnv.NEXT_PUBLIC_APP_URL,
  };

  return await verboseRequest({
    url: OAuth2Routes.tokenURL,
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const createDiscordApiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  headers: Record<string, string>,
  body: string | null,
) => {
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
  return await verboseRequest({
    url: `${RouteBases.api}${path}`,
    method,
    ...(hasBody ? { data: body } : {}),
    headers: { 'Content-Type': 'application/json', ...headers },
  });
};
