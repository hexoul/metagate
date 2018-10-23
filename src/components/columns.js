let columns = {};

columns.topicColumns = [
    {
      title: 'Topic ID',
      dataIndex: 'topicID',
      key: 'topicID',
      width: '10%',
    },
    {
      title: 'Issuer',
      dataIndex: 'issuer',
      key: 'issuer',
      width: '15%',
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
      width: '40%',
    },
    {
      title: 'Registered on',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: '10%',
    }
  ];

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
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
      filters: [
        { text: 'AA', value: 'Attestation Agency' },
        { text: 'SP', value: 'Service Provider' },
      ],
      width: '20%',
      filterMultiple: false,
      onFilter: (value, record) => record.roll.indexOf(value) === 0,
    },
    {
      title: 'Meta ID',
      dataIndex: 'metaID',
      key: 'metaID',
      width: '35%',
    },
    {
      title: 'Registered on',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: '10%',
    }
  ];

  columns.achievementColumns = [
    {
      title: 'creator',
      dataIndex: 'creator',
      key: 'creator',
      width: '15%',
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
      width: '45%',
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      width: '10%',
    },
    {
      title: 'Registered on',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: '10%',
    }
  ];

  export {columns}