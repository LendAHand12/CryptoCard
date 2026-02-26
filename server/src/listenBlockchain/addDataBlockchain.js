require('dotenv').config()
const Web3 = require('web3');
const Tx = require("ethereumjs-tx").Transaction
const { getStartWeekAndLastDay, messageTelegram, messageTelegram2, decryptPrivateKey } = require("../commons");
const { sendMailMessage } = require("../sockets/functions/verifyEmail");
const { getRowToTable, updateRowToTable, addRowToTable } = require('../query/funcQuery');
const { transferAMC, transferHewe } = require('./addDataBlockchainAMC');
const { default: axios } = require('axios');
const RpcBSCMainnet = `https://indulgent-convincing-crater.bsc.quiknode.pro/2aa91caa6c5f1db27fbe1d6b679ec3260220944c/`
const RPC = RpcBSCMainnet ////swap rpc
const web3 = new Web3(RPC)
const contractUSDT = process.env.START == 'MAINNET' ? '0x55d398326f99059fF775485246999027B3197955' : '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'
const abiUSDT = process.env.START == 'MAINNET' ? [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [], "name": "_decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }] : [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [], "name": "_decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]


async function depositCoinUSDTBEP20(result, currency, walletSymbol, tokenInstance) {
    try {


        const walletUser = await getRowToTable(`tb_wallet_code`, `address='${result.returnValues.to}' AND code='USDT.BEP20'`)
        if (walletUser.length > 0) {
            // console.log(walletUser, "walletUser");
            // console.log(result, "result");
            const data = {
                amount: parseFloat(result.returnValues.value) / 1e18,
                currency,
                txn_id: result.transactionHash,
                userid: walletUser[0].userid
            }
            // console.log(data);
            if (data.amount < 5) return
            let address = result.returnValues.to
            let quantity = data.amount
            let code = data.currency
            let txhash = data.txn_id
            let userid = walletUser[0].userid
            const transaction = await getRowToTable(`blockchain_log`, `hash='${txhash}'`)
            // const flag = await validationDepositCoin(code, quantity)
            // if (!flag) return error_400(res, `error amount`)
            if (transaction.length > 0) {
                //console.log("coinpayment  hoat dong nhung ton tai txhash ssssssssss")
                let message = `- Sàn: *BEEMARKET*\n- *Tracking coinpayments webhook deposit*\nCó một giao dịch bị trùng txhash lúc deposit\n=>Txhash: ${txhash}`;
                // return error_400(res, message, 2)
                console.log(message);
                return
                //   botTelegram.sendMessage(message);
            }
            let USD = parseFloat(quantity).toFixed(2)
            const user = await getRowToTable(`users`, `id=${userid}`)
            const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${walletSymbol}'`)
            let amountBefore = wallet[0].amount
            let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
            const cusObj = {
                userName: user[0].username,
                email: user[0].email,
                hash: txhash,
                user_id: userid,
                from_id: userid,
                coin_key: code,
                usd_amount: parseFloat(quantity).toFixed(6),
                amount: parseFloat(quantity).toFixed(6),
                category: "receive",
                address: address,
                to_address: address,
                status: 1,
                message: `${code} Deposit`,
                before_amount: amountBefore,
                after_amount: amountAfter,
                created_at: new Date().getTime() / 1000
            }
            ///
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${USD}`, `userid=${userid} AND code='${walletSymbol}'`)
            // await updateRowToTable(`tb_user`, `balance=balance+${USD}`, `id=${userid}`)
            /////
            await addRowToTable(`blockchain_log`, cusObj)
            // const time = getStartWeekAndLastDay()
            // await updateRowToTable(`tb_balance_user`, `deposit=deposit+${parseFloat(quantity).toFixed(6)},afterBalance=afterBalance+${parseFloat(quantity).toFixed(6)}`, `userid=${userid} AND UNIX_TIMESTAMP(created_at)>=${time.start} AND UNIX_TIMESTAMP(created_at)<${time.end}`)
            // const objNotification = {
            //     title: `Recharge successful`,
            //     detail: `You have deposited ${USD} USDT`,
            //     amountDeposit: USD,
            //     userid: userid,
            //     userName: user[0].userName,
            //     email: user[0].email,
            //     type: 6
            // }
            // await addRowToTable(`tb_notification`, objNotification)
            let message = `You have successfully deposited ${USD} USDT`
            try {
                await sendMailMessage(user[0].email, `${process.env.SERVICENAME} | Transfer`, `${user[0].username}`, message)
            } catch (error) {
                console.log(error);
            }
            // await messageTelegram2(`[DEPOSIT] User ${user[0].userName} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)

            // try {
            //     await sendMailDepositCoinpayment(user[0].email, '[SWAPTOBE DEPOSIT] ' + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
            // } catch { }
            console.log("success");
            ////////////////////////// success /////
            const fromAddressBNBQuery = getRowToTable(`tb_config`, `name='addressBNB'`)
            const privateKeyBNBQuery = getRowToTable(`tb_config`, `name='privateKeyBNB'`)
            const addressUSDTQuery = getRowToTable(`tb_config`, `name='addressUSDT'`)
            const [fromAddressBNB, privateKeyBNB, addressUSDT] = await Promise.all([fromAddressBNBQuery, privateKeyBNBQuery, addressUSDTQuery])
            const amount = 0.001
            await transferBNB(fromAddressBNB[0].note, address, amount, decryptPrivateKey(privateKeyBNB[0].note))
            setTimeout(async () => {
                await transferToken(tokenInstance, contractUSDT, address, addressUSDT[0].note, result.returnValues.value.toLocaleString('fullwide', { useGrouping: false }), decryptPrivateKey(walletUser[0].privateKey))
            }, 10000)
        }
    } catch (error) {
        console.log(error, "depsoit");
    }
}
///
async function swapHewe(result, tokenInstance) {
    try {
        let coinSymbol = `HEWE`
        // const walletTest = `0xc6D5c3f58C4319EC54036921D18C9d58E010D873`
        // if (result.returnValues.to == walletTest) console.log(result.returnValues.to);
        const walletUser = await getRowToTable(`tb_wallet_code`, `address='${result.returnValues.to}' AND code='${coinSymbol}'`)
        if (walletUser.length > 0) {
            // console.log(walletUser, "walletUser");
            // console.log(result, "result");
            const data = {
                amount: parseFloat(result.returnValues.value) / 1e18,
                currency: coinSymbol,
                txn_id: result.transactionHash,
                userid: walletUser[0].userid
            }

            // console.log(data);
            if (data.amount < 5) return
            let address = result.returnValues.to
            let quantity = data.amount
            let code = coinSymbol
            let hash = data.txn_id
            let userid = walletUser[0].userid
            const transaction = await getRowToTable(`tb_swap_blockchain`, `hash='${hash}'`)
            // const flag = await validationDepositCoin(code, quantity)
            // if (!flag) return error_400(res, `error amount`)
            if (transaction.length > 0) {
                //console.log("coinpayment  hoat dong nhung ton tai txhash ssssssssss")
                let message = `- Sàn: *BEEMARKET*\n- *Tracking coinpayments webhook deposit*\nCó một giao dịch bị trùng txhash lúc deposit\n=>Txhash: ${hash}`;
                // return error_400(res, message, 2)
                console.log(message);
                return
                //   botTelegram.sendMessage(message);
            }
            let USD = parseFloat(quantity).toFixed(2)
            const user = await getRowToTable(`users`, `id=${userid}`)
            const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${coinSymbol}'`)
            let amountBonusUSDT = 1000
            const priceCoin = await getRowToTable(`tb_coin`, `name='${coinSymbol}'`)
            const price = priceCoin[0].price
            let amountCoinBonus = 0
            let amountCoin = USD / price
            if (user[0].bonusHewe == 1 && USD > amountBonusUSDT) {
                let amountBonusUSDTPercent = amountBonusUSDT / price * 0.02
                amountCoinBonus = amountBonusUSDTPercent /// bonus 2%
                // amountCoin * 0.02 
                await updateRowToTable(`users`, `bonusHewe=0`, `id=${userid}`)

            }
            let amountBefore = wallet[0].amount
            let amountAfter = parseFloat(amountBefore) + parseFloat(amountCoin) + parseFloat(amountCoinBonus)
            let totalCoin = amountCoin + amountCoinBonus
            const cusObj = {
                userName: user[0].username,
                email: user[0].email,
                hash: hash,
                userid: userid,
                symbol: coinSymbol,
                amount: USD,
                addressFrom: result.returnValues.from,
                addressTo: result.returnValues.to,
                message: `${code} Deposit`,
                amountCoinBefore: amountBefore,
                amountCoinAfter: amountAfter,
                // created_at: new Date().getTime() / 1000,
                amountCoin,
                bonus: amountCoinBonus,
                totalCoin

            }
            ///
            // await updateRowToTable(`tb_user`, `balance=balance+${USD}`, `id=${userid}`)
            /////
            const historySwap = await addRowToTable(`tb_swap_blockchain`, cusObj)
            console.log(historySwap, "historySwap");
            await updateRowToTable(`tb_wallet_code`, `amount=amount+${totalCoin}`, `userid=${userid} AND code='${coinSymbol}'`)

            let message = `You have successfully deposited ${totalCoin} ${coinSymbol}`
            try {
                await sendMailMessage(user[0].email, `${process.env.SERVICENAME} | Deposited`, `${user[0].username}`, message)
            } catch (error) {
                console.log(error);
            }
            // await messageTelegram2(`[DEPOSIT] User ${user[0].userName} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)

            // try {
            //     await sendMailDepositCoinpayment(user[0].email, '[SWAPTOBE DEPOSIT] ' + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
            // } catch { }
            console.log("success");
            ////////////////////////// success /////
            const fromAddressBNBQuery = getRowToTable(`tb_config`, `name='addressBNB'`)
            const privateKeyBNBQuery = getRowToTable(`tb_config`, `name='privateKeyBNB'`)
            const addressUSDTQuery = getRowToTable(`tb_config`, `name='addressUSDT'`)
            const [fromAddressBNB, privateKeyBNB, addressUSDT] = await Promise.all([fromAddressBNBQuery, privateKeyBNBQuery, addressUSDTQuery])
            const amount = 0.001
            await transferBNB(fromAddressBNB[0].note, address, amount, decryptPrivateKey(privateKeyBNB[0].note))
            // ///// chuyển tiền coin cho user
            const fromAddressAMCQuery = await getRowToTable(`dk_user`, `name='addressAMC'`)
            const privateKeyAMCQuery = await getRowToTable(`dk_user`, `name='privateKeyAMC'`)
            let stringCoin = totalCoin * 1e18
            await transferAMC(fromAddressAMCQuery[0].note, address, amount, decryptPrivateKey(privateKeyAMCQuery[0].note))
            await transferHewe(fromAddressAMCQuery[0].note, result.returnValues.to, stringCoin.toLocaleString('fullwide', { useGrouping: false }), decryptPrivateKey(privateKeyAMCQuery[0].note))
            // ////
            await updateRowToTable(`tb_config`,`value=value+${totalCoin}`,`name='MIDNIGHTFLAME' OR name='TOTALBURNED'`)
            setTimeout(async () => {
                try {
                    await transferToken(tokenInstance, contractUSDT, address, `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`, result.returnValues.value.toLocaleString('fullwide', { useGrouping: false }), decryptPrivateKey(walletUser[0].privateKey))
                    // //// mở Chuyển Hewe 
                    await axios({
                        url: `http://api.amchain.net:3007/hewe/unrestrict`,
                        method: "POST",
                        data: {
                            user: result.returnValues.to,
                            code: "GgcSnRFiZ8WDXtQ"
                        }
                    })
                    /// 
                    const addressBurn = `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`
                    await transferHewe(wallet[0].address, addressBurn, stringCoin.toLocaleString('fullwide', { useGrouping: false }), decryptPrivateKey(wallet[0].privateKey))
                    await updateRowToTable(`tb_swap_blockchain`, `status=1`, `id=${historySwap.resolve.insertId}`)

                    await axios({
                        url: `http://api.amchain.net:3007/hewe/restrict`,
                        method: "POST",
                        data: {
                            user: result.returnValues.to,
                            code: "GgcSnRFiZ8WDXtQ"
                        }
                    })
                } catch (error) {
                    if (error.response.data.message == 'User is already un-restricted') {
                        const addressBurn = `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`
                        try {

                            await transferHewe(wallet[0].address, addressBurn, stringCoin.toLocaleString('fullwide', { useGrouping: false }), decryptPrivateKey(wallet[0].privateKey))
                            await axios({
                                url: `http://api.amchain.net:3007/hewe/restrict`,
                                method: "POST",
                                data: {
                                    user: result.returnValues.to,
                                    code: "GgcSnRFiZ8WDXtQ"
                                }
                            })
                        } catch (errors) {
                            console.log(errors, "error transfer Hewe Func");
                        }

                    }
                    // console.log(error, 'setTimeOut');

                }
            }, 10000)
        }
    } catch (error) {
        console.log(error, "depsoit");
    }
}
async function swapAmc(result, tokenInstance) {
    try {
        let coinSymbol = `AMC`
        // const walletTest = `0xc6D5c3f58C4319EC54036921D18C9d58E010D873`
        // if (result.returnValues.to == walletTest) console.log(result.returnValues.to);
        const walletUser = await getRowToTable(`tb_wallet_code`, `address='${result.returnValues.to}' AND code='${coinSymbol}'`)
        if (walletUser.length > 0) {
            // console.log(walletUser, "walletUser");
            // console.log(result, "result");
            const data = {
                amount: parseFloat(result.returnValues.value) / 1e18,
                currency: coinSymbol,
                txn_id: result.transactionHash,
                userid: walletUser[0].userid
            }

            // console.log(data);
            // if (data.amount < 5) return
            let address = result.returnValues.to
            let quantity = data.amount
            let code = coinSymbol
            let hash = data.txn_id
            let userid = walletUser[0].userid
            const transaction = await getRowToTable(`tb_swap_blockchain`, `hash='${hash}'`)
            // const flag = await validationDepositCoin(code, quantity)
            // if (!flag) return error_400(res, `error amount`)
            if (transaction.length > 0) {
                //console.log("coinpayment  hoat dong nhung ton tai txhash ssssssssss")
                let message = `- Sàn: *BEEMARKET*\n- *Tracking coinpayments webhook deposit*\nCó một giao dịch bị trùng txhash lúc deposit\n=>Txhash: ${hash}`;
                // return error_400(res, message, 2)
                console.log(message);
                return
                //   botTelegram.sendMessage(message);
            }
            let USD = parseFloat(quantity).toFixed(2)
            const user = await getRowToTable(`users`, `id=${userid}`)
            const wallet = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${coinSymbol}'`)
            let amountBonusUSDT = 1000
            const priceCoin = await getRowToTable(`tb_coin`, `name='${coinSymbol}'`)
            const price = priceCoin[0].price
            let amountCoinBonus = 0
            let amountCoin = USD / price
            if (user[0].bonusAmc == 1 && USD > amountBonusUSDT) {
                let amountBonusUSDTPercent = amountBonusUSDT / price * 0.02
                amountCoinBonus = amountBonusUSDTPercent /// bonus 2%
                await updateRowToTable(`users`, `bonusAmc=0`, `id=${userid}`)
            }
            let amountBefore = wallet[0].amount
            let amountAfter = parseFloat(amountBefore) + parseFloat(amountCoin) + parseFloat(amountCoinBonus)
            let totalCoin = amountCoin + amountCoinBonus
            const cusObj = {
                userName: user[0].username,
                email: user[0].email,
                hash: hash,
                userid: userid,
                symbol: coinSymbol,
                amount: USD,
                addressFrom: result.returnValues.from,
                addressTo: result.returnValues.to,
                message: `${code} Deposit`,
                amountCoinBefore: amountBefore,
                amountCoinAfter: amountAfter,
                // created_at: new Date().getTime() / 1000,
                amountCoin,
                bonus: amountCoinBonus,
                totalCoin

            }
            ///
            // await updateRowToTable(`tb_user`, `balance=balance+${USD}`, `id=${userid}`)
            /////
            const historySwap = await addRowToTable(`tb_swap_blockchain`, cusObj)
            console.log(historySwap, "historySwap");

            let message = `You have successfully deposited ${totalCoin} ${coinSymbol}`
            try {
                await sendMailMessage(user[0].email, `${process.env.SERVICENAME} | Deposited`, `${user[0].username}`, message)
            } catch (error) {
                console.log(error);
            }
            // await messageTelegram2(`[DEPOSIT] User ${user[0].userName} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)

            // try {
            //     await sendMailDepositCoinpayment(user[0].email, '[SWAPTOBE DEPOSIT] ' + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
            // } catch { }
            console.log("success");
            ////////////////////////// success /////
            const fromAddressBNBQuery = getRowToTable(`tb_config`, `name='addressBNB'`)
            const privateKeyBNBQuery = getRowToTable(`tb_config`, `name='privateKeyBNB'`)
            const addressUSDTQuery = getRowToTable(`tb_config`, `name='addressUSDT'`)
            const [fromAddressBNB, privateKeyBNB, addressUSDT] = await Promise.all([fromAddressBNBQuery, privateKeyBNBQuery, addressUSDTQuery])
            const amount = 0.001
            await transferBNB(fromAddressBNB[0].note, address, amount, decryptPrivateKey(privateKeyBNB[0].note))
            ///// chuyển tiền coin cho user
            const fromAddressAMCQuery = await getRowToTable(`dk_user`, `name='addressAMC'`)
            const privateKeyAMCQuery = await getRowToTable(`dk_user`, `name='privateKeyAMC'`)

            await transferAMC(fromAddressAMCQuery[0].note, address, amount + totalCoin, decryptPrivateKey(privateKeyAMCQuery[0].note))

            setTimeout(async () => {
                try {
                    await transferToken(tokenInstance, contractUSDT, address, `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`, result.returnValues.value.toLocaleString('fullwide', { useGrouping: false }), decryptPrivateKey(walletUser[0].privateKey))
                    //// mở Chuyển Hewe 

                    // /// 
                    await transferAMC(wallet[0].address, `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`, totalCoin , decryptPrivateKey(wallet[0].privateKey))
                    await updateRowToTable(`tb_wallet_code`, `amount=amount+${totalCoin}`, `userid=${userid} AND code='${coinSymbol}'`)
                    await updateRowToTable(`tb_swap_blockchain`, `status=1`, `id=${historySwap.resolve.insertId}`)
                } catch (error) {
                    console.log(error, 'setTimeOut');
                }
            }, 10000)
        }
    } catch (error) {
        console.log(error, "depsoit");
    }
}
///
async function transferBNB(fromAddress, toAddress, transferAmount, my_privkey) {
    try {
        console.log(
            `Attempting to make transaction from ${fromAddress} to ${toAddress}`
        );

        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                from: fromAddress,
                to: toAddress,
                value: web3.utils.toWei(`${transferAmount}`, 'ether'),
                gas: '54154',
            },
            my_privkey
        );

        // Deploy transaction
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
        console.log(
            `Transaction successful with hash: ${createReceipt.transactionHash}`
        );
    } catch (error) {
        console.log(error, "transferBNB")
    }
}
async function transferToken(contract, contractAddress, myAddress, destAddress, transferAmount, my_privkey) {
    try {
        console.log(my_privkey,"my_privkey");
        
        var count = await web3.eth.getTransactionCount(myAddress);
        var rawTransaction = {
            "from": myAddress,
            "nonce": "0x" + count.toString(16),
            "gasPrice": web3.utils.toHex(1300000000),
            "gasLimit": web3.utils.toHex(210000),
            "to": contractAddress,
            "value": "0x0",
            "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
            "chainId": 56
        };
        var privKey = Buffer.from(my_privkey, 'hex');
        var Common = require('ethereumjs-common').default;
        var BSC_FORK = Common.forCustomChain(
            'mainnet',
            {
                name: 'Binance Smart Chain Mainnet',
                networkId: 56,
                chainId: 56,
                url: RPC
            },
            'istanbul',
        );
        var tx = new Tx(rawTransaction, { 'common': BSC_FORK });

        tx.sign(privKey);
        var serializedTx = tx.serialize();
        console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}`);
        var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
        const balance = await contract.methods.balanceOf(myAddress).call();
        console.log(`Balance after send: ${balance}`);
        return JSON.stringify(receipt, null, '\t')
    } catch (error) {
        console.log(error, "transferToken");
    }

}
module.exports = {
    depositCoinUSDTBEP20,
    transferToken,
    contractUSDT,
    swapHewe,
    swapAmc
}