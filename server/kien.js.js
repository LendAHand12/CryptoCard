const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://127.0.0.1:8090");
const solidityNode = new HttpProvider("https://127.0.0.1:8090");
const eventServer = new HttpProvider("https://127.0.0.1:8090");
const privateKey = "private key user";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
let contract = await tronWeb.contract().at(trc20ContractAddress);
let result = await contract.transfer(
    "/// địa chỉ ví tổng", //address _to
    `${amoutTranfer}`   //amount
).send({
    feeLimit: 1000000
}).then(output => { console.log('- Output:', output, '\n'); });
console.log('result: ', result);