import { orange } from '@ant-design/colors';
import Alert from 'antd/es/alert';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import { useSearchParams } from 'next/navigation';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { z } from 'zod';

import { RequestResponseContext } from '../../contexts/RequestResponseProvider';
import { SessionStorageContext } from '../../contexts/SessionStorageProvider';
import { useToken } from '../../hooks/useDesignToken';
import { useOAuthExpiryTimer } from '../../hooks/useOAuthExpiryTimer';
import {
  exchangeAccessTokenRequestBodySchema,
  exchangeAccessTokenResponseSchema,
  getAuthorizationUrl,
} from '../../libs/common/discord';
import { isEmptyString } from '../../libs/common/validator';
import { VerboseRequestPayload, VerboseResponsePayload } from '../../types/common';

export default function Step2({
  setActiveStep,
}: {
  setActiveStep: Dispatch<SetStateAction<1 | 2 | 3>>;
}) {
  const params = useSearchParams();
  const { colorStyle } = useToken();
  const remainingTime = useOAuthExpiryTimer();

  const {
    clientId: [clientId],
    scopes: [scopes],
    clientSecret: [clientSecret],
    accessToken: [accessToken, setAccessToken],
    refreshToken: [refreshToken, setRefreshToken],
    expiresAt: [_expiresAt, setExpiresAt],
  } = useContext(SessionStorageContext);
  const {
    request: [_request, setRequest],
    response: [_response, setResponse],
  } = useContext(RequestResponseContext);

  const [init, setInit] = useState(false);
  const [code, setCode] = useState('');

  const handleExchangeAccessToken = useCallback(
    (code: string, clientId: string, clientSecret: string) => async () => {
      if (isEmptyString(code) || isEmptyString(clientId) || isEmptyString(clientSecret)) {
        return;
      }
      const payload: z.infer<typeof exchangeAccessTokenRequestBodySchema> = {
        code,
        clientId,
        clientSecret,
      };
      const res = await fetch('/api/oauth-token', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const {
        data,
        metadata: { request, response },
      } = (await res.json()) as {
        data: z.infer<typeof exchangeAccessTokenResponseSchema> | null;
        metadata: { request: VerboseRequestPayload; response: VerboseResponsePayload };
      };
      if (data !== null) {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setExpiresAt((Math.floor(Date.now() / 1000) + data.expires_in).toString());
        setTimeout(() => {
          setActiveStep(3);
        }, 3000);
      }
      setRequest({ type: 'request', ...request });
      setResponse({ type: 'response', ...response });
    },
    [setAccessToken, setActiveStep, setExpiresAt, setRefreshToken, setRequest, setResponse],
  );

  useEffect(() => {
    if (init === true) return;
    setInit(true);

    const code = params.get('code');
    if (code === null || isEmptyString(clientId) || scopes.length === 0) return;
    setCode(code);
    const requestUrl = getAuthorizationUrl(clientId, scopes);
    setRequest({
      type: 'response',
      httpVersion: '1.1',
      status: 302,
      reasonPhrase: 'Found',
      headers: {
        Location: requestUrl,
      },
      body: null,
    });
    setResponse({
      type: 'request',
      rawHeader: `GET ${window.location.href} HTTP/1.1
Host: ${window.location.host}`,
      body: null,
    });
  }, [clientId, init, params, scopes, setActiveStep, setRequest, setResponse]);

  return (
    <div className="flex-grow-1 d-flex flex-column">
      <div className="fw-bold mb-2" style={{ ...colorStyle }}>
        Discord OAuth Code
      </div>
      <Input
        className="mb-3"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        type="text"
        placeholder="Discord OAuth Code"
      />
      <Button
        className="w-100 mb-3"
        type={isEmptyString(accessToken) ? 'primary' : 'default'}
        disabled={isEmptyString(code)}
        onClick={handleExchangeAccessToken(code, clientId, clientSecret)}
      >
        Exchange Access Token
      </Button>
      <div className="fw-bold mb-2" style={{ ...colorStyle }}>
        Discord OAuth Access (Bearer) Token
      </div>
      {remainingTime >= 0 && (
        <Alert
          className="mb-2"
          message={
            <div className="d-flex align-items-center fs-8">
              The access token will expire in
              <div className="mx-1" style={{ color: orange.primary }}>
                {remainingTime}
              </div>
              seconds.
            </div>
          }
          type="info"
          showIcon
        />
      )}
      <Input
        className="mb-3"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        type="text"
        placeholder="Discord OAuth Access Token"
      />
      <div className="fw-bold mb-2" style={{ ...colorStyle }}>
        Discord OAuth Refresh Token
      </div>
      <Input
        className="mb-3"
        value={refreshToken}
        onChange={(e) => setRefreshToken(e.target.value)}
        type="text"
        placeholder="Discord OAuth Refresh Token"
      />
      <Button
        className="w-100"
        type="primary"
        disabled={isEmptyString(accessToken)}
        onClick={() => setActiveStep(3)}
      >
        Make a request to Discord API
      </Button>
    </div>
  );
}
