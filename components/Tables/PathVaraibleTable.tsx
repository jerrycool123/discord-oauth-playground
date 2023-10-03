import Input from 'antd/es/input';
import Table, { type ColumnsType } from 'antd/es/table';

import { UseStateReturnType } from '../../types/react';

export default function PathVariableTable({
  data: [data, setData],
}: {
  data: UseStateReturnType<[string, string][]>;
}) {
  const columns: ColumnsType<{ key: number; k: string; v: string }> = [
    {
      title: 'Key',
      dataIndex: 'k',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'v',
      width: '50%',
      render: (value: string, { key }) => (
        <Input
          type="text"
          value={value}
          onChange={(e) => {
            setData((oldParams) => [
              ...oldParams.slice(0, key),
              [oldParams[key][0], e.target.value],
              ...oldParams.slice(key + 1),
            ]);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data.map(([key, value], index) => ({
          key: index,
          k: key,
          v: value,
        }))}
        columns={columns}
        size="small"
        pagination={false}
      />
    </>
  );
}
