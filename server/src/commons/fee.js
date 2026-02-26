const { getRowToTable } = require("../query/funcQuery");

async function feeTransfer(useridTransfer, useridReceive) {
    try {
        let percent = 0.002
        const userReceive = await getRowToTable(`users`, `id=${useridReceive}`)
        const userTransfer = await getRowToTable(`users`, `id=${useridTransfer}`)
        if (userReceive[0].parentUserIdWallet == userTransfer[0].parentUserIdWallet) {
            percent = 0.001
        }
        return percent
    } catch (error) {
        console.log(error, "feeTransfer");
    }
}
module.exports = {
    feeTransfer
}