var router = express.Router()
var fs = require('fs');
//SERVICES
const opts = {
    errorEventName: 'error',
    logDirectory: '../log/deposit',
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};

var log = require('simple-node-logger').createRollingFileLogger(opts);
var walletcode = require('../.././services/wallet_code.js')
var deposit_confirm = require('../.././services/deposit_confirm')
var deposit = require('../.././services/deposit')
var user = require('../.././services/user')
const dbTrackingBalance = require('../../services/tracking_balance')
const coinpayment = require('../../lib/coinpayment.js')
var botTelegram = require('../.././lib/devteamHelper')
const binance = require('node-binance-api')().options({
    APIKEY: '<key>',
    APISECRET: '<secret>',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
});

function responseAPI(status, message, data) {
    var result = {
        status: status,
        message: message,
        data: data
    };
    return result;
}
router.post('/deposit', (req, res) => {
    const data = req.body
    const hmac = req.headers.hmac
    log.info("Headers hmac: ", hmac)
    const status_response = +data.status
    if (status_response >= 100) {
        coinpayment.verifyDeposit(hmac, data, isVerify => {
            console.log("coinpayment  hoat dong xxxxxxxxxxxxxx")
            if (isVerify) {
                var address = data.address;
                walletcode.findUserByWallet(address, function(walletRaws) {
                    console.log(walletRaws)
                    if (walletRaws.length > 0) {

                        let quantity = data.amount
                        let code = data.currency
                        let txhash = data.txn_id
                        let symbol = code + "USDT";
                        let userid = walletRaws[0].userid
                        let date_time = moment().format("YYYY-MM-DD")

                        deposit.checkTransaction(txhash, isExist => {
                            if (isExist) {
                                console.log("coinpayment  hoat dong nhung ton tai txhash ssssssssss")
                                var message = `- Sàn: *BEEMARKET*\n- *Tracking coinpayments webhook deposit*\nCó một giao dịch bị trùng txhash lúc deposit\n=>Txhash: ${txhash}`;
                                botTelegram.sendMessage(message);
                            }
                            else
                            {
                                if (code == 'USDT.ERC20') {
                                    let USD = parseFloat(quantity).toFixed(2) * parseFloat(0.985)
                                    USD = parseFloat(USD).toFixed(2)
                                    console.log('quantity:' + quantity + "parseFloat quantity 2: " + parseFloat(quantity).toFixed(2) + " - " + "USD parseFloat 2:" + USD)
                                   
                                    insertDeposit(userid, date_time, code, quantity, USD, txhash, res);
                                } else { //chi cho phep deposit usdt erc20
                                    console.log('khac usdt khong cong live, ma txhash: ' + txhash)
                                    binance.prices(symbol, (error, ticker) => {
                                        console.log(error)
                                        var USD = quantity * ticker[symbol] * 0.97
                                        console.log('khac usdt')
                                       // insertDeposit(userid, date_time, code, quantity, USD, txhash, res);
                                    })
                                }
                            }
                        })

                       
                    } else {
                        var result = responseAPI(false, "Cannot find wallet " + address, null)
                        res.send(result)
                        console.log("Cannot find wallet", address)
                    }
                })
            } else {
                console.log(moment().format("YYYY-MM-DD HH:mm:ss") + " - BEEMARKET - Coinpayments send deposit IsValid")
            }
        })
    }
})

function insertDeposit(userid, date_time, code, quantity, USD, txhash, res) {
    deposit_confirm.depositSuccess(userid, date_time, code, quantity, USD, txhash, function(resultDeposit) {
        if (resultDeposit) {
            console.log("insertDeposit xxxxxxxxxxxxxx")
                //Tracking balance
            dbTrackingBalance.trackingBalance(userid, USD, `Nạp ${quantity} ${code}`, 'DEPOSIT');
            user.getUserByID(userid, (name) => {
                if (name) {
                    console.log("getUserByID  xxxxxxxxxxxxxx")
                    // var message = '- Sàn: *BEEMARKET*\n- Người nộp: *' + name.username + '*\n- Số tiền nạp: *' + quantity + ' (' + code + ')*\n=> *' + USD + '* USD\n- txHash: ' + txhash;
                    // botTelegram.sendMessage(message);
                }
            });
            var result = responseAPI(true, null, null);
            res.send(result);
        } else {
            var result = responseAPI(false, "Transaction Fail", null);
            res.send(result);
        }
    });
}
module.exports = router




