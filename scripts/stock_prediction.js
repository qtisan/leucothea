
const { getPricesBefore } = require('./compute_continuous');

const predicte = async (code, date) => {
    const prices = getPricesBefore(code, date);
    
};


