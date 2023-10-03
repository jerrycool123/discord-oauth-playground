import Alert from 'antd/es/alert';
import Tabs, { type TabsProps } from 'antd/es/tabs';
import { useContext, useState } from 'react';

import styles from './RequestTabs.module.css';

import { APIRequestBuilderContext } from '../../contexts/APIRequestBuilderProvider';
import { useToken } from '../../hooks/useDesignToken';
import { capitalize } from '../../libs/common/common';
import { RequestBodyEditor } from './../Editors/RequestBodyEditor';
import KeyValueTable from './../Tables/KeyValueTable';
import PathVariableTable from './../Tables/PathVaraibleTable';

export default function RequestTabs() {
  const { colorStyle } = useToken();

  const {
    method: [method],
    params: [params, setParams],
    query: [query, setQuery],
    headers: [headers, setHeaders],
    body: [body, setBody],
    auth: [auth],
  } = useContext(APIRequestBuilderContext);

  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

  const tabs: TabsProps['items'] = [
    {
      key: 'params',
      label: 'Params',
      children: (
        <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ height: 0 }}>
          <div className="fw-bold mb-2" style={{ ...colorStyle }}>
            Query Parameters
          </div>
          <KeyValueTable data={[query, setQuery]} />
          <div className="fw-bold mt-3 mb-2" style={{ ...colorStyle }}>
            Path Variables
          </div>
          <PathVariableTable data={[params, setParams]} />
        </div>
      ),
    },
    {
      key: 'headers',
      label: 'Headers',
      children: (
        <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ height: 0 }}>
          <div className="fw-bold mb-2" style={{ ...colorStyle }}>
            Request Headers
          </div>
          <KeyValueTable
            fixedData={[['Authorization', `${capitalize(auth)} ${'*'.repeat(20)}`]]}
            data={[headers, setHeaders]}
          />
        </div>
      ),
    },
    {
      key: 'body',
      label: 'Body',
      children: (
        <div className="flex-grow-1 d-flex flex-column">
          <div className="flex-shrink-0 fw-bold mb-2" style={{ ...colorStyle }}>
            Request Body
          </div>
          {!hasBody && (
            <div className="flex-shrink-0 mb-2">
              <Alert
                className="abc"
                message={<div className="fs-8">{method} requests do not have a request body.</div>}
                type="info"
                showIcon
              />
            </div>
          )}
          <div
            className={`flex-grow-1 d-flex flex-column overflow-auto ${
              !hasBody ? 'opacity-50' : ''
            }`}
            style={{ height: 0 }}
          >
            <RequestBodyEditor value={body} setValue={setBody} isEditable={hasBody} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      className={`flex-grow-1 d-flex flex-column ${styles.tabs}`}
      activeKey={activeTab}
      items={tabs}
      onTabClick={(key) => setActiveTab(key as typeof activeTab)}
    />
  );
}
