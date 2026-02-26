const dataDemo = require('../queries/walletQuery.json');

module.exports = {

    getCoinListService: async function (params) {
        return dataDemo;
    }
}