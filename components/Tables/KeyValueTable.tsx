import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import Input from 'antd/es/input';
import Table, { type ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';

import styles from './KeyValueTable.module.css';

import { isEmptyString } from '../../libs/common/validator';
import { UseStateReturnType } from '../../types/react';

export default function KeyValueTable({
  fixedData = [],
  data: [data, setData],
}: {
  fixedData?: [string, string][];
  data: UseStateReturnType<[string, string][]>;
}) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddNewRow = useCallback(
    (key: string, value: string) => () => {
      if (isEmptyString(key) || isEmptyString(value)) return;
      setData((oldData) => [...oldData, [key, value]]);
      setNewKey('');
      setNewValue('');
    },
    [setData],
  );

  const columns: ColumnsType<{
    key: number | 'new';
    k: string;
    v: string;
    d: string;
  }> = [
    {
      title: 'Key',
      dataIndex: 'k',
      render: (value: string, { key }) => {
        if (key === 'new') {
          return (
            <Input
              value={newKey}
              placeholder="Key"
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewRow(newKey, newValue)()}
            />
          );
        }
        return value;
      },
    },
    {
      title: 'Value',
      dataIndex: 'v',
      render: (value: string, { key }) => {
        if (key === 'new') {
          return (
            <Input
              value={newValue}
              placeholder="Value"
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewRow(newKey, newValue)()}
            />
          );
        }
        return value;
      },
    },
    {
      title: '',
      dataIndex: 'd',
      width: '2rem',
      render: (value: string, { key }) => {
        if (value === 'fixed') return <></>;
        else if (key === 'new') {
          return (
            <PlusOutlined className={styles.plus} onClick={handleAddNewRow(newKey, newValue)} />
          );
        }
        return (
          <DeleteOutlined
            className={styles.delete}
            onClick={() =>
              setData((oldData) => [...oldData.slice(0, key), ...oldData.slice(key + 1)])
            }
          />
        );
      },
    },
  ];

  return (
    <Table
      dataSource={[
        ...fixedData.map(([key, value], index) => ({
          key: index,
          k: key,
          v: value,
          d: 'fixed',
        })),
        ...data.map(([key, value], index) => ({
          key: index,
          k: key,
          v: value,
          d: '',
        })),
        { key: 'new', k: '', v: '', d: '' } as const,
      ]}
      columns={columns}
      size="small"
      pagination={false}
    />
  );
}
