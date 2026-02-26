const {
    createWallet
} = require('../lib/coinpayment');
const { getRowToTable, addRowToTable } = require('../query/funcQuery');
const customerQuery = require("../sockets/queries/customerQuery")

async function createWalletPayment(userid, symbol) {
    const wallet = await customerQuery.getWalletToIdUser(userid, symbol)
    if (wallet.length > 0) {
        return
    } else {
        if(symbol=='USDT.BEP20') {

        }else{
            const resWallet = await createWallet(symbol)
            const user = await customerQuery.getUserToId(userid)
            const walletRaws = await customerQuery.getWalletToAddress(`address`, resWallet.address)
            if (walletRaws.length <= 0) {
                await customerQuery.addWalletCode(userid, user[0].username, resWallet.address, symbol, `${resWallet.dest_tag ? resWallet.dest_tag : null}`)
            }
            resWallet.label = resWallet.dest_tag
        }

    }
}
async function createWalletAndCheckWallet(userid, symbol) {
    const wallet = await customerQuery.getWalletToIdUser(userid, symbol)
    if (wallet.length > 0) {
        return
    } else {
        const user = await customerQuery.getUserToId(userid)
        await addRowToTable(`tb_wallet_code`,{
            userid, 
            code : symbol,
            amount : 0,
            username: user[0].username
        })
        // if(symbol=='USDT.BEP20') {

        // }else{
        //     const resWallet = await createWallet(symbol)
        //     const user = await customerQuery.getUserToId(userid)
        //     const walletRaws = await customerQuery.getWalletToAddress(`address`, resWallet.address)
        //     if (walletRaws.length <= 0) {
        //         await customerQuery.addWalletCode(userid, user[0].username, resWallet.address, symbol, `${resWallet.dest_tag ? resWallet.dest_tag : null}`)
        //     }
        //     resWallet.label = resWallet.dest_tag
        // }

    }
}
// async function createTwoWallet (userid , symbolForm,symbolTo) {
//     try {
//         const array = []
//         await Promise.all([createWalletPayment(userid)])
//     } catch (error) {
//         console.log(error,'createTwoWallet');
//     }
// }
module.exports = {
    createWalletPayment,
    createWalletAndCheckWallet
}