
const { hisReq, auth } = require('../config');
const db = require('../lib/db');
const fetch = require('../lib/fetch');
const moment = require('moment');
const qs = require('querystring');
const logger = require('../lib/log');

const fetchHistory = async (code, begin, once) => {
    const start = moment(begin);
    const finish_date = typeof once === 'string' ? moment(once) : moment();
    const p_begin = start.format('YYYY-MM-DD');
    const p_end = (start.month() == 11 ? start.endOf('year') : start.add(30, 'd'))
        .format('YYYY-MM-DD');
    logger.info(`-- from ${p_begin}`);
    if (moment(p_begin).isBefore(finish_date)) {
        logger.info(
            `== fetch between ${p_begin} - ${p_end}, end ${finish_date.format('YYYY-MM-DD')} .`);
        const response = await fetch(
            `${hisReq.url}?${qs.stringify({ 
                code, 
                begin: p_begin,
                end: p_end,
            })}`, {
                method: hisReq.method,
                headers: { 'Authorization': `APPCODE ${auth.appCode}` }
            });
        if (response && response.showapi_res_body && response.showapi_res_body.list) {
            const list = response.showapi_res_body.list;
            if (list.length) {
                logger.info(`fetch ${list.length} records.`);
                list.sort((a, b) => a.date < b.date ? -1 : 1);
                for (let row of list) {
                    const price = {
                        stock_code: row.code,
                        open_price: row.open_price,
                        close_price: row.close_price,
                        high_price: row.max_price,
                        low_price: row.min_price,
                        trade_num: row.trade_num,
                        trade_amount: row.trade_money,
                        trade_date: row.date.replace(/-/g, ''),
                        change_px: row.close_price - row.open_price,
                        change_px_rate: ((row.close_price - row.open_price) / row.open_price * 100).toFixed(2),
                    };
                    const result = await db.addOrModify('leu_price_perday', price, 'stock_code,trade_date');
                    if (result.affectedRows !== 1) {
                        logger.error(`${price.stock_code} at ${price.trade_date} insert error.`);
                    }
                    else {
                        logger.info(`${price.stock_code} at ${price.trade_date} insert successful.`);
                    }
                }
            }
            else {
                logger.error(`${code} in ${p_begin} - ${p_end} fetch no result.`);
            }
        }
        else {
            logger.error(`${code} in ${p_begin} - ${p_end} fetch error.`);
            logger.error(response || 'no response');
        }
        once !== true && await fetchHistory(code, start.add(1, 'd'), once);
    }
    else {
        logger.info(`-- ${p_begin} > ${finish_date.format('YYYY-MM-DD')}, end.`);
    }
    return true;
};

module.exports = { fetchHistory };
