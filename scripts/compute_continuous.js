
const db = require('../lib/db');
const moment = require('moment');
const logger = require('../lib/log');

const getPrices = async (code) => await db.select('leu_price_perday', {
    where: { stock_code: code },
    orders: [['trade_date', 'asc']]
});
const getPricesBefore = async (code, date) => {
    let sql = 'select * from leu_price_perday ' +
        'where stock_code=? and trade_date<? ' +
        'order by trade_date asc';
    return await db.query(sql, [code, moment(date).format('YYYYMMDD')]);
};
const getPricesAfter = async (code, date) => {
    let sql = 'select * from leu_price_perday ' +
        'where stock_code=? and trade_date>=? ' +
        'order by trade_date asc';
    return await db.query(sql, [code, moment(date).format('YYYYMMDD')]);
};
const getPreviousDay = async (code, date) => {
    const dates = await getPrices(code);
    if (dates.length) {
        const idx = dates.findIndex(d => d.trade_date == moment(date).format('YYYYMMDD'));
        if (idx && idx != -1) {
            return dates[idx - 1];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
};
const getNextDay = async (code, date) => {
    const dates = await getPrices(code);
    if (dates.length) {
        const idx = dates.findIndex(d => d.trade_date == moment(date).format('YYYYMMDD'));
        if (idx < dates.length - 1 && idx != -1) {
            return dates[idx + 1];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
};

const getContPrevious = async (code, date) => {
    const price = await getPreviousDay(code, date);
    return price ? price.continuous : 0;
};

const computeContinuous = async (code, date) => {
    let start_date = date || '2000-01-01';
    const prices = await getPricesAfter(code, start_date);
    logger.info(`-- get ${prices.length} records.`);
    let con_status = await getContPrevious(code, start_date);
    logger.info(`-- the previous continuous is ${con_status}.`);
    for (let i = 0; i < prices.length; i ++) {
        let yest = con_status > 0, p = prices[i];
        if (p.change_px > 0) {
            con_status = yest ? con_status + 1 : 1;
        }
        else {
            con_status = yest ? -1 : con_status - 1;
        }
        let result = await db.update('leu_price_perday', {
            continuous: con_status 
        }, {
            where: {
                stock_code: p.stock_code,
                trade_date: p.trade_date,
            },
            columns: [ 'continuous' ],
        });
        if (result.affectedRows == 1) {
            console.log(`updated ${p.stock_code} continuous at ${p.trade_date} to ${con_status}`);
        }
        else {
            console.error(`${p.stock_code} continuous at ${p.trade_date} update error!`);
        }
    }
    return true;
};

module.exports = { 
    computeContinuous, getPrices, getPricesAfter, getPricesBefore
};

