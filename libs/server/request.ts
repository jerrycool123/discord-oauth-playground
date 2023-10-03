import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import 'server-only';

import type { VerboseRequestPayload, VerboseResponsePayload } from '../../types/common';

export const verboseRequest = async (
  config: AxiosRequestConfig,
): Promise<{
  request: VerboseRequestPayload;
  response: VerboseResponsePayload;
}> => {
  try {
    const res = await axios.request(config);
    if (!(res.headers instanceof AxiosHeaders)) {
      throw new Error('Invalid response headers');
    }
    return {
      request: {
        rawHeader: (res.request as { _header: string })._header,
        body: (res.config.data as string | undefined) ?? null,
      },
      response: {
        httpVersion: (res.request as { res?: { httpVersion?: string } })?.res?.httpVersion ?? '1.1',
        status: res.status,
        reasonPhrase: res.statusText,
        headers: res.headers.normalize(true),
        body:
          typeof res.data === 'object' && res.data !== null
            ? JSON.stringify(res.data, null, 2)
            : typeof res.data === 'string'
            ? res.data
            : null,
      },
    };
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response !== undefined &&
      error.config !== undefined &&
      error.response.headers instanceof AxiosHeaders
    ) {
      return {
        request: {
          rawHeader: (error.response.request as { _header: string })._header,
          body: (error.config.data as string | undefined) ?? null,
        },
        response: {
          httpVersion:
            (error.response.request as { res?: { httpVersion?: string } })?.res?.httpVersion ??
            '1.1',
          status: error.response.status,
          reasonPhrase: error.response.statusText,
          headers: error.response.headers.normalize(true),
          body:
            typeof error.response.data === 'object' && error.response.data !== null
              ? JSON.stringify(error.response.data, null, 2)
              : typeof error.response.data === 'string'
              ? error.response.data
              : null,
        },
      };
    }
    throw error;
  }
};
