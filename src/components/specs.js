import React from 'react';
import { Table } from 'antd';

function SpecsTable({ specs }) {
  const dataSource = Object.entries(specs).map(([key, value], index) => ({
    key: index,
    spec: {
      screen: 'Màn hình',
      chip: 'Chip',
      ram: 'RAM',
      storage: 'Bộ nhớ',
      camera: 'Camera',
      battery: 'Pin',
      weight: 'Trọng lượng'
    }[key] || key,
    detail: value
  }));

  const columns = [
    {
      title: 'Thông số',
      dataIndex: 'spec',
      key: 'spec'
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail'
    }
  ];

  return <Table dataSource={dataSource} columns={columns} pagination={false} bordered />;
}

export default SpecsTable;