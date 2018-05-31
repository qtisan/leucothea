const rds = require('ali-rds');
const { dbConf } = require('../config');

const db = rds(dbConf);

db.addOrModify = (table, row, fields) => {
    const param = {};
    for (let field of fields.split(',')) {
        param[field] = row[field];
    }
    return db.get(table, param).then(r => {
        if (r) {
            return db.update(table, row, {
                where: param,
            });
        }
        else {
            return db.insert(table, row);
        }
    }).catch(e => {
        console.error(e);
        return { affectedRows: 0 }
    });
};

module.exports = db;

