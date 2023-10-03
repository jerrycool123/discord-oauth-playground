import { Text } from '@codemirror/state';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Radio from 'antd/es/radio';
import Select from 'antd/es/select';
import Tooltip from 'antd/es/tooltip';
import qs from 'qs';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { z } from 'zod';

import { APIRequestBuilderContext } from '../../contexts/APIRequestBuilderProvider';
import { RequestResponseContext } from '../../contexts/RequestResponseProvider';
import { SessionStorageContext } from '../../contexts/SessionStorageProvider';
import { useToken } from '../../hooks/useDesignToken';
import { capitalize, extractVariables } from '../../libs/common/common';
import { createDiscordApiRequestBodySchema } from '../../libs/common/discord';
import { isNonEmptyString } from '../../libs/common/validator';
import { VerboseRequestPayload, VerboseResponsePayload } from '../../types/common';
import { APISpec } from '../../types/discord';
import APIRequestListModal from '../Modals/APIRequestListModal';
import RequestTabs from '../Tabs/RequestTabs';

export default function Step3({
  setActiveStep,
}: {
  setActiveStep: Dispatch<SetStateAction<1 | 2 | 3>>;
}) {
  const { colorStyle } = useToken();

  const {
    botToken: [botToken],
    accessToken: [accessToken],
  } = useContext(SessionStorageContext);
  const {
    method: [method, setMethod],
    path: [path, setPath],
    params: [params, setParams],
    query: [query, setQuery],
    headers: [headers, setHeaders],
    auth: [auth, setAuth],
    body: [body, setBody],
  } = useContext(APIRequestBuilderContext);
  const {
    request: [_request, setRequest],
    response: [_response, setResponse],
  } = useContext(RequestResponseContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearRequest = () => {
    setMethod('GET');
    setPath('');
    setQuery([]);
    setHeaders([]);
    setAuth('bot');
    setBody(Text.of(['{}']));
  };

  const handleCreateAPIRequest = useCallback(
    (
      method: APISpec['method'],
      path: string,
      params: [string, string][],
      query: [string, string][],
      headers: [string, string][],
      body: Text,
      auth: keyof APISpec['auth'],
      accessToken: string,
      botToken: string,
    ) =>
      async () => {
        if (!isNonEmptyString(path)) return;

        const queryParams =
          query.length > 0
            ? `${qs.stringify(
                query.reduce(
                  (acc, [key, value]) => ({
                    ...acc,
                    [key]: value,
                  }),
                  {},
                ),
                { addQueryPrefix: true },
              )}`
            : '';
        const populatedPath = params.reduce(
          (acc, [key, value]) => acc.replace(`{${key}}`, value),
          path,
        );
        const populatedHeaders: [string, string][] = [
          ['Authorization', `${capitalize(auth)} ${auth === 'bot' ? botToken : accessToken}`],
          ...headers,
        ];

        const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
        const payload: z.infer<typeof createDiscordApiRequestBodySchema> = {
          method,
          path: `${populatedPath}${queryParams}`,
          headers: populatedHeaders.reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: value,
            }),
            {},
          ),
          body: hasBody ? body.toString() : null,
        };
        const res = await fetch(`/api/discord-api`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
        const {
          metadata: { request, response },
        } = (await res.json()) as {
          metadata: { request: VerboseRequestPayload; response: VerboseResponsePayload };
        };
        setRequest({ type: 'request', ...request });
        setResponse({ type: 'response', ...response });
      },
    [setRequest, setResponse],
  );

  useEffect(() => {
    const params = extractVariables(path);
    setParams((oldParams) =>
      params.map<[string, string]>((param) => {
        const oldParam = oldParams.find(([key]) => key === param) ?? null;
        return oldParam ?? [param, ''];
      }),
    );
  }, [path, setParams]);

  return (
    <div className="flex-grow-1 d-flex flex-column">
      <div className="flex-shrink-0 d-flex mb-2">
        <Button className="flex-grow-1 me-2" type="primary" onClick={() => setIsModalOpen(true)}>
          + Browse Templates ...
        </Button>
        <Button className="me-2" onClick={() => setActiveStep(1)}>
          Change Bot Token
        </Button>
        <Button className="flex-shrink-0" danger onClick={handleClearRequest}>
          Clear
        </Button>
      </div>
      <APIRequestListModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="flex-shrink-0 d-flex align-items-center mb-2">
        <Input
          addonBefore={<Tooltip title="https://discord.com/api/v10">/api/v10</Tooltip>}
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="Path"
          type="text"
        />
      </div>
      <div className="flex-shrink-0 d-flex align-items-center justify-content-between mb-2">
        <Select
          className="flex-shrink-0"
          style={{ width: '6rem' }}
          value={method}
          onChange={(value) => setMethod(value)}
          options={[
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
            { label: 'DELETE', value: 'DELETE' },
          ]}
        />
        <div className="d-flex align-items-center">
          <div className="me-2" style={{ ...colorStyle }}>
            Authentication:
          </div>
          <Radio.Group value={auth} className="flex-shrink-0 me-2">
            <Radio.Button value="bot" onClick={() => setAuth('bot')}>
              Bot
            </Radio.Button>
            <Radio.Button value="bearer" onClick={() => setAuth('bearer')}>
              Bearer
            </Radio.Button>
          </Radio.Group>
          <Button
            className="flex-shrink-0"
            type="primary"
            onClick={handleCreateAPIRequest(
              method,
              path,
              params,
              query,
              headers,
              body,
              auth,
              accessToken,
              botToken,
            )}
          >
            Send
          </Button>
        </div>
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        <RequestTabs />
      </div>
    </div>
  );
}
