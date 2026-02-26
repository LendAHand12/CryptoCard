const Web3 = require('web3');
const customerQuery = require('../sockets/queries/customerQuery');
const { encryptPrivateKey } = require('../commons');
const { getRowToTable, updateRowToTable } = require('../query/funcQuery');
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
module.exports = {
    createWalletBEP20: async (userid, symbol) => {
        try {
            const checkWalletIs = await getRowToTable(`tb_wallet_code`, `userid=${userid} AND code='${symbol}' AND address is null`)
            if (checkWalletIs.length > 0) {
                const data = web3.eth.accounts.create();
                await updateRowToTable(`tb_wallet_code`, `address='${data.address}',privateKey='${encryptPrivateKey(data.privateKey.slice(2, data.privateKey.length))}'`, `id=${checkWalletIs[0].id}`)
                return { flag: true, address: data.address }
            }

            const wallet = await customerQuery.getWalletToIdUser(userid, `${symbol}`)
            if (wallet.length > 0) return { flag: false, address: wallet[0].address }
            const user = await customerQuery.getUserToId(userid)
            const data = web3.eth.accounts.create();
            console.log("ok",data.privateKey);
            console.log("ok",encryptPrivateKey(data.privateKey.slice(2, data.privateKey.length)));
            
            await customerQuery.addWalletCodeBEP20(userid, user[0].username, data.address, `${symbol}`, encryptPrivateKey(data.privateKey.slice(2, data.privateKey.length)))
            return { flag: true, address: data.address }
        } catch (error) {
            console.log(error);
        }
    }
}