
const { infReq, auth } = require('../config');
const db = require('../lib/db');
const fetch = require('../lib/fetch');

const fetchInfo = async code => {
    const response = await fetch(`${infReq.url}?code=${code}`, {
        method: infReq.method,
        headers: { 'Authorization': `APPCODE ${auth.appCode}` }
    });
    if (response.showapi_res_body && response.showapi_res_body.list) {
        let info = response.showapi_res_body.list[0];
        info = {
            stock_code: info.code,
            market: info.market == 'sz' ? 'SS' : 'SZ',
            stock_name: info.name,
            curr_capital: info.currcapital,
            total_capital: info.totalcapital,
            pinyin: info.pinyin,
            listing_date: info.listing_date,
            curr_status: info.state,
        };
        let result = await db.addOrModify('leu_stock_info', info, 'stock_code');
        return result.affectedRows == 1 ? info : null;
    }
    else {
        return null;
    }
};

const fetchInfoBatch = async codes => {
    const success = [], fail = [];
    codes.forEach(code => {
        let result = fetchInfo(code);
        if (result) {
            success.push(code);
            logger.info(`${code} fetch successfully.`);
        }
        else {
            fail.push(code);
            logger.info(`${code} failed to fetch.`);
        }
    });
    logger.info(`${success.length} success fetched.`);
    logger.info(`${fail.length} fetch failed. ${fail.join()}`);
};

module.exports = {fetchInfo, fetchInfoBatch};