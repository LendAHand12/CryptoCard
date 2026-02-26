// const TronWeb = require('tronweb');
const customerQuery = require('../sockets/queries/customerQuery');
// const apiTron = `https://api.trongrid.io`
// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider(apiTron);
// const solidityNode = new HttpProvider(apiTron);
// const eventServer = new HttpProvider(apiTron);
// const privateKey = "d60f68ae5fe9800848b499abc96761bdce1f2cb84f66361c8b6ebce9bdf2c994";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
module.exports = {
    createTrc20Wallet: async (idUser, symbol) => {
        if (idUser) {
            if (symbol == "STF") {
                symbol = "STF_TRC20";
            }
            const wallet = await customerQuery.getWalletToIdUser(idUser, `${symbol}`)
            if (wallet.length > 0) {
                    return {flag: true,address: wallet[0].address}
            } else {
                const data = await tronWeb.createAccount()
                const user = await customerQuery.getUserToId(idUser)
                await customerQuery.addWalletCodeTRC20(idUser, user[0].username, data.address.base58, `${symbol}`, data.privateKey, data.publicKey, data.address.hex)
                    return {flag: true,address: data.address}
            }
            
        }
    },
}