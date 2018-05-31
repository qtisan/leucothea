

const db = require('../lib/db');
const fetchInformation = require('../scripts/fetch_information');
const moment = require('moment');

// fetchInformation('000596').then(re => console.log(re));

db.get('stock_info', {stock_code: '000596', pinyin: 'gjgj'})
    .then(row => {
        console.log(row);
    })
    .catch(e => console.error(e));
