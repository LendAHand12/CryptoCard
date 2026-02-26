const {
    default: axios
} = require("axios")
const Binance = require('node-binance-api');
const binance = new Binance({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});
const {
    flagAmountToSymBol,
    flagSymbolFunc
} = require("../../sockets/functions");
const customerQuery = require("../../sockets/queries/customerQuery");
const tokenTelegram = `6944035381:AAE9EO9eE2-VFCzKFiOyxDefajEqKX9ko-U`
const idChartTelegram = `-1002106601156`

// const TronWeb = require('tronweb');
const {
    createWallet
} = require("../../lib/coinpayment");
const { getRowToTable } = require("../../query/funcQuery");
// const apiTron = `https://api.trongrid.io`
// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider(apiTron);
// const solidityNode = new HttpProvider(apiTron);
// const eventServer = new HttpProvider(apiTron);
// const privateKey = "d60f68ae5fe9800848b499abc96761bdce1f2cb84f66361c8b6ebce9bdf2c994";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
async function createTrc20Wallet(idUser, symbol) {
    if (idUser) {
        if (symbol = "STF") {
            symbol = "STF_TRC20";
        }
        const wallet = await customerQuery.getWalletToIdUser(idUser, `${symbol}`)
        if (wallet.length > 0) {

        } else {
            const data = await tronWeb.createAccount()
            const user = await customerQuery.getUserToId(idUser)
            // quickwalletusa @gmail.com
            // await customerQuery.updateBase58Wallet(idUser, data.address.base58)
            await customerQuery.addWalletCodeTRC20(idUser, user[0].username, data.address.base58, `${symbol}`, data.privateKey, data.publicKey, data.address.hex)
            // await sendMail.sendMailPrivateKey("quickwalletusa@gmail.com", user[0].userName + " | " + res.address.base58, user[0].userName, res.privateKey, res.address.base58, res.address.hex, res.publicKey, user[0].email, user[0].idUser)



        }
    }
}
async function createWalletFunc(idUser, symbol) {
    const obj = {
        currency: symbol,
        label: idUser + `_${Math.floor(Math.random() * 9999999999) + 100000}`
    }
    const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
    if (wallet.length > 0) {

    } else {
        const user = await customerQuery.getUserToId(idUser)
        const resWallet = await createWallet(symbol)
        await customerQuery.addWalletCode(idUser, user[0].username, resWallet.address, symbol, resWallet.label)

    }

}
isValidObject = function (obj, type) {
    //Check all.
    if (typeof (type) === "undefined" || type !== "undefined" || type === null || type === '') {
        if (typeof (obj) !== "undefined" && obj !== null && obj !== '') {
            return true
        } else {
            return false
        }
    }

    //Check undefined only.
    else {
        if (typeof (obj) !== "undefined") {
            return true
        } else {
            return false
        }
    }
},

    isRequiredObject = function (obj, probs) {
        //Check mandatories. fields accessed(true), none params(false), or return list of missing;
        if ("undefined" === typeof (probs.length) || "undefined" === typeof (obj)) {
            return false
        }
        var listRequired = [];

        probs.forEach(el => {
            if (!this.isValidObject(obj[el])) {
                listRequired.push(el);
            }
        });

        if (listRequired.length == 0) {
            return true
        } else {
            return listRequired
        }
    },

    isDefinedObject = function (obj, probs) {
        var listDefined = [];
        probs.forEach(el => {
            if (this.isValidObject(obj[el], "undefined")) {
                listDefined.push(el);
            }
        });
        return listDefined;
    },
    dhm = (ms) => {
        days = Math.floor(ms / (24 * 60 * 60 * 1000));
        daysms = ms % (24 * 60 * 60 * 1000);
        hours = Math.floor((daysms) / (60 * 60 * 1000));
        hoursms = ms % (60 * 60 * 1000);
        minutes = Math.floor((hoursms) / (60 * 1000));
        minutesms = ms % (60 * 1000);
        sec = Math.floor((minutesms) / (1000));
        return days
    },
    checkWidthDraw = async function (symbol, idUser) {
        var flag = false
        var symbol = symbol.toUpperCase()
        var length = symbol.indexOf("_TRC20")
        if (length != -1 || symbol == "TRX") {
            await createWalletFunc(idUser, "TRX")
            const flagAmount = await flagAmountToSymBol(idUser, "TRX", 20)
            if (flagAmount) {
                flag = true
            } else {
                flag = false
            }
        } else {
            flag = true
        }
        return flag
    },
    getPriceCoin = async function (symbol) {
        var symbol = symbol.toUpperCase()
        if (symbol == "VND") {
            const raito = await customerQuery.getExhange("USD")
            const lastPrice = 1 / raito[0].raito
            return {
                lastPrice
            }
        }
        symbol = symbol.replace('_TRC20', '')
        const price = await customerQuery.getTokenToName(symbol)
        var coin = {}
        if (price.length > 0) {
            if (price[0].flag == 1) {
                coin = {
                    lastPrice: price[0].set_price,
                }
            } else {
                coin = {
                    lastPrice: price[0].price
                }
            }
            if (price[0].type == "TRC20") {
                coin.symbol = `${symbol}_TRC20`
            } else {
                coin.symbol = `${symbol}`
            }
            coin.deposit = price[0].deposit
            return coin
        } else {
            return "Token is not define!"
        }

    },
    checkKyc = async (idUser) => {
        const user = await customerQuery.getUserToId(idUser)

        if (user.length > 0) {
            if (user[0].verified == 1) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    },
    messageTelegram = async function (message) {
        try {

            // const res = await axios({
            //         url: `https://api.telegram.org/bot2013144517:AAFH85aOoykPHGWuBDFq7XTjb68e-viopUo/sendMessage?text=${message}&chat_id=-1001564109899`,
            //         method: `GET`
            // })
            // const res = await axios({
            //     url: `https://api.telegram.org/bot2055833248:AAGAwBaLFAYvdMtnJ102jsusRVj2XgH_Zg0/sendMessage?text=${message}&chat_id=-1001714081532`,
            //     method: `GET`
            // })
            // 1001714081532
            return res
        } catch (error) {
            //  //console.log(error,"tele message");
        }
    },
    messageTele = async function (message) {
        try {

            const res = await axios({
                url: encodeURI(`https://api.telegram.org/bot${tokenTelegram}/sendMessage?text=${message}&chat_id=${idChartTelegram}`),
                method: `POST`,
                header: {
                    "Accept": "*/*"
                }
            })
            return res
        } catch (error) {
            console.log(error, "tele message");
        }
    },
    messageTeleP2p = async function (message) {
        try {
            const tokenP2p = `6723656419:AAFfpWyBClbjLD41WLdLl1yRsvf8EvjkrG4` 
            const idChartTelegramP2P = `-1002053010310`
            const res = await axios({
                url: encodeURI(`https://api.telegram.org/bot${tokenP2p}/sendMessage?text=${message}&chat_id=${idChartTelegramP2P}`),
                method: `POST`,
                header: {
                    "Accept": "*/*"
                }
            })
            return res
        } catch (error) {
            console.log(error, "tele message");
        }
    },
    messageTelegramUser = async function (message) {
        try {


            // const res = await axios({
            //     url: `https://api.telegram.org/bot2059518823:AAFavMNPd7IjT2ao1-Qc6lNj8DKRwG6XpVM/sendMessage?text=${message}&chat_id=-1001338000539`,
            //     method: `GET`
            // })
            // // var res = "a"
            // return res
        } catch (error) {
            //  //console.log(error,"tele message");
        }
    },
    getCoin = async function (message) {
        try {
            var token = await getRowToTable(`tb_coin`,`set_price!=1`)
            var array = []
            for await (addToken of token) {
                array.push(`${addToken.name}BUSD`)
            }

            binance.websockets.prevDay(false, async (error, response) => {
                token.forEach(async element => {
                    try {
                        var str = ""
                        if (element.name == "USDT") {
                            str = `USDCUSDT`
                            const percenrt = await getRowToTable(`tb_config`, `name='exchangeRate'`)
                            const askFloat = parseFloat(response.bestAsk)
                            response.bestAsk = askFloat + askFloat * (percenrt[0].value / 100)
                            response.bestAsk = response.bestAsk.toFixed(2)
                        }
                        if (`${element.name}USDT` == response.symbol || response.symbol == str) {
                            await customerQuery.updatePriceCoin(element.name, response.bestAsk, response.percentChange, response.volume)
                        }
                    } catch (error) {
                        console.log(error, "upprice set price");
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    },
    module.exports = {
        getPriceCoin,
        isValidObject,
        isRequiredObject,
        isDefinedObject,
        messageTelegram,
        messageTelegramUser,
        dhm,
        getCoin,
        checkKyc,
        checkWidthDraw,
        messageTele,
        messageTeleP2p
    }