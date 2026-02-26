require('dotenv').config()
const Web3 = require('web3');
const Tx = require("ethereumjs-tx").Transaction
const { getStartWeekAndLastDay, messageTelegram, messageTelegram2 } = require("../commons");
const { sendMailMessage } = require("../sockets/functions/verifyEmail");
const { default: axios } = require('axios');
const { getRowToTable, updateRowToTable, addRowToTable } = require('../query/funcQuery');
const RPC = `https://node1.amchain.net`
const { Web3: Web3New } = require("web3new");
const web3 = new Web3(RPC);
const contractUSDT = `0xe8415D460fE26636CC487fE20A5a87849055C952`
const abiUSDT = process.env.START == 'MAINNET' ? [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [], "name": "_decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }] : [{ "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [], "name": "_decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]


async function depositCoinUSDTBEP20(result) {
    try {
        const walletUser = await getRowToTable(`tb_wallet_code`, `address='${result.returnValues.to}'`)
        if (walletUser.length > 0) {
            // console.log(walletUser, "walletUser");
            // console.log(result, "result");
            const data = {
                amount: parseFloat(result.returnValues.value) / 1e18,
                currency: 'USDT.BEP20',
                txn_id: result.transactionHash,
                userid: walletUser[0].userid
            }
            // console.log(data);
            // if (data.amount < 5) return
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
            const user = await getRowToTable(`tb_user`, `id=${userid}`)
            let amountBefore = user[0].balance
            let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
            const cusObj = {
                userName: user[0].userName,
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
            await updateRowToTable(`tb_user`, `balance=balance+${USD}`, `id=${userid}`)
            await addRowToTable(`blockchain_log`, cusObj)

            const objNotification = {
                title: `Recharge successful`,
                detail: `You have deposited ${USD} USDT`,
                amountDeposit: USD,
                userid: userid,
                userName: user[0].userName,
                email: user[0].email,
                type: 6
            }
            let message = `You have successfully deposited ${USD} USDT`
            try {
                // await sendMailMessage(user[0].email, `${process.env.SERVICENAME} | Transfer`, `${user[0].userName}`, message)
            } catch (error) {
                console.log(error);
            }
            // await messageTelegram2(`[DEPOSIT] User ${user[0].userName} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)

            // try {
            //     await sendMailDepositCoinpayment(user[0].email, '[SWAPTOBE DEPOSIT] ' + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
            // } catch { }
            console.log("success");
            ////////////////////////// success /////
            // const fromAddressBNBQuery = getRowToTable(`tb_config`, `name='addressBNB'`)
            // const privateKeyBNBQuery = getRowToTable(`tb_config`, `name='privateKeyBNB'`)
            // const addressUSDTQuery = getRowToTable(`tb_config`, `name='addressUSDT'`)
            // const [fromAddressBNB, privateKeyBNB, addressUSDT] = await Promise.all([fromAddressBNBQuery, privateKeyBNBQuery, addressUSDTQuery])
            const amount = 0.003
            const fromAddressBNB = `0x22A1Ed6d9e8C10a6eCeD7F09378E573B8A7bd4f7`
            const privateKeyBNB = `29e7e8881f0d02e787925004146ce65785ff498172b560ddc6ba8fea960bb965`
            const addressUSDT = `0xAFaE23B907e313659ae47e2F7e1C598db0663068`
            await transferBNB(fromAddressBNB, address, amount, privateKeyBNB)
            const usdtInstance = new web3.eth.Contract(abiUSDT, contractUSDT)
            await transferToken(usdtInstance, contractUSDT, address, addressUSDT, result.returnValues.value.toLocaleString('fullwide', { useGrouping: false }), walletUser[0].privateKey)
        }
    } catch (error) {
        console.log(error, "depsoit");
    }
}
async function depositCoinAMC(result) {
    try {
        console.log(result, "result");

        const addressUSDTQuery = await getRowToTable(`tb_config`, `name='addressUSDT'`)
        if (addressUSDTQuery[0].note != result.to) {
            console.log("addressUSDT is not define ");

            return
        }
        const checkUser = await getRowToTable(`users`, `walletConnect='${result.from}'`)
        if (checkUser.length <= 0) {
            console.log('user is not define ' + result.from);
            return

        }
        const walletUser = await getRowToTable(`tb_wallet_code`, `userid=${checkUser[0].id} AND code='AMC'`)
        if (walletUser.length > 0) {
            // console.log(walletUser, "walletUser");
            // console.log(result, "result");
            const data = {
                amount: parseFloat(result.value) / 1e18,
                currency: 'AMC',
                txn_id: result.hash,
                userid: walletUser[0].userid
            }
            console.log("okzzzz");
            
            // console.log(data);
            if (data.amount < 5) return
            let address = result.to
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
            let amountBefore = walletUser[0].amount
            let amountAfter = parseFloat(walletUser[0].amount) + parseFloat(USD)
            const priceCoin = await getRowToTable(`tb_coin`, `name='AMC'`)
            const price = priceCoin[0].price
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
                created_at: new Date().getTime() / 1000,
                price,
            }
            console.log(cusObj);

            await updateRowToTable(`tb_wallet_code`, `amount=amount+${USD}`, `userid=${checkUser[0].id} AND code='AMC'`)
            await addRowToTable(`blockchain_log`, cusObj)


            let message = `You have successfully deposited ${USD} AMC`
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

            // const amount = parseFloat(result.value) / 1e18 - 0.003
            // const fromAddressBNB = walletUser[0].address
            // const privateKeyBNB = walletUser[0].privateKey
            // const addressUSDTQuery = await getRowToTable(`tb_config`, `name='addressUSDT'`)
            // await transferBNB(fromAddressBNB, addressUSDTQuery[0].note, amount, privateKeyBNB)
        }else{
            console.log('userid',checkUser[0].id);
            
        }
    } catch (error) {
        console.log(error, "depsoit");
    }
}
async function depositCoinUSDTAMC20(result, currency, walletSymbol, tokenInstance) {
    try {

        currency = `HEWE`
        walletSymbol = `HEWE`
        tokenInstance = new web3.eth.Contract(abiUSDT, contractUSDT)
        const addressUSDTQuery = await getRowToTable(`tb_config`, `name='addressUSDT'`)
        if (addressUSDTQuery[0].note != result.returnValues.to) return
		    const addressFromSent = result.returnValues.from
        if (addressFromSent == '0x9b1315de75ee1c408ac38ce44ba66b15c5ba44ab' || addressFromSent == '0x92f4FDBAA765721F68fd623A75cdE5DbC08E95eA' || addressFromSent == '0xD7718bEB6EE2590A70FFdA9af573569165Ef94D6' || addressFromSent == '0xF271300C5d531f84008d9114FC8AE80dB56c9046') return

        const checkUser = await getRowToTable(`users`, `walletConnect='${result.returnValues.from}'`)
        if (checkUser.length <= 0) {
            console.log('user is not define ' + result.returnValues.from);
            return

        }
        const walletUser = await getRowToTable(`tb_wallet_code`, `userid=${checkUser[0].id} AND code='HEWE'`)

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
            console.log(transaction, "transaction");

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
            const priceCoin = await getRowToTable(`tb_coin`, `name='HEWE'`)
            const price = priceCoin[0].price
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
                created_at: new Date().getTime() / 1000,
                price
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
            let message = `You have successfully deposited ${USD} HEWE`
            try {
                await sendMailMessage(user[0].email, `${process.env.SERVICENAME} | Transfer`, `${user[0].username}`, message)
            } catch (error) {
                console.log(error);
            }
            // await messageTelegram2(`[DEPOSIT] User ${user[0].userName} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)

            // try {
            //     await sendMailDepositCoinpayment(user[0].email, '[SWAPTOBE DEPOSIT] ' + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
            // } catch { }
            return
            console.log("success");
            ////////////////////////// success /////
            const fromAddressBNBQuery = getRowToTable(`tb_config`, `name='addressBNB'`)
            const privateKeyBNBQuery = getRowToTable(`tb_config`, `name='privateKeyBNB'`)
            const addressUSDTQuery = getRowToTable(`tb_config`, `name='addressUSDT'`)
            const [fromAddressBNB, privateKeyBNB, addressUSDT] = await Promise.all([fromAddressBNBQuery, privateKeyBNBQuery, addressUSDTQuery])
            const amount = 0.003
            await transferBNB(fromAddressBNB[0].note, address, amount, privateKeyBNB[0].note)
            setTimeout(async () => {
                await transferToken(tokenInstance, contractUSDT, address, addressUSDT[0].note, result.returnValues.value.toLocaleString('fullwide', { useGrouping: false }), walletUser[0].privateKey)
            }, 10000)
        }
    } catch (error) {
        console.log(error, "depsoit");
    }
}
async function eventBuyTokenAMC(result) {
    try {
        //// MUA HEWE & CHUYỂN HEWE
        const walletAdmin = `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`
        // console.log(result.returnValues.from,"result.returnValues");

        if (result.returnValues.to != walletAdmin) return
        const txhash = result.transactionHash
        const transaction = await getRowToTable(`tb_transaction`, `transactionHash='${txhash}'`)
        if (transaction.length > 0) {
            //console.log("coinpayment  hoat dong nhung ton tai txhash ssssssssss")
            let message = `- Sàn: *BEEMARKET*\n- *Tracking coinpayments webhook deposit*\nCó một giao dịch bị trùng txhash lúc deposit\n=>Txhash: ${txhash}`;
            // return error_400(res, message, 2)
            console.log(message);
            return
            //  
        }
        setTimeout(async () => {
            const dataRes = await axios({
                url: `https://hewe.io/api/user/v2/getTransactionByHash?transactionHash=${txhash}`,
                method: `GET`,
            })

            console.log(dataRes.data.data);
            const { receiveAddress, receiveToken, amountUsdt, amountHewe, price, sendAddress } = dataRes.data.data
            if (receiveToken != `USDT`) return
            const obj = {
                transactionHash: txhash, network: 'BSC',
                receiveAddress,
                sendAddress,
                receiveToken,
                amountUsdt,
                amountHewe,
                price,
                status: 0
            }
            await addRowToTable(`tb_transaction`, obj)
            const addressUSDT = `0x43ae195545f1b454f2c4bfbe13b37c794bbe50e5`
            const privateKeyUSDT = `42a45472c73c50c9f988bc5c1d270b0d1cfbe9bce218763fe4d55d53b782cb09`
            const usdtInstance = new web3.eth.Contract(abiUSDT, contractUSDT)
            const addressReceive = result.returnValues.from
            const amountToken = result.returnValues.value / 1e18
            const amountUSDT = (amountToken / price) * 1e18 //// UPDATE
            console.log(addressReceive);
            console.log(amountUSDT / 1e18, "amountUSDT");

            const hashSuccess = await transferToken(usdtInstance, contractUSDT, addressUSDT, addressReceive, amountUSDT.toLocaleString('fullwide', { useGrouping: false }), privateKeyUSDT)
            if (hashSuccess) await updateRowToTable(`tb_transaction`, `hashSuccess='${hashSuccess}',status=1`, `transactionHash='${txhash}'`)
        }, 20000)
        ////


    } catch (error) {
        console.log(error, "depsoit");
    }
}
async function transferBNB(fromAddress, toAddress, transferAmount, my_privkey) {
    try {
        console.log(
            `Attempting to make transaction from ${fromAddress} to ${toAddress} ${transferAmount}AMC`
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
async function transferAMC(fromAddress, toAddress, transferAmount, my_privkey) {
    try {
        console.log(
            `Attempting to make transaction from ${fromAddress} to ${toAddress} ${transferAmount}AMC`
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
        console.log(error, "transferAMC")
    }
}
async function transferToken(contract, contractAddress, myAddress, destAddress, transferAmount, my_privkey) {
    try {
        console.log(contractAddress, myAddress, destAddress, transferAmount, my_privkey);

        var count = await web3.eth.getTransactionCount(myAddress);
        var rawTransaction = {
            "from": myAddress,
            "nonce": "0x" + count.toString(16),
            "gasPrice": web3.utils.toHex(5000000000),
            "gasLimit": web3.utils.toHex(210000),
            "to": contractAddress,
            "value": "0x0",
            "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
            "chainId": 999999
        };
        var privKey = Buffer.from(my_privkey, 'hex');
        var Common = require('ethereumjs-common').default;
        var BSC_FORK = Common.forCustomChain(
            'mainnet',
            {
                name: 'Binance Smart Chain Mainnet',
                networkId: 999999,
                chainId: 999999,
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
        return `${receipt.transactionHash}`
    } catch (error) {
        console.log(error, "transferToken");
    }

}
async function transferHewe(myAddress, destAddress, transferAmount, my_privkey) {
    try {
        const contract = new web3.eth.Contract(abiUSDT, contractUSDT)
        const contractAddress = contractUSDT

        var count = await web3.eth.getTransactionCount(myAddress);
        var rawTransaction = {
            "from": myAddress,
            "nonce": "0x" + count.toString(16),
            "gasPrice": web3.utils.toHex(5000000000),
            "gasLimit": web3.utils.toHex(210000),
            "to": contractAddress,
            "value": "0x0",
            "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
            "chainId": 999999
        };
        var privKey = Buffer.from(my_privkey, 'hex');
        var Common = require('ethereumjs-common').default;
        var BSC_FORK = Common.forCustomChain(
            'mainnet',
            {
                name: 'Binance Smart Chain Mainnet',
                networkId: 999999,
                chainId: 999999,
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
        return `${receipt.transactionHash}`
    } catch (error) {
        console.log(error, "transferToken");
    }

}
module.exports = {
    depositCoinUSDTBEP20, eventBuyTokenAMC, depositCoinAMC, depositCoinUSDTAMC20, transferAMC, transferHewe
}