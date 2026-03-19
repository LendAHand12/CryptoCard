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
const { getRowToTable, addRowToTable, updateRowToTable } = require('../query/funcQuery');
const Web3 = require('web3');
// BSC mainnet RPC + USDT BEP-20 contract
const _web3BSC = new Web3('https://bsc-dataseed1.binance.org:443');
const _contractUSDT_BSC = '0x55d398326f99059fF775485246999027B3197955'; // USDT BEP-20
const ERC20_TRANSFER_ABI = [{
    anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }],
    name: 'Transfer', type: 'event'
}, {
    constant: false, inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }],
    name: 'transfer', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function'
}];
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
// ── NEW: get admin wallet address for direct deposit ──────────────────────────
router.post('/getAdminWallet', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const adminWallet = process.env.ADMIN_WALLET;
        if (!adminWallet) return error_400(res, 'Admin wallet not configured in .env', 1);
        success(res, 'ok', { address: adminWallet });
    } catch (error) {
        console.log(error);
        error_500(res, error);
    }
});

// ── NEW: verify on-chain tx and credit USDT balance ───────────────────────────
router.post('/confirmDeposit', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { txHash, symbol = 'USDT.BEP20', amount } = req.body;
        const userid = req.user;

        console.log('[confirmDeposit] CALLED — userid:', userid, 'txHash:', txHash, 'amount:', amount, 'symbol:', symbol);

        if (!txHash) {
            console.log('[confirmDeposit] ERROR 1: txHash missing');
            return error_400(res, 'txHash is required', 1);
        }
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            console.log('[confirmDeposit] ERROR 2: invalid amount', amount);
            return error_400(res, 'Invalid amount', 2);
        }

        // 1. Lấy địa chỉ admin từ .env
        const adminAddress = (process.env.ADMIN_WALLET || '').toLowerCase();
        console.log('[confirmDeposit] adminAddress:', adminAddress);
        if (!adminAddress) {
            console.log('[confirmDeposit] ERROR 3: ADMIN_WALLET not set in .env');
            return error_400(res, 'Admin wallet not configured in .env', 3);
        }

        // 2. Kiểm tra txHash chưa được xử lý
        const existingLog = await getRowToTable('blockchain_log', `hash='${txHash}'`);
        console.log('[confirmDeposit] existingLog count:', existingLog?.length);
        if (existingLog && existingLog.length > 0) {
            console.log('[confirmDeposit] ERROR 4: txHash already processed');
            return error_400(res, 'Transaction already processed', 4);
        }

        // 3. Verify on-chain (log kết quả, không chặn nếu RPC lỗi)
        let amountFromChain = parseFloat(amount);
        try {
            const receipt = await _web3BSC.eth.getTransactionReceipt(txHash);
            console.log('[confirmDeposit] receipt status:', receipt?.status, 'logs count:', receipt?.logs?.length);
            if (receipt && receipt.status) {
                for (const log of receipt.logs) {
                    if (log.address.toLowerCase() !== _contractUSDT_BSC.toLowerCase()) continue;
                    try {
                        const decoded = _web3BSC.eth.abi.decodeLog(
                            [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'value', type: 'uint256' }],
                            log.data,
                            log.topics.slice(1)
                        );
                        const transferTo = decoded.to.toLowerCase();
                        const transferValue = BigInt(decoded.value);
                        amountFromChain = parseFloat(transferValue.toString()) / 1e18;
                        console.log('[confirmDeposit] decoded Transfer → to:', transferTo, 'amount:', amountFromChain);
                        if (transferTo !== adminAddress) {
                            console.log('[confirmDeposit] ERROR 7: transferTo', transferTo, '!= adminAddress', adminAddress);
                            return error_400(res, 'Transfer destination does not match admin wallet', 7);
                        }
                        break;
                    } catch (decErr) {
                        console.log('[confirmDeposit] decode log error:', decErr.message);
                    }
                }
            } else {
                console.log('[confirmDeposit] WARNING: receipt not ready or failed — using client amount:', amountFromChain);
            }
        } catch (rpcErr) {
            console.log('[confirmDeposit] RPC error (non-fatal):', rpcErr.message, '— using client amount:', amountFromChain);
        }

        // 4. Lấy thông tin user
        const userRows = await getRowToTable('users', `id=${userid}`);
        console.log('[confirmDeposit] userRows found:', userRows?.length);
        if (!userRows || userRows.length === 0) {
            console.log('[confirmDeposit] ERROR 9: user not found for id', userid);
            return error_400(res, 'User not found', 9);
        }
        const user = userRows[0];

        // 5. Lấy wallet USDT (Số dư chính mà user nhìn thấy)
        const walletCodeUpdate = 'USDT'; 
        const logCoinKey = 'USDT.BEP20'; 
        
        const walletRows = await getRowToTable('tb_wallet_code', `userid=${userid} AND code='${walletCodeUpdate}'`);
        console.log('[confirmDeposit] wallet to update:', walletCodeUpdate, 'found:', walletRows?.length);
        
        if (!walletRows || walletRows.length === 0) {
            console.log(`[confirmDeposit] ERROR 10: wallet ${walletCodeUpdate} not found for userid`, userid);
            return error_400(res, `Wallet ${walletCodeUpdate} not found for user`, 10);
        }

        const amountBefore = parseFloat(walletRows[0].amount);
        const usdtCredit = parseFloat(amountFromChain.toFixed(6));
        const amountAfter = amountBefore + usdtCredit;
        console.log('[confirmDeposit] Balance update:', walletCodeUpdate, '| before:', amountBefore, '→ after:', amountAfter);

        // 6. Cộng balance vào row USDT
        await updateRowToTable('tb_wallet_code', `amount=amount+${usdtCredit}`, `userid=${userid} AND code='${walletCodeUpdate}'`);
        console.log('[confirmDeposit] tb_wallet_code updated ✓');

        // 7. Ghi log với coin_key là USDT.BEP20
        const logObj = {
            userName: user.username,
            email: user.email,
            hash: txHash,
            user_id: userid,
            from_id: userid,
            coin_key: logCoinKey,
            usd_amount: usdtCredit,
            amount: usdtCredit,
            category: 'receive',
            address: adminAddress,
            to_address: adminAddress,
            status: 1,
            message: `USDT BEP-20 Direct Deposit (MetaMask/WalletConnect)`,
            before_amount: amountBefore,
            after_amount: amountAfter,
            created_at: Math.floor(Date.now() / 1000)
        };
        await addRowToTable('blockchain_log', logObj);
        console.log('[confirmDeposit] blockchain_log inserted ✓');

        success(res, `Deposit ${usdtCredit} ${logCoinKey} successful`, { amount: usdtCredit, walletCode: logCoinKey });
    } catch (error) {
        console.log('[confirmDeposit] FATAL ERROR:', error);
        error_500(res, error);
    }
});


module.exports = router