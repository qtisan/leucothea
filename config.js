
exports.auth = {
    appCode: '9b16b85abd414bc3a5997353fe49d1c9',
    appKey: '24901117',
    appSecrest: '02b04db314eb6952870d7c5758683af9',
};

exports.hisReq = {
    url: 'http://stock.market.alicloudapi.com/sz-sh-stock-history',
    method: 'GET',
    query: {
        begin: '2000-01-01',
        end: '2000-01-31',
        code: '000004',
    },
};

exports.infReq = {
    url: 'http://stock.market.alicloudapi.com/name-to-stockinfo',
    method: 'GET',
    query: {
        code: '000004'
    },
};

exports.dbConf = {
    host: '106.14.12.178',
    port: 9906,
    user: 'root',
    password: 'toashintel1',
    database: 'stock_prediction',
};



