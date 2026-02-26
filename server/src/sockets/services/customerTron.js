// const TronWeb = require('tronweb');
const qrcode = require('qrcode')
const otplib = require('otplib')
const { authenticator } = otplib
const validateToken = require('../functions/validation')
const serviceName = "BlockChain-Farm"
// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider("https://api.trongrid.io");
// const solidityNode = new HttpProvider("https://api.trongrid.io");
// const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "2e485b5e6621b4f60c081e7202fa2fcf9e1a2fedf8ee46ffa99a35e97cdf9365";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const CryptoUtils = require("@tronscan/client/src/utils/crypto");
const TransactionUtils = require("@tronscan/client/src/utils/transactionBuilder");
const customerQuery = require('../queries/customerQuery');
const tokenBLF = "TLk4SnKJ2svN3a3qi48ALy2cDMhQAgkQte"
const axios = require('axios')
module.exports = {
    
    transferUser: async (params, socketIo, io) => {
        const { tokena, address, code2Fa, amout } = params
        const phone = validateToken.tokenUser(tokena)
        // arrayUser
        if (phone) {
            const twofa = await customerQuery.getTwoFA(phone)
            if (twofa[0].twofa == 1) {
                const secret = twofa[0].secret
              //console.log(secret);
                var token = code2Fa
                let a = authenticator.verify({ token, secret })
                if (a) {
                    const trc20ContractAddress = "TLk4SnKJ2svN3a3qi48ALy2cDMhQAgkQte";
                    const privateKeyUser = await customerQuery.getPrivateKey(phone);
                    const tronWebUser = new TronWeb(fullNode, solidityNode, eventServer, privateKeyUser[0].privateKey);
                    const addressUser = await tronWeb.address.fromPrivateKey(privateKeyUser[0].privateKey)
                    const trxWallet = await tronWeb.trx.getBalance(addressUser)
                    let contract = await tronWebUser.contract().at(trc20ContractAddress);
                    let coinBLF = await contract.balanceOf(addressUser).call();
                    // console.log(parseInt(coinBLF._hex) / 1e18, "aaa");
                    if (parseInt(coinBLF._hex) >= amout) {
                        // console.log("ok", trxWallet / 1e6);
                        if (trxWallet < 10) {
                            let data = {
                                status: true,
                                data: amout
                            }
                            io.to(address).emit('money', data);
                         
                            let amoutTranfer = amout * 1e18 
                            let result = await contract.transfer(
                                address, //address _to
                                `${amoutTranfer}`,
                            ).send({
                                feeLimit: 1 * 1e9
                            }).then(output => {
                              //console.log('- Output:', output, '\n');
                                return {
                                    message: "Chuyển tiền thành công !",
                                    status: true,
                                    data: {
                                        amoutTranfer,
                                    }
                                }
                            });
                        } else {
                            return {
                                status: false,
                                message: "Số TRX không đủ để giao dịch"
                            }
                        }

                        return {
                            status: true
                        }
                    } else {
                        return {
                            message: "Số dư BLF của bạn không đủ ! ",
                            status: false
                        }
                    }

                    // } catch (error) {
                    //     console.error("trigger smart contract error", error)
                    // }
                    ///

                } else {
                    return { message: "Mã xác nhận không đúng ! ", status: false }
                }

            } else {
                return {
                    status: false,
                    message: "Người dùng chưa xác thực 2FA"
                }
            }
        } else {
            return {
                message: "Lỗi hệ thống",
                status: false
            }
        }
    },
    getAddressUser: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const privateKeyUser = await customerQuery.getPrivateKey(phone)
            const address = await tronWeb.address.fromPrivateKey(privateKeyUser[0].privateKey)
            return {
                status: true,
                data: address,
                message: "Lấy địa chỉ ví thành công !"
            }
        } else {
            return {
                message: "Lỗi hệ thống",
                status: false
            }
        }
    },
    getWallet: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const privateKeyUser = await customerQuery.getPrivateKey(phone)
            const address = await tronWeb.address.fromPrivateKey(privateKeyUser[0].privateKey)
            const trc20ContractAddress = tokenBLF;
            try {
                let contract = await tronWeb.contract().at(trc20ContractAddress);
                let result = await contract.balanceOf(address).call();
                const trxWallet = await tronWeb.trx.getBalance(address)
                const updateTRX = await customerQuery.updateUserTRX(phone, trxWallet)
              //console.log(parseInt(result._hex));

                const updateBLF = await customerQuery.updateUserBLFWallet(phone, parseInt(result._hex))
                const getCoinBLF = await customerQuery.getCoinBLF(phone)
                const getCoinTRX = await customerQuery.getCoinTRX(phone)
                return {
                    status: true,
                    data: {
                        BLF: getCoinBLF[0].BLF,
                        TRX: getCoinTRX[0].TRX
                    },
                    message: "Lấy số dư tài khoản thành công ! "
                }
            } catch (error) {
                console.error("trigger smart contract error", error)
            }
        } else {
            return {
                message: "Lỗi hệ thống",
                status: false
            }
        }
    },
    getBLFWallet: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const privateKeyUser = await customerQuery.getPrivateKey(phone)
            const address = await tronWeb.address.fromPrivateKey(privateKeyUser[0].privateKey)
            const trc20ContractAddress = tokenBLF;//contract address
            try {
                let contract = await tronWeb.contract().at(trc20ContractAddress);
                //Use call to execute a pure or view smart contract method.
                // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
                let result = await contract.balanceOf(address).call();
                const updateBLF = await customerQuery.updateUserBLF(phone, parseInt(result._hex))
                const getCoinBLF = await customerQuery.getCoinBLF(phone)
                return {
                    status: true,
                    data: {
                        BLF: getCoinBLF[0].BLF
                    },
                    message: "Lấy số dư tài khoản thành công ! "
                }
            } catch (error) {
                console.error("trigger smart contract error", error)
            }
        } else {
            return {
                message: "Lỗi hệ thống",
                status: false
            }
        }
    },
    listenTron: async (params) => {
    },
    transactionHistory: async (params) => {
        const { address, token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const resTable = await customerQuery.getWallet(phone)
            if (resTable.length > 0) {
                const res = await axios({
                    url: `https://api.trongrid.io/v1/accounts/${resTable[0].base58}/transactions/trc20`,
                    method: "GET"
                })
              //console.log(res.data.data.length);
              //console.log(res.data.data);
                res.data.data.forEach(async (e) => {
                    const checkTransactionHistory = await customerQuery.getTransactionHistory(e.transaction_id)
                    if (checkTransactionHistory.length < 1) {
                        const a = await customerQuery.addTransactionHistory(e.transaction_id, e.from, e.to, e.type, e.value, e.block_timestamp, phone)

                    }
                });
                const allTransactionHistory = await customerQuery.getPhoneTransactionHistory(phone)
                return {
                    status: true,
                    data: allTransactionHistory
                }
            }
        } else {
            return {
                message: "Lỗi hệ thống",
                status: false
            }
        }

    },
    testTron: async (params) => {
        
      
    },
}