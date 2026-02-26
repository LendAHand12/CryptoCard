require('dotenv').config()
const Web3 = require('web3')
const { depositCoinUSDTBEP20, swapHewe, swapAmc } = require('./addDataBlockchain')
const RpcBSCMainnet = `https://indulgent-convincing-crater.bsc.quiknode.pro/2aa91caa6c5f1db27fbe1d6b679ec3260220944c/`
const RpcBSCTestNet = `https://bsc-testnet-rpc.publicnode.com/`
const networkIdBSC = 56
const networkIdBSCTestnet = 97
const RPC = RpcBSCMainnet ////swap rpc
const networkId = networkIdBSC //// swap Network

const web3 = new Web3(RPC)
const web3Http = new Web3(RPC)

const MyToken = require('./contract/MyTokenUSDT.json')
var lastBlock = process.env.LAST_BLOCK
const tokenInstance = new web3.eth.Contract(MyToken.abi, MyToken.networks[networkId].address)

const fs = require('fs')
const { default: axios } = require('axios')
const { getRowToTable, updateRowToTable } = require('../query/funcQuery')
async function getEventContract() {
    const config = await getRowToTable(`tb_block`, `network='BSC'`)
    var lastBlock = config[0].block
    const ranger = 10
    var toBlock = await web3Http.eth.getBlockNumber() * 1
    // console.log(toBlock, ".....");
    if (toBlock - lastBlock > ranger) {
        toBlock = lastBlock * 1 + ranger
    }
    console.log("toBlock BSC", toBlock)
    console.log("lastBlock", lastBlock)
    const arrayPromise = []

    tokenInstance.getPastEvents(`Transfer`, { fromBlock: lastBlock, toBlock: toBlock }
        , (err, result) => {
            if (err) {
                console.log(err);
                return
            }
            if (result) {
                for (item of result) {
                    arrayPromise.push(depositCoinUSDTBEP20(item, `USDT.BEP20`, `USDT`, tokenInstance))
                    arrayPromise.push(swapHewe(item, tokenInstance))
                    arrayPromise.push(swapAmc(item, tokenInstance))


                    
                }
            }
        })
    await Promise.all(arrayPromise)
    lastBlock = toBlock + 1
    await saveConfig(toBlock + 1)
}
var updateAttributeEnv = function (envPath, attrName, newVal) {
    var dataArray = fs.readFileSync(envPath, 'utf8').split('\n');

    var replacedArray = dataArray.map((line) => {
        if (line.split('=')[0] == attrName) {
            return attrName + "=" + String(newVal);
        } else {
            return line;
        }
    })

    fs.writeFileSync(envPath, "");
    for (let i = 0; i < replacedArray.length - 1; i++) {
        // let flag = i!=replacedArray.length?`\n`:""
        fs.appendFileSync(envPath, replacedArray[i] + `\n`);
    }
}
async function saveConfig(blockNew) {
    // updateAttributeEnv(`.env`, `LAST_BLOCK`, lastBlock)
    await updateRowToTable(`tb_block`, `block=${blockNew}`, `network='BSC'`)
    // console.log("save",lastBlock)
}

module.exports = {
    getEventContract,
    tokenInstance

}