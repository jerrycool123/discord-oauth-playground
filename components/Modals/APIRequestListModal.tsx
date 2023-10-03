import CheckOutlined from '@ant-design/icons/CheckOutlined';
import LinkOutlined from '@ant-design/icons/LinkOutlined';
import { Text } from '@codemirror/state';
import Modal from 'antd/es/modal';
import Table, { type ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { type Dispatch, type SetStateAction, useContext } from 'react';

import styles from './APIRequestListModal.module.css';

import { APIRequestBuilderContext } from '../../contexts/APIRequestBuilderProvider';
import { apiSpecs } from '../../libs/common/discord/api-spec';
import ScopeTag from '../Tags/ScopeTag';

const dataSource = [...apiSpecs].map((spec) => ({
  key: spec.name,
  method: spec.method,
  path: spec.path,
  scopes: spec.scopes,
  bot: spec.auth.bot,
  bearer: spec.auth.bearer,
  doc: spec.doc,
}));

const columns: ColumnsType<(typeof dataSource)[0]> = [
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    width: '5rem',
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
    render: (value: string) => <code>{value}</code>,
  },
  {
    title: 'Scopes',
    dataIndex: 'scopes',
    key: 'scopes',
    render: (value: string[]) => (
      <>
        {value.map((scope) => (
          <ScopeTag key={scope} label={scope} />
        ))}
      </>
    ),
  },
  {
    title: 'Bot',
    dataIndex: 'bot',
    key: 'bot',
    width: '3rem',
    align: 'center',
    render: (value: boolean) => value === true && <CheckOutlined />,
  },
  {
    title: 'Bearer',
    dataIndex: 'bearer',
    key: 'bearer',
    width: '4rem',
    align: 'center',
    render: (value: boolean) => value === true && <CheckOutlined />,
  },
  {
    title: 'Doc',
    dataIndex: 'doc',
    key: 'doc',
    width: '3rem',
    align: 'center',
    render: (value: string) => (
      <Link
        onClick={(e) => {
          e.stopPropagation();
        }}
        href={value}
        target="_blank"
      >
        <LinkOutlined />
      </Link>
    ),
  },
];

export default function APIRequestListModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    method: [_method, setMethod],
    path: [_path, setPath],
    query: [_query, setQuery],
    body: [_body, setBody],
  } = useContext(APIRequestBuilderContext);

  return (
    <Modal
      centered
      title="Discord API Request Templates"
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      width="50rem"
      footer={null}
    >
      <Table
        className={styles.table}
        dataSource={dataSource}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              const spec = apiSpecs.find((spec) => spec.name === record.key) ?? null;
              if (spec === null) {
                return;
              }
              setMethod(spec.method);
              setPath(spec.path);
              setQuery(Object.entries(spec.query.parse({})));
              setBody(Text.of(JSON.stringify(spec.body.parse({}), null, 2).split('\n')));
              setIsModalOpen(false);
            },
          };
        }}
        scroll={{ y: '20rem' }}
        size="small"
        pagination={false}
      />
    </Modal>
  );
}
