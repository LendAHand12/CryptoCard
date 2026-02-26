const coinApi = require('./services/getCoinApi')

const coinConvert = require('./services/coinConvert');
const customRealTime = require('./services/customRealTime');
const jwt = require('jsonwebtoken')
const data = require('../database/account');
const {
    socket
} = require('../sockets/socket');
// const TronWeb = require('tronweb');
const connect = require('../database/database');
const Binance = require('node-binance-api');
const binance = new Binance({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});
const validation = require('../sockets/functions/validation')
const coinpayment = require('../sockets/services/getCoinApi')
// const HttpProvider = TronWeb.providers.HttpProvider;
const func = require('./functions/getCoin')
// const fullNode = new HttpProvider("https://api.trongrid.io");
// const solidityNode = new HttpProvider("https://api.trongrid.io");
// const eventServer = new HttpProvider("https://api.trongrid.io");
// const privateKey = "2e485b5e6621b4f60c081e7202fa2fcf9e1a2fedf8ee46ffa99a35e97cdf9365";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
// const CoinMarketCap = require('coinmarketcap-api')
const coinList = require('./models/coinList')
const apiKey = '1ef89e3d-7f62-45c1-83be-4a265d7261f7'
// const clientt = new CoinMarketCap(apiKey)
const Coinpayments = require('coinpayments');
const options = {
    key: '69af7ae08eb0fa17f25a05dc3044f7725bedd34f1496a0c8599c2ad1ba19672c',
    secret: 'Cf3aB1c2eF98c57e6217Ced6b79Fd957914287fF89103E94c88BA0272c5534e4',
    // autoIpn: true
}
// const subWallet = {
//     currency: 'BTC',
//     ipn_url: 'https://www.coinpayments.net/apidoc-get-deposit-address',
//     label: 'test user001'
// }
// 3MCZvxHiWqpAx3P7nebHdAEn75ohSKBJo4

const client = new Coinpayments(options);
const customerQuery = require('../sockets/queries/customerQuery')
const axios = require('axios');
const { qrCodeGenerator } = require('../commons');
// const apiPasser = require('./apiPasser');

let online = []
realtime = function (io) {
    var flagConnect = false;


    //Listening for connection client.
    io.on('connection', async function (socketIo) {
        //console.log("xzx");
        try {
            await qrCodeGenerator(socketIo)
            socketIo.on('login', (req) => {
                socketIo.join(`${req}`)
            })
            ///// end realtime ////////

            socketIo.on('getListCoin', async () => {
                var array = []
                const dataToken = await customerQuery.getAllToken()
                dataToken.forEach(element => {
                    if (element.flag == 0) {
                        delete element.set_price
                        delete element.flag
                        array.push(element)
                    } else if (element.flag == 1) {
                        element.price = element.set_price
                        delete element.flag
                        delete element.set_price
                        array.push(element)

                    }

                    element.image = `images/${element.name}.png`
                })
                socketIo.emit(`getListCoin`, array)
            })
            socketIo.on('join', (userid) => {
                socketIo.join(`${userid}`);
                socketIo.emit('ok','ok')
            })
            socketIo.on('chart', async (symbol) => {
                binance.websockets.chart(symbol, "1w", (symbol, interval, chart) => {
                    let tick = binance.last(chart);
                    //   const last = chart[tick].close;

                    // Optionally convert 'chart' object to array:
                    // let ohlc = binance.ohlc(chart);
                    // console.info(symbol, ohlc);

                    socketIo.emit(`${symbol}`, chart)
                });
            })

            ////////////
        } catch (error) {
            console.log(error, "sk");
        }

    });
}

module.exports.realtime = realtime