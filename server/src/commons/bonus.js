const { addRowToTable } = require("../query/funcQuery")
const { updateBalanceWalletOrUserBonus } = require("../sockets/functions")
const customerQuery = require("../sockets/queries/customerQuery")
const { getPriceCoin } = require("./functions/validateObj")

module.exports = {
    bonusUserReferral: async (userid, amount, symbol,strFunction) => {
        //inviter_id
        
        const symbolBonus = "STF_BONUS"
        const user = await customerQuery.getUserToId(userid)
        const wallet = await customerQuery.getWalletToIdUser(user[0].inviter_id, symbolBonus)
        const walletUser = await customerQuery.getWalletToIdUser(userid, symbolBonus)
        const userBonus = await customerQuery.getUserToId(user[0].inviter_id)
        if (wallet.length <= 0) await customerQuery.addWalletCodeVND(user[0].inviter_id, userBonus[0].username, symbolBonus)
        if (walletUser.length <= 0) await customerQuery.addWalletCodeVND(userid, user[0].username, symbolBonus)
        const price = await getPriceCoin(symbol)
        const priceSTF = await getPriceCoin('STF')
    
        const amountUSD = parseFloat(amount) * price.lastPrice
        const amountBonusSTF = amountUSD / priceSTF.lastPrice
        console.log("BONUS",amountBonusSTF,price.lastPrice,priceSTF.lastPrice);
        const amountBonusParent = amountBonusSTF*2
        const amountBonusUser = amountBonusSTF/2
        await customerQuery.updateSTFTURN(amountBonusParent+amountBonusUser)
        await updateBalanceWalletOrUserBonus(user[0].inviter_id,symbolBonus,amountBonusParent)
        await updateBalanceWalletOrUserBonus(userid,symbolBonus,amountBonusUser)
        const obj = {
            userid : user[0].inviter_id,
            username : userBonus[0].username,
            userid_from : userid,
            username_from: user[0].username,
            amount : amountBonusSTF,
            symbol : symbolBonus,
            function : strFunction
        }
        await addRowToTable(`tb_bonus_fee_transaction`,obj)
    },
}