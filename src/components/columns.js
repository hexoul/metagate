let columns = {};

var strSorter = (a, b) => {
  if (a.title > b.title) return 1;
  else if (a.title < b.title) return -1;
  return 0;
}

columns.userColumns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: '15%',
    sorter: (a, b) => strSorter(a,b),
  },
  {
    title: 'Meta ID',
    dataIndex: 'addr',
    key: 'metaID',
    width: '55%',
    sorter: (a, b) => strSorter(a,b),
  },
  {
    title: 'Registered on',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '20%',
    sorter: (a, b) => strSorter(a,b),
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