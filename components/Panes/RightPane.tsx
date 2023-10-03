'use client';

import Switch from 'antd/es/switch';
import { useContext, useState } from 'react';

import { RequestResponseContext } from '../../contexts/RequestResponseProvider';
import { useToken } from '../../hooks/useDesignToken';
import RequestResponseCard from '../Cards/RequestResponseCard';

export default function RightPane() {
  const { colorStyle } = useToken();

  const [hideHeaders, setHideHeaders] = useState(false);

  const {
    request: [request],
    response: [response],
  } = useContext(RequestResponseContext);

  return (
    <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ minHeight: 0 }}>
      <h2 className="flex-shrink-0 mb-3" style={{ ...colorStyle }}>
        Request
      </h2>
      <RequestResponseCard data={request} hideHeaders={false} />
      <h2 className="flex-shrink-0 mt-4 mb-3" style={{ ...colorStyle }}>
        Response
      </h2>
      <div className="flex-shrink-0 mb-3 d-flex align-items-center">
        <div className="fs-7 mx-2" style={{ ...colorStyle }}>
          Hide headers
        </div>
        <Switch size="small" checked={hideHeaders} onClick={setHideHeaders} />
      </div>
      <RequestResponseCard data={response} hideHeaders={hideHeaders} />
    </div>
  );
}
