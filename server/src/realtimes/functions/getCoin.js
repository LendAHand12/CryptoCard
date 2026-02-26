const Binance = require('node-binance-api');
const coinList = require('../models/coinList')
const axios = require('axios')
const customerQuery = require('../../sockets/queries/customerQuery')
const validation = require('../../sockets/functions/validation');
const {
    response
} = require('express');
const binance = new Binance().options({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});
getCoinBinance = async (email) => {
    try {
        var array = []
        if (email) {
            const profileUser = await customerQuery.getProfileEmail(email)
            if (profileUser[0].tokenAdd == null) {
                var arrayCoin = JSON.parse(profileUser[0].listCoin)
                arrayCoin.forEach((element) => {
                    var str = `${element.symbol}`
                    const obj = {
                        symbol: str,
                        flag: element.flag
                    }
                    array.push(obj)
                })
            } else {
                var arrayCoin = JSON.parse(profileUser[0].listCoin)
                const arrayData = JSON.parse(profileUser[0].tokenAdd)
                var array = arrayCoin
                // arrayCoin.forEach((element) => {
                //     array.push(element.symbol)
                // })
                arrayData.forEach(element => {

                    var str = `${element.symbol}USDT`
                    const obj = {
                        symbol: str,
                        flag: element.flag
                    }
                    array.push(obj)
                })
            }
        }
        return array
    } catch (error) {
      console.log(error);
    }
}
module.exports = {
    getMoney: async (wallet, response) => {

        wallet.forEach(element => {
            if (`${element.symbol}USDT` == response.symbol) {
                var tong = 0
                var a = parseFloat(response.bestAsk) * parseFloat(element.amount)
                tong += a
            }
        })
        return tong
    },
    getCoinBinance: async (email) => {
        try {
            var array = []
            if (email) {
                const profileUser = await customerQuery.getProfileEmail(email)
                if (profileUser[0].tokenAdd == null) {
                    var arrayCoin = JSON.parse(profileUser[0].listCoin)
                    arrayCoin.forEach((element) => {
                        var str = `${element.symbol}`
                        const obj = {
                            symbol: str,
                            flag: element.flag
                        }
                        array.push(obj)
                    })
                } else {
                    var arrayCoin = JSON.parse(profileUser[0].listCoin)
                    const arrayData = JSON.parse(profileUser[0].tokenAdd)
                    var array = arrayCoin
                    // arrayCoin.forEach((element) => {
                    //     array.push(element.symbol)
                    // })
                    arrayData.forEach(element => {

                        var str = `${element.symbol}USDT`
                        const obj = {
                            symbol: str,
                            flag: element.flag
                        }
                        array.push(obj)
                    })
                }
            }
            return array
        } catch (error) {
          console.log(error);
        }
    },
    getListCoin: async (email) => {
        var testArray = []

        const user = await customerQuery.getProfileEmail(email)
        var tokenAdd = JSON.parse(user[0].tokenAdd)
        user[0].coin = await getCoinBinance(email)
        const prevDay = await binance.prevDay(false)
        for (let obj of prevDay) {
            user[0].coin.forEach(element => {
                if (element.symbol == obj.symbol) {
                    var str = element.symbol.replace('USDT', '');
                    obj.image = `vinawalletCoin/${str}.png`
                    obj.flag = element.flag
                    testArray.push(obj)
                }
            })
        }
        var elem
        var arrayPush = []
        if (tokenAdd != null) {
            tokenAdd.forEach((element) => {
                var flag = false
                testArray.forEach((ele) => {
                    if (ele.symbol == `${element.symbol}USDT`) {
                        elem = element
                        flag = true
                    }
                })
                if (!flag) {
                    element.symbol = `${element.symbol}USDT`
                    testArray.push(element)
                }
            })
        }
        user[0].listCoin = testArray
        return testArray
    },
    getCoin: async (email) => {
        try {
            var array = []
            if (email) {
                const profileUser = await customerQuery.getProfileEmail(email)
                var data = await axios({
                    url: `https://poloniex.com/public?command=returnTicker`,
                    method: "GET"
                })
                if (profileUser[0].tokenAdd == null) {
                    var arrayCoin = JSON.parse(profileUser[0].listCoin)
                    arrayCoin.forEach(element => {
                        var str = element.symbol.replace('USDT_', '');
                        data.data[element.symbol].image = `vinawalletCoin/${str}.png`
                        data.data[element.symbol].symbol = element.symbol
                        data.data[element.symbol].flag = element.flag
                        array.push(data.data[element.symbol])
                    });
                } else {
                    const arrayData = JSON.parse(profileUser[0].tokenAdd)
                    var arrayCoin = JSON.parse(profileUser[0].listCoin)
                    arrayCoin.forEach(element => {
                        var str = element.symbol.replace('USDT_', '');
                        data.data[element.symbol].image = `vinawalletCoin/${str}.png`
                        data.data[element.symbol].symbol = element.symbol
                        array.push(data.data[element.symbol])
                    });
                    arrayData.forEach(element => {
                        var str = element.symbol.replace('USDT_', '');
                        if (data.data[element.symbol] != undefined) {
                            data.data[element.symbol].image = element.image
                            data.data[element.symbol].symbol = element.symbol
                            data.data[element.symbol].contract_address = element.contract_address
                            data.data[element.symbol].desc = element.desc
                            data.data[element.symbol].flag = element.flag
                            array.push(data.data[element.symbol])
                        } else {
                            array.push(element)
                        }
                    })
                }
            }
            // const email = validation.tokenUser(token)
            // var array = []
            // if (email) {
            //     
            // }
            return array
        } catch (error) {
          console.log(error);
        }
    },
    getCoinConvert: async () => {
        try {
            var array = []
            var data = await axios({
                url: `https://poloniex.com/public?command=returnTicker`,
                method: "GET"
            })
            coinList.symbolListUSDT.forEach(element => {
                var str = element.replace('USDT_', '');
                data.data[element].image = `vinawalletCoin/${str}.png`
                data.data[element].symbol = element
                array.push(data.data[element])
            })
            return array
        } catch (error) {
          console.log(error);
        }
    }
}


/// binaces
// const test = await binance.prevDay()
// test.forEach(api => {
//     var flag = false
//     var img = ""
//     coinList.symbolListUSDT.forEach(async (element) => {
//         if (api.symbol == element) {
//             flag = true
//             var str = element.replace('USDT', '');
//             img = str
//         }
//     })
//     if (flag) {
//         api.image = `vinawalletCoin/${img}.png`
//         array.push(api)
//     }
// });