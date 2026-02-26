const Web3 = require('web3');
const RpcBSCMainnet = `https://smart-capable-pallet.bsc.discover.quiknode.pro/59f691dace13174c585574cca37f22f74a6570ad/`
const RpcBSCTestNet = `https://bsc-testnet-rpc.publicnode.com/`
const networkIdBSC = 56
const RpcAMC = `https://node1.amchain.net/`
const networkIdBSCTestnet = 97
const RPC = RpcBSCTestNet ////swap rpc
const networkId = networkIdBSCTestnet //// swap Network
const netWorkAMC = `999999`
const web3 = new Web3(RpcAMC)

function test() {
    let options = {
        address: '0x550D95e606D198C464EA9EB6496d9524D137A0dD'
    }

    const subscribe = web3.eth.subscribe('logs', options, (err, res) => { })

    subscribe.on('data', (txLog) => console.log(txLog))
}
module.exports = { test }