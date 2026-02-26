const data = require('../../database/account')
const { updateRowToTable, getRowToTable } = require('../../query/funcQuery')
const customerQuery = require('../queries/customerQuery')
async function updateBalanceWalletOrUser(idUser, symbol, amount) {
    var amount = parseFloat(amount)
    const user = await customerQuery.getUserToId(idUser)
    const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)

    var symbolUser = symbol
    if (symbol.toLowerCase() == "bos") {
        symbolUser = "bos"
    } else if (symbol.toLowerCase() == "win") {
        symbolUser = "win"
    }
    var flag = array.filter(e => e == symbolUser.toLowerCase())
  //console.log(flag.length)
    if (flag.length > 0) {
        if (symbol.toLowerCase() == "bos") {
            symbolUser = "coin"
        } else if (symbol.toLowerCase() == "win") {
            symbolUser = "win_trc20"
        }

        const value = user[0][`${symbolUser.toLowerCase()}_balance`] - amount
        const result = await customerQuery.updateBalanceUsers(idUser, value, `${symbolUser.toLowerCase()}_balance`)
    } else {
      //console.log(symbol);
        const value = wallet[0][`amount`] - amount
        const result = await customerQuery.updateBalance(idUser, value, `${symbol}`)
    }
}
async function updateBalanceWalletOrUserBonus(idUser, symbol, amount) {

    const user = await customerQuery.getUserToId(idUser)
    const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
    var amount = parseFloat(amount)
    var symbolUser = symbol
    if (symbol.toLowerCase() == "bos") {
        symbolUser = "bos"
    } else if (symbol.toLowerCase() == "win") {
        symbolUser = "win"
    }
    var flag = array.filter(e => e == symbolUser.toLowerCase())
  //console.log(flag.length)
    if (flag.length > 0) {
        if (symbol.toLowerCase() == "bos") {
            symbolUser = "coin"
        } else if (symbol.toLowerCase() == "win") {
            symbolUser = "win_trc20"
        }
        const value = user[0][`${symbolUser.toLowerCase()}_balance`] + amount
        const result = await customerQuery.updateBalanceUsers(idUser, value, `${symbolUser.toLowerCase()}_balance`)
    } else {
        const value = wallet[0][`amount`] + amount
        const result = await customerQuery.updateBalance(idUser, value, `${symbol}`)
    }
}
var array = ["btc", "eth", "usdt", "usd", "trx", "bos", "win"]
module.exports = {

    flagSymbolFunc: async (symbol) => {
        const getTrc20 = await customerQuery.getTrc20()
        var flag = true
        getTrc20.forEach(e => {
            if (`${e.symbol.toLowerCase()}_trc20` == symbol.toLowerCase()) {
                flag = false
            }
        })

        return flag
    },
    dataSymbol: async (symbol) => {
        var flagSymbolForm = symbol
        if (symbol == "BOS_TRC20") {
            flagSymbolForm = "bos"
        } else if (symbol == "BPAY_TRC20") {
            flagSymbolForm = "bpay_trc20"
        } else if (symbol == "USDT.TRC20") {
            flagSymbolForm = "usdt"
        } else if (symbol == "WIN_TRC20") {
            flagSymbolForm = "win"
        }
        return flagSymbolForm
    },
    updateBalanceWalletOrUser: async (idUser, symbol, amount) => {
        try {
            var amount = parseFloat(amount)
            var symbol = symbol.toUpperCase()
            const user = await customerQuery.getUserToId(idUser)
            const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)

            if (wallet.length > 0) {
                await updateRowToTable(`tb_wallet_code`,`amount=amount-${amount}`,`code='${symbol}' AND userid=${idUser}`)
                return true
            }
            return false
        } catch (error) {
            return false
        }
    },
    covenrtInternalCoin: async (idUser, amountForm, lastPriceForm, lastPriceTo, percent, symbolForm, symbolTo) => {
        const user = await customerQuery.getUserToId(idUser)
        let UsdtToAmountForm = amountForm * lastPriceForm
        let amountTo = UsdtToAmountForm / lastPriceTo
        var amountPercent = amountTo * percent
        var amountPriceTo = amountTo - amountPercent
      //console.log(amountPriceTo, "price to to to to to");
        await updateBalanceWalletOrUser(idUser, symbolForm, amountForm)
        await updateBalanceWalletOrUserBonus(idUser, symbolTo, amountPriceTo)
        await customerQuery.addConvenrtCoin(idUser, amountForm, symbolForm, amountPriceTo, symbolTo, lastPriceTo)
        await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm} to ${amountPriceTo} ${symbolTo}`)

    },
    symbolConvenrtTrc20: async (symbol) => {
        var tokenTrc20 = await customerQuery.getTrc20()
        var flag = true
        var data = symbol
        tokenTrc20.forEach((element) => {
            if (symbol == element) {
                flag = false
            }
        })
        if (!flag) {
            data = `${symbol}_TRC20`
        }
        return data
    },
    convertSymbol: async (symbolForm, symbolTo, idUser) => {
        let obj = {}
        let flag = false
      //console.log("ok", symbolForm, symbolTo);
        if (symbolForm == "BOS_TRC20") {
            if (symbolTo == "BPAY_TRC20") {
                const pricez = await customerQuery.getExhange("BOS")
                obj.symbolForm = "bos"
                obj.lastPriceForm = pricez[0].raito
                const pricezz = await customerQuery.getExhange("BPAY")
                obj.symbolTo = "BPAY_TRC20"
                obj.lastPriceTo = pricezz[0].raito
                flag = true
            } else {
                const pricez = await customerQuery.getExhange("BOS")
                obj.symbolForm = "bos"
                obj.lastPriceForm = pricez[0].raito
                flag = true
            }
        } else if (symbolForm == "BPAY_TRC20") {
          //console.log("xzxzx1");
            if (symbolTo == "BOS_TRC20") {
                const pricez = await customerQuery.getExhange("BPAY")
                obj.symbolForm = "BPAY_TRC20"
                obj.lastPriceForm = pricez[0].raito
                const pricezz = await customerQuery.getExhange("BOS")
                obj.symbolTo = "bos"
                obj.lastPriceTo = pricezz[0].raito
              //console.log("xzxzx");
                flag = true
            } else {
                const pricez = await customerQuery.getExhange("BPAY")
                obj.symbolForm = "BPAY_TRC20"
                obj.lastPriceForm = pricez[0].raito
                flag = true
            }

        } else if (symbolTo == "BOS_TRC20") {
            const pricez = await customerQuery.getExhange("BOS")
            obj.symbolTo = "bos"
            obj.lastPriceTo = pricez[0].raito
            flag = true

        } else if (symbolTo == "BPAY_TRC20") {
            if (symbolForm == "BOS_TRC20") {
                const pricez = await customerQuery.getExhange("BPAY")
                obj.symbolTo = "BPAY_TRC20"
                obj.lastPriceTo = pricez[0].raito
                const pricezz = await customerQuery.getExhange("BPAY")
                obj.symbolForm = "BPAY_TRC20"
                obj.lastPriceForm = pricezz[0].raito
                flag = true
            } else {
                const pricez = await customerQuery.getExhange("BPAY")
                obj.symbolTo = "BPAY_TRC20"
                obj.lastPriceTo = pricez[0].raito
                flag = true
            }


        }

        if (flag) {
            return obj
        } else {
            return flag
        }
    },
    flagWalletUSD: async (symbolForm, symbolTo, idUser) => {
        if (symbolForm == "USD") {
            const walletTo = await customerQuery.getWalletToIdUser(idUser, symbolTo)
            if (walletTo.length > 0) {
                return true
            } else {
                return symbolTo
            }
        } else {
            const walletForm = await customerQuery.getWalletToIdUser(idUser, symbolForm)
            if (walletForm.length > 0) {
                return true
            } else {
                return symbolForm
            }
        }
    },
    convertSymbolWallet: (symbol) => {
        var symbol = symbol
        if (symbol == "BOS_TRC20") {
            symbol = "bos"
        } else if (symbol == "WIN_TRC20") {
            symbol = "win"
        } else if (symbol == "USDT.TRC20") {
            symbol = "usdt"
        }


        return symbol
    },
    getMemberF1User: async (userid) => {
        const memberF1 = await customerQuery.getUserToInvertId(userid)
        return memberF1.length
    },
    priceCoinAdmin: async (obj) => {
        var x = obj.price
        if (obj.flag == 0) {
            x = obj.price
        } else if (obj.flag == 1) {
            x = obj.set_price
        }
        return x
    },
    getWallet: async (idUser) => {
        const walletUser = await customerQuery.getWalletToIdUserAPI(idUser)
        var arrayObj = {}
        const substring = ".amc20";
        walletUser.forEach(e => {
            let string = e.code.toLowerCase()

            arrayObj[`${string}_balance`] = e.amount
        })
        return arrayObj
    },
    flagAmountToSymBol: async (idUser, symbol, amount,flag) => {
        if(symbol=="STF_TRC20" && flag){
            symbol = "STF_BONUS"
        }
        const user = await customerQuery.getUserToId(idUser)
        const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
        var ifFlag
        if (wallet[0].amount >= amount) {
            ifFlag = true
        } else {
            ifFlag = false
        }
        console.log(ifFlag);
        return ifFlag
        var symbolUser = symbol
        var symbolTest = symbol
        var amount = parseFloat(amount)
        if (symbol.toLowerCase() == "bos") {
            symbolUser = "coin"
        } else if (symbol.toLowerCase() == "win") {
            symbolUser = "win_trc20"
        }
        var flag = array.filter(e => e == symbolTest.toLowerCase())

        var ifFlag
        if (flag.length > 0) {
            if (user[0][`${symbolUser.toLowerCase()}_balance`] >= amount) {
                ifFlag = true
            } else {
                ifFlag = false
            }
        } else {
          //console.log(typeof (wallet[0][`amount`]), typeof (amount), "amounttttt");

        }
    },

    updateBalanceWalletOrUserBonus: async (idUser, symbol, amount) => {
        var symbol = symbol.toUpperCase()
        // const user = await customerQuery.getUserToId(idUser)
  
        const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
        var amount = parseFloat(amount)
        if (wallet.length > 0) {

            await updateRowToTable(`tb_wallet_code`,`amount=amount+${amount}`,`code='${symbol}' AND userid=${idUser}`)
            //    console.log(w);
        }
    },
    addBalanceWallet: async (idUser, symbol, amount) => {

        const user = await customerQuery.getUserToId(idUser)
        const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
        var symbolUser = symbol
        // const tokenTrc20 = await customerQuery.getTrc20()
        // var flagSymbol = false
        // tokenTrc20.forEach(tokenTrc20 => {
        //     if (`${tokenTrc20.symboTrl.toLowerCase()}_trc20` == symbol.toLowerCase()) {
        //         flagSymbol = true
        //     }
        // })
        if (symbol.toLowerCase() == "bos_trc20") {
            symbolUser = "bos"
        } else if (symbol.toLowerCase() == "win_trc20") {
            symbolUser = "win"
        } else if (symbol.toLowerCase() == "usdt_trc20") {
            symbolUser = "usdt"
        }


        var flag = array.filter(e => e == symbolUser.toLowerCase())
      //console.log(flag.length)
        if (flag.length > 0) {
            if (symbolUser.toLowerCase() == "bos") {
                symbolUser = "coin"
            } else if (symbolUser.toLowerCase() == "win") {
                symbolUser = "win_trc20"
            }
            const value = user[0][`${symbolUser.toLowerCase()}_balance`] + amount
            const result = await customerQuery.updateBalanceUsers(idUser, value, `${symbolUser.toLowerCase()}_balance`)
        } else {
            const value = wallet[0][`amount`] + amount
            const result = await customerQuery.updateBalance(idUser, value, `${symbol}`)
        }
    },
    checkPhoneAccount: (phone) => {
        const array = data.account
        let flag = true
        array.forEach(user => {
            if (user === phone) {
                flag = false
            }
        })
        return flag
    },
    checkOutAccount: (phone, id) => {
        const array = data.account
        const update = array.filter(item => item.id != id)
        return update
    },
    convertSymbolGetWallet: async (symbol) => {
        var symbol = symbol
        if (symbol == "USDT") {
            symbol = "USDT.TRC20"
        }
        const trc20 = await customerQuery.getTrc20()
        trc20.forEach(element => {
            if (element.symbol == symbol) {
                symbol = `${element.symbol}_TRC20`
            }
        })
        return symbol
    },
    arrayToString: (array) => {
        const str = array.join(" ")
        // let a = str.replace(",", /\s+/g)
        return str
    }
}