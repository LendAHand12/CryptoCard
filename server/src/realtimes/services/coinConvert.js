const { symbolList, coinList } = require('../models/coinList')
const coinConfig = require('../configs/coinConfig.json');
const conf = require('../configs/realtimeConfig.json');


convert = async function (dataCoin, io, type) {

    if ("undefined" === typeof (dataCoin)) return false;
    //When server is very first start and get event socket calling.
    if (coinList.length == 0) {
        symbolList.forEach(item => {
            if ("undefined" === typeof (dataCoin[`${item}USDT`])) return false;
            const coin = {
                symbol: item,
                name: coinConfig[`${item}USDT`],
                price: Math.round((dataCoin[`${item}USDT`]) * 1000)/1000,
                rate: 0,
                toggle: false
            }
            coinList.push(coin)
        });
    }
    //When event is called atleast 1
    else {
        coinList.forEach(item => {
            // if ("undefined" === typeof (dataCoin[`${item}USDT`])) {return false};
            const price = dataCoin[`${item.symbol}USDT`];
            if (item.price != price) {
                if(type === "sec"){
                    if(item.price > price)
                    { item.rate = 0-((item.price-price)/price) }
                    else if(item.price < price)
                    { item.rate = (price-item.price)/item.price }
                    else if(item.price == price)
                    { item.rate = 0 }
                 }
                if(type === "min"){
                    item.price = Math.round(price * 1000)/1000;
                }
            }
        });
    }
    io.emit(conf.ST_CN_CE, coinList);
}
module.exports.convert = convert
