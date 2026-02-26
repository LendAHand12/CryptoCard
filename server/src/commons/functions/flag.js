const {
    error_400
} = require("../../message")
const {
    flagAmountToSymBol
} = require("../../sockets/functions")
const customerQuery = require("../../sockets/queries/customerQuery")
const {
    getPriceCoin
} = require("./validateObj")

module.exports = {
    flagFeeWidthDraw: async (userid, symbol, amount, res) => {
        let wallet = symbol
        symbol = symbol.replace('_TRC20', '')
        symbol = symbol.replace('.TRC20', '')
        const token = await customerQuery.getTokenToName(symbol)
        if (token.length > 0) {
            const minimumWidthDraw = token[0].minimum_widthdraw
            if (amount >= minimumWidthDraw) {
                const feeWidthDraw = token[0].fee_widthdraw
                const fee = token[0].fee
                const symbolFee = token[0].blockchain
                const walletUserFee = await customerQuery.getWalletToIdUser(userid, symbolFee)
                if (walletUserFee.length > 0) {
                    if (walletUserFee[0].amount >= feeWidthDraw) {
                        const walletUser = await customerQuery.getWalletToIdUser(userid, wallet)
                        if (walletUser.length > 0) {
                            const feeTransfer = await customerQuery.getExhange('TRANSFER')
                            const feeAmount = amount + (amount * (feeTransfer[0].raito/100))
                            if (feeAmount <= walletUser[0].amount) {
                                return true
                            } else {
                                error_400(res, `You cannot withdraw ${amount} ${symbol} with a withdrawal fee of ${feeAmount} ${symbol} `, 30)
                            }
                        } else {
                            error_400(res, `Your ${symbolFee} balance is not enough Front End error`, 30)
                        }
                    } else {
                        error_400(res, `Your ${symbolFee} balance is not ${feeWidthDraw} ${symbolFee} enough for gas fee`, 30)
                    }
                } else {
                    error_400(res, `Your ${symbolFee} balance is not enough Front End error`, 30)
                }
            } else {
                error_400(res, `You must withdraw at least ${minimumWidthDraw} ${symbol}`, 29)
            }
        } else {
            error_400(res, "Symbol is not coin", 3)
        }
    },
    flagOptionBuyCoin: async (amount, symbol, userid) => {
        try {
            const priceBonus = await getPriceCoin("STF_TRC20")
            const priceSymbol = await getPriceCoin(symbol)
            const USDPriceSymbol = amount * priceSymbol.lastPrice
            const amount10PercentBonus = USDPriceSymbol * 0.1 / priceBonus.lastPrice
            const amount90PercentSymbol = USDPriceSymbol * 0.9 / priceSymbol.lastPrice
            const flagAmountBonus = await flagAmountToSymBol(userid, "STF_TRC20", amount10PercentBonus)
            const flagAmountSymbol = await flagAmountToSymBol(userid, symbol, amount90PercentSymbol)
            if (!flagAmountBonus) return {
                message: `STF_TRC20 balance is not enough ${amount10PercentBonus}`,
                status: false
            }

            if (!flagAmountSymbol) return {
                message: `${symbol} balance is not enough ${amount10PercentBonus}`,
                status: false
            }

            return {
                status: true,
                amountSymbol: amount90PercentSymbol,
                amountBonus: amount10PercentBonus,
                symbolBonus: `STF_TRC20`
            }
        } catch (error) {
            console.log(error, "flagOptionBuyCoin");
        }

    }
}