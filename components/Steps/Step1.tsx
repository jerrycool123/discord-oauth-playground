import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Password from 'antd/es/input/Password';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import { useCallback, useContext, useEffect, useState } from 'react';

import { SessionStorageContext } from '../../contexts/SessionStorageProvider';
import { useToken } from '../../hooks/useDesignToken';
import { getAuthorizationUrl, oauthScopeMap } from '../../libs/common/discord';
import { isEmptyString } from '../../libs/common/validator';
import ScopeTag from '../Tags/ScopeTag';

export default function Step1() {
  const { colorStyle } = useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    clientId: [clientId, setClientId],
    clientSecret: [clientSecret, setClientSecret],
    botToken: [botToken, setBotToken],
    scopes: [scopes, setScopes],
  } = useContext(SessionStorageContext);

  const [init, setInit] = useState(false);

  const handleDiscordOAuth = useCallback(
    (clientId: string, clientSecret: string, botToken: string, scopes: string) => () => {
      if (
        isEmptyString(clientId) ||
        isEmptyString(clientSecret) ||
        isEmptyString(botToken) ||
        scopes.length === 0
      ) {
        return;
      }

      window.location.href = getAuthorizationUrl(clientId, scopes);
    },
    [],
  );

  useEffect(() => {
    setInit(true);
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex-grow-1 d-flex flex-column">
        <div className="fw-bold mb-2" style={{ ...colorStyle }}>
          Discord App Client ID
        </div>
        <Input
          className="mb-3"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          type="text"
          placeholder="Discord App Client ID"
        />
        <div className="fw-bold mb-2" style={{ ...colorStyle }}>
          Discord App Client Secret
        </div>
        <Password
          className="mb-3"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          placeholder="Discord App Client Secret"
        />
        <div className="fw-bold mb-2" style={{ ...colorStyle }}>
          Discord Bot Token
        </div>
        <Password
          className="mb-3"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          placeholder="Discord Bot Token"
        />
        <div className="fw-bold mb-2" style={{ ...colorStyle }}>
          OAuth Scopes
        </div>
        <div className="mb-3">
          <Select
            mode="multiple"
            allowClear
            tagRender={ScopeTag}
            className="w-100"
            placeholder="Click to add..."
            // ! Hydration Issue
            value={init ? (scopes === '' ? [] : scopes.split(' ')) : []}
            onChange={(value) => setScopes(value.join(' '))}
          >
            {Object.entries(oauthScopeMap).map(([name, description]) => (
              <Select.Option
                key={name}
                value={name}
                label={name}
                onMouseOver={() => {
                  void messageApi.open({
                    type: 'info',
                    key: 'scope-description',
                    content: description,
                    duration: 0,
                  });
                }}
                onMouseOut={() => {
                  void messageApi.destroy('scope-description');
                }}
              >
                <code className="fs-8" style={{ color: 'unset' }}>
                  {name}
                </code>
              </Select.Option>
            ))}
          </Select>
        </div>
        <Button
          className="mt-2 w-100"
          type="primary"
          disabled={
            init &&
            (isEmptyString(clientId) ||
              isEmptyString(clientSecret) ||
              isEmptyString(botToken) ||
              scopes.length === 0)
          }
          onClick={handleDiscordOAuth(clientId, clientSecret, botToken, scopes)}
        >
          Authorize
        </Button>
      </div>
    </>
  );
}
