let columns = {};

columns.userColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => a.type.length - b.type.length,
    width: '10%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '25%',
  },
  {
    title: 'Meta ID',
    dataIndex: 'addr',
    key: 'metaID',
    width: '35%',
  },
  {
    title: 'Registered on',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '20%',
  }
];

columns.userDetailColumns = [
  {
    title: 'No.',
    dataIndex: 'id',
    key: 'id',
    width: '20%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '80%',
  },
];

columns.topicColumns = [
  {
    title: 'Topic No.',
    dataIndex: 'id',
    key: 'id',
    width: '10%',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Issuer',
    dataIndex: 'issuerTitle',
    key: 'issuer',
    width: '20%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '25%',
  },
  {
    title: 'Explanation',
    dataIndex: 'explanation',
    key: 'explanation',
    width: '25%',
  },
  {
    title: 'Registered on',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '20%',
  }
];

columns.achievementColumns = [
  {
    title: 'Creator',
    dataIndex: 'creatorTitle',
    key: 'creator',
    width: '20%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '20%',
  },
  {
    title: 'Explanation',
    dataIndex: 'explanation',
    key: 'explanation',
    width: '35%',
  },
  {
    title: 'Reward',
    dataIndex: 'reward',
    key: 'reward',
    width: '10%',
  },
  {
    title: 'Registered on',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '20%',
  }
];

columns.achievementDetailColumns = [
  {
    title: 'No.',
    dataIndex: 'id',
    key: 'id',
    width: '10%',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '20%',
  },
  {
    title: 'Issuer',
    dataIndex: 'issuer',
    key: 'issuer',
    width: '40%',
  },
];

export {columns}