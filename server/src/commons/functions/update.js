const {
    getPriceCoin
} = require("..")
const {
    updateBalanceWalletOrUser
} = require("../../sockets/functions")
const customerQuery = require("../../sockets/queries/customerQuery")

module.exports = {
    updateFeeWidthDraw: async (userid, symbol, flag,amount) => {
        try {
            const token = await getPriceCoin(symbol)
            if (token.length > 0) {
                const feeWidthDraw = token[0].fee_widthdraw
                const symbolFee = token[0].blockchain
                const minimumWidthDraw = token[0].minimumWidthDraw
                const fee = token[0].fee
                const walletUser = await customerQuery.getWalletToIdUser(userid, symbolFee)
                if (walletUser.length > 0) {
                    console.log("123", userid, symbolFee, feeWidthDraw, flag);
                    const feeTransfer = await customerQuery.getExhange('TRANSFER')
                    const feeAmount = amount * (feeTransfer[0].raito / 100)
                    console.log(feeAmount, symbol);
                    if (flag) {
                        const raito = await customerQuery.getExhange("WIDTHDRAWUSDTERC20")
                        const feeUSD = raito[0].raito
                        await updateBalanceWalletOrUser(userid, 'USDT', feeUSD)
                        await updateBalanceWalletOrUser(userid, symbol, feeAmount)
                    } else {
                        await updateBalanceWalletOrUser(userid, symbolFee, feeWidthDraw)
                        await updateBalanceWalletOrUser(userid, symbol, feeAmount)
                    }

                } else {
                    console.log("Wallet is not exit");
                }
            } else {
                console.log("Symbol is not coin");
            }
        } catch (error) {
            console.log(error);
        }
    }
}