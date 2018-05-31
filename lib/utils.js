

const sleep = function (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('ok'), time);
    })
};

module.exports = { sleep };
