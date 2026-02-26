var express = require('express');
var router = express.Router();
const {
    error_400,
    error_500,
    success
} = require('../message');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const customerQuery = require('../sockets/queries/customerQuery');
const blockIcoQuery = require('../query/blockIcoQuery');
const {
    getBlockFunc,
    test
} = require('../commons/functions/blockico');
const {
    authenticateKyc, authenticateWallet
} = require('../middlewares/authenticate');
const {
    flagAmountToSymBol,
    updateBalanceWalletOrUser,
    updateBalanceWalletOrUserBonus
} = require('../sockets/functions');
const {
    getPriceCoin
} = require('../commons/functions/validateObj');
const {
    createWalletBEP20
} = require('../lib/web3');
const {
    createTrc20Wallet
} = require('../lib/createWallet');
const {
    flagOptionBuyCoin
} = require('../commons/functions/flag');
const { createWallet } = require('../lib/coinpayment');
const { getRowToTable } = require('../query/funcQuery');
router.post('/buyblock', passport.authenticate('jwt', {
    session: false
}), authenticateWallet, async function (req, res, next) {
    try {
        const {
            amountToken,
            symbol,
            type
        } = req.body
        const userid = req.user
        const listAmountIco = await blockIcoQuery.getListAmountIco()
        const even = (element) => element.amount == amountToken
        if (!listAmountIco.some(even)) return error_400(res, `Invalid purchase quantity`, 1)

        const block = await getBlockFunc()
        if (!block.flag) return error_400(res, `There are no blocks for sale yet`, 2)

        const token = block.total_token - block.sold
        if (token - amountToken < 0) return error_400(res, `The remaining amount is only ${token} SWB in block`, 3)

        const priceToken = block.price * amountToken
        const getPriceUSDCoin = await getPriceCoin(symbol)
        const amountCoin = priceToken / getPriceUSDCoin.lastPrice
        const flagAmount = await flagAmountToSymBol(userid, symbol, amountCoin)
        if (!flagAmount) return error_400(res, `User does not have enough ${symbol} to buy ICO`, 4)

        const dataWallet = await createTrc20Wallet(userid, "SWB_TRC20")
        const profileUser = await customerQuery.getUserToId(userid)
        const optionSWB = type == 2 ? true : false
        if (optionSWB) {
            const flagOption = await flagOptionBuyCoin(amountCoin, symbol, userid)
            if (!flagOption.status) return error_400(res, flagOption.message, 15)

            await updateBalanceWalletOrUser(userid, flagOption.symbolBonus, flagOption.amountBonus)
            await updateBalanceWalletOrUser(userid, symbol, flagOption.amountSymbol)
        } else await updateBalanceWalletOrUser(userid, symbol, amountCoin)
        await blockIcoQuery.updateSold(block.id, amountToken)
        await updateBalanceWalletOrUserBonus(userid, "SWB_TRC20", amountToken)
        await blockIcoQuery.addHistoryBuyICO(userid, amountToken, block.price, profileUser[0].username, getPriceUSDCoin.lastPrice, dataWallet.address)
        success(res, `Buy ${amountToken} successful ICO for ${block.price} SWB/USD`)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})

router.post('/createWalletBEP20', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        let {
            symbol,
            swap
        } = req.body
        let string = symbol
        const substring = `.AMC20`
        symbol = string.includes(substring) ? string.slice(0, string.length - 6) : string
        const result = await createWalletBEP20(req.user, symbol)
        if (!swap) {
            if (symbol == 'HEWE' || symbol == 'AMC') {
                const dataAddress = await getRowToTable(`tb_config`, `name='addressUSDT'`)
                result.address = dataAddress[0].note
            }
        }
        if (!result.flag) return error_400(res, `Wallet not exit`, result)
        success(res, "Get block success!", result)
    } catch (error) {
        error_500(res, error)
    }
});
router.post('/getHistoryBuyBlock', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        const package = await blockIcoQuery.getHistoryBuyICO(limit, page, idUser)
        const packagePagination = await blockIcoQuery.getHistoryBuyICOPagination(idUser)
        for await (pack of package) {
            pack.created_at = new Date(pack.created_at)
            let day = pack.created_at.getDate();
            let month = pack.created_at.getMonth() + 1;
            let year = pack.created_at.getFullYear();
            var hours = pack.created_at.getHours();
            var minutes = pack.created_at.getMinutes();
            var seconds = pack.created_at.getSeconds();
            pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
        }
        const obj = {
            array: package,
            total: packagePagination.length
        }
        success(res, "Get block success!", obj)
    } catch (error) {
        error_500(res, error)
    }
});
router.post('/getblocknow', async function (req, res, next) {
    try {
        const block = await getBlockFunc()
        success(res, "Get block success!", block)
    } catch (error) {
        error_500(res, error)
    }
});
router.post('/getListAmountICO', async function (req, res, next) {
    try {
        const listAmountIco = await blockIcoQuery.getListAmountIco()
        success(res, "Get List Amount ICO success!", listAmountIco)
    } catch (error) {
        error_500(res, error)
    }
});
router.post('/getblockall', async function (req, res, next) {
    try {
        const block = await blockIcoQuery.getBlock()
        success(res, "Get block success!", block)
    } catch (error) {
        error_500(res, error)
    }
});
router.post('/getblocks', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const { limit, page, symbol } = req.body
        const idUser = req.user
        //console.log("ok");
        const package = await customerQuery.getHistoryDeposit(limit, page, idUser, symbol.toLowerCase())
        const allPackage = await customerQuery.getHistoryDepositPagination(idUser, symbol.toLowerCase())
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
                pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }
        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
module.exports = router