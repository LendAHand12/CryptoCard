const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: '<key>',
  APISECRET: '<secret>'
});

coinApi = async function() {
  return await binance.prices();
}

module.exports.coinApi = coinApi