const TronWeb = require('tronweb');
const { validate } = require('../configs/config');
const dataDemo = require('../queries/walletQuery.json');
const Coinpayments = require('coinpayments');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const query = require('../queries/customerQuery')
// const TronWeb = require('tronweb');
const connect = require('../../database/database');
const { jsonResp } = require('../models/jsonResponse');
const { checkUser } = require('../queries/customerQuery');
const data = require('../../database/account')
const functionCustom = require('../functions/index');
const customerQuery = require('../queries/customerQuery');
global.fcm = require('fcm-notification');
global.foldera = require('./blockchainfarm-f588a-firebase-adminsdk-7gy2v-96f54c4652.json')
global.FCM = new fcm(foldera);
const validateToken = require('../functions/validation')
const fs = require("fs");
const formidable = require("formidable");
const arrayString = require('../configs/string.json');
const { checkPhoneAccount } = require('../functions/index');
var tokenList = [];
/// trong
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "2e485b5e6621b4f60c081e7202fa2fcf9e1a2fedf8ee46ffa99a35e97cdf9365";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const CryptoUtils = require("@tronscan/client/src/utils/crypto");
const TransactionUtils = require("@tronscan/client/src/utils/transactionBuilder");
module.exports = {
    addTokenToPhone: async (params) => {
        const { tokenUser, tokenApp } = params
        const phone = validateToken.tokenUser(tokenUser)
        if (phone) {
            const updatePhoneTokenApp = await customerQuery.updateTokenApp(phone,tokenApp)
            return updatePhoneTokenApp
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống ! "
            }
        }
    },
    getTitleDetailUser: async (params) => {
        const { token, idProcedure } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = await customerQuery.getTitleDetailUser(idProcedure)
            if (data.length >= 1) {
                return {
                    status: true,
                    message: "Lấy nội dùng qui trình của người dùng thành công ! ",
                    data
                }
            } else {
                return {
                    status: false,
                    message: "Người dùng chưa có nội dung qui trình trồng ! ",
                }
            }
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    editTitleDetailUser: async (params) => {
        const { token, idTitle, name, detail, images, idProcedure } = params
        const phone = validateToken.tokenUser(token)
        let Images = images
        if (phone) {
            if (Images == "") {
                Images = "images/logo.png"
            }
            const data = customerQuery.editTitleDetailUser(name, detail, Images, idTitle, idProcedure)
            return data
        }
        else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    deleteTitleDetailUser: async (params) => {
        const { idTitle, token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.deleteTitleDetailUser(idTitle)
            return data
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    addTitleDetailUser: async (params) => {
        const { token, name, idProcedure, detail, images } = params
        let Images = images
        const phone = validateToken.tokenUser(token)
        if (phone) {
            if (Images == "") {
                Images = "images/logo.png"

            }
            const data = await customerQuery.addtitledetailuser(idProcedure, name, detail, Images)

            return data
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    getProcedureUser: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = await customerQuery.getProcedureUser(phone)
            if (data.length >= 1) {
                return {
                    status: true,
                    message: "Lấy thông tin qui trình của người dùng thành công ! ",
                    data
                }
            } else {
                return {
                    status: false,
                    message: "Người dùng chưa có qui trình trồng ! ",
                }
            }
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    editProcedureUser: async (params) => {
        const { token, id, name, priceMin, priceMax } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.editProcedureUser(phone, name, priceMin, priceMax, id)
            return data
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    deleteProcedureUser: async (params) => {
        const { token, id } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.deleteProcedureUser(id, phone)
            return data
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    addProcedureUser: async (params) => {
        const { token, name, priceMin, priceMax } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = await customerQuery.addProcedureUser(phone, name, priceMin, priceMax)
            return data
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    deleteNotification: async (params) => {
        const { id, token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.deleteNotification(phone, id)
            return data
        } else {
            return {
                status: false,
                message: "Lỗi hệ thống"
            }
        }
    },
    getNewsDetail: async (params) => {
        const { id } = params
        const news = await customerQuery.getNewsDetail(id)
        if (news.length > 0) {
            return {
                message: "Lấy Thông tin chi tiết thành công ! ",
                data: news[0],
                status: true
            }
        } else {
            return {
                message: "Lấy Thông tin chi tiết thất bại ! ",
                status: false
            }
        }
    },
    getNewsBlock: async (params) => {
        const news = await customerQuery.getNewsBlock()
        news.forEach(e => {
            delete e.detail
            e.linkWeb = `tin-tuc/` + e.id
        })
        return {
            message: "Lấy tin tức thành công ! ",
            data: news,
            status: true
        }
    },
    addTokenApp: async (params) => {
        const { token } = params
        const allToken = await customerQuery.getTokenUser(token)
        if (allToken.length < 1) {
            const data = customerQuery.addToken(token)
            return data
        } else {
            return {
                message: "Người danh đã có trong danh sách thông báo ! ",
                status: false
            }
        }
    },
    notificationFireBase: async (params, socketIO, io) => {
        const { token, title, detail } = params
        var decodedToken = jwt.verify(token, 'token_user_name');
        if (!decodedToken) {
            return {
                message: "Vui lòng nhập token",
                status: false
            }
            // socket.emit("addNotification",{
            //     message
            // })
        }

        if (decodedToken.cusObj.type == "admin") {
            const allUser = await query.checkAllUser()
            const allNotifiation = await customerQuery.checkAllNotifiation()
            allUser.forEach(async (user) => {
                var sql = `INSERT INTO tb_notification set ?`
                var data = {
                    phone: user.phone,
                }
                let flag = true
                //// check all notification
                allNotifiation.forEach(item => {
                    if (item.phone == user.phone) {
                        flag = false
                    }
                })
                if (flag) {
                    return new Promise((resolve, reject) => {
                        connect.connect.query(sql, data, (err, rows) => {
                            if (err)
                                return reject(err);
                            resolve(rows);
                        });
                    })
                }
            })
            allNotifiation.forEach(item => {
                let intoSql = `INSERT INTO tb_detailnotification set ?`
                let data = {
                    title,
                    detail,
                    phone: item.phone,
                }
                return new Promise((resolve, reject) => {
                    connect.connect.query(intoSql, data, (err, rows) => {
                        if (err)
                            return reject(err);
                        resolve(rows);
                    });
                })
            })
            const allCheck = await customerQuery.checkAllDetailNotification()
            let data = {
                title,
                detail
            }
            const allToken = await customerQuery.getAllToken()
            let tokens = []
            allToken.forEach(e => {
                tokens.push(e.token)
            })
            var message = {
                data: {
                    score: '850',
                    time: '2:45'
                },
                notification: {
                    title: title,
                    body: detail
                }
            };
            FCM.sendToMultipleToken(message, tokens, function (err, response) {
                if (err) {
                  //console.log('err--', err);
                } else {
                    // customerQuery.addNotification(phone, detail, title)
                  //console.log('response-----', response);
                    return "response"
                }

            })
          //console.log(io);
            io.to("joinApp").emit("toNotification", data);

            return {
                message: "Gửi thông báo thành công  !"
            }
        }
        else {
            return {
                message: "Người dùng không có quyền sử dụng chức năng này",
                status: false
            }
        }


    },
    addQRCodeTree: async (params) => {
        const { phone, agricultural, fullname, trademark } = params

    },
    getProfileUser: async (params) => {
        const { token } = params
      //console.log("ok");
        const phone = await validateToken.tokenUser(token)
        const profileUser = await query.checkUser(phone)
        if (profileUser.length > 0) {
            const resTable = await customerQuery.getWallet(profileUser[0].phone)
            const wallets = {
                base58: resTable[0].base58,
                hex: resTable[0].privateKey,
                publicKey: resTable[0].publicKey,
                privateKey: resTable[0].privateKey
            }
            delete profileUser[0].password
            delete profileUser[0].codelogin
            let cusObj = profileUser[0]
            // let token = jwt.sign({ cusObj }, "token_user_name", { expiresIn: 60 * 518400 });
            const listProduce = await customerQuery.checkProduce(profileUser[0].IdProcedure)
            // const detailTitle = await query.checkAllDetailTitle()
            const profileFarm = await customerQuery.checkProfileFarm(profileUser[0].phone)
            const checkArrayIdProcedure = await query.checkProcedureDetailTitle(profileUser[0].IdProcedure)
            profileUser[0].procedure = listProduce[0]
            profileUser[0].wallets = wallets
            // profileUser[0].token = token
            profileUser[0].data = checkArrayIdProcedure
            profileUser[0].profileFarm = profileFarm[0]
            return {
                status: true,
                message: "Lấy thông tin user thành công ! ",
                data: profileUser[0]
            }
        } else {
            return {
                message: "Người dùng không hợp lệ ! ",
                status: false
            }
        }
    },
    loginCode: async (params) => {
        const { codeLogin } = params
        if (!codeLogin) {
            return {
                status: false,
                message: "Vui lòng nhập code Login ! ",

            }
        }
        if (codeLogin instanceof Array == false) {
            return {
                message: "Dữ liệu không hợp lệ ! ",
                status: false
            }
        }
        const str = functionCustom.arrayToString(codeLogin)
        const profileUser = await customerQuery.checkLoginCode(str)
        if (profileUser.length > 0) {
            const resTable = await customerQuery.getWallet(profileUser[0].phone)
            const wallets = {
                base58: resTable[0].base58,
                hex: resTable[0].privateKey,
                publicKey: resTable[0].publicKey,
                privateKey: resTable[0].privateKey
            }
            delete profileUser[0].password
            delete profileUser[0].codelogin
            let cusObj ={id:profileUser[0].id}
            let token = jwt.sign({ cusObj }, "token_user_name", { expiresIn: 60 * 518400 });
            const listProduce = await customerQuery.checkProduce(profileUser[0].IdProcedure)
            // const detailTitle = await query.checkAllDetailTitle()
            const profileFarm = await customerQuery.checkProfileFarm(profileUser[0].phone)
            const checkArrayIdProcedure = await query.checkProcedureDetailTitle(profileUser[0].IdProcedure)
            profileUser[0].procedure = listProduce[0]
            profileUser[0].wallets = wallets
            profileUser[0].token = token
            profileUser[0].data = checkArrayIdProcedure
            profileUser[0].profileFarm = profileFarm[0]
            return {
                status: true,
                message: "Đăng nhập thành công ! ",
                data: profileUser[0]
            }
        } else {
            return {
                status: false,
                message: "Mã xác minh đăng nhập 12 ký tự không đúng !"
            }
        }
    },
    addCodeLogin: async (params) => {
        const { array, token } = params
        const phone = validateToken.tokenUser(token)
        const profile = await customerQuery.getProfilePhone(phone)
        if (profile.length > 0) {
            const text = functionCustom.arrayToString(array)
            const codeLogin = profile[0].codelogin
            if (text == codeLogin) {
              //console.log("ok");
                return {
                    status: true,
                    message: "Đăng ký thành công 12 ký tự ! "
                }
            } else {
                var active = profile[0].active
                return {
                    status: false,
                    message: "Mã 12 ký tự không chính xác ! "
                }
            }
        } else {
            return {
                message: "Thêm mã login thất bại ! ",
                status: false,
            }
        }

    },
    signUpString: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        let array = []
        let data = []
        var number
        for (let i = 1; i <= 12; i++) {
            number = Math.floor(Math.random() * 16) + 1;
            var flag = true
            for (let y = 0; y < array.length; y++) {
                if (array[y].id == number) {
                    flag = false
                }
            }
            if (flag == true) {
                let item = arrayString[number - 1]
                let dataTest = arrayString[number - 1].title
                data.push(dataTest)
                array.push(item)
            } else {
                i--
            }
        }
        let str = functionCustom.arrayToString(data)
        // customerQuery.addCodeLogin(str)
        const testData = await customerQuery.addSignUpCodeLogin(phone, str)
      //console.log(testData);
        if (testData.status) {
            return {
                status: true,
                message: "Lấy mã 12 ký tự thành công ! ",
                data
            }
        } else {
            return {
                status: false,
                message: "Lấy mã 12 ký tự thất bại ! ",
            }
        }

    },
    ///// update Profile Farmmm show one
    updateProfileFarm: async (params) => {
        const { latitude, longitude, width, height, token, quantity } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const flag = await customerQuery.checkProfileFarm(phone)
            if (flag.length != 0) {
                return {
                    message: "Thông tin nông trại đã được cập nhật  !",
                    status: false
                }
            }
            else {
                const data = customerQuery.addProfilefarm(phone, latitude, longitude, width, height, quantity)
                return {
                    message: "Cập nhật thông tin thành công ! ",
                    status: true
                }
            }
        } else {
            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    editProfileFarm: async (params) => {
        const { latitude, longitude, width, height, token, quantity } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.editProfileFarm(phone, latitude, longitude, width, height, quantity)
            return data
        }
    },
    /// thêm nhật ký sản xuất
    addPlanting: async (params) => {
        const { latitude, longitude, describe, image, token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.addPlantingseason(phone, latitude, longitude, describe)
            customerQuery.addNotification(phone, "Thêm nhật ký sản xuất thành công !", "Blockchain Farm")
            return data
        } else {
            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    getStamp: async (params) => {
        const { codeQR } = params
        const data = await customerQuery.getStamp(codeQR)
        return data
    },
    addStamp: async (params) => {
        const { harvest, seristart, seriend, token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            var id = crypto.randomBytes(20).toString('hex');
            const data = customerQuery.addStamp(phone, harvest, seristart, seriend, id)
            customerQuery.addNotification(phone, "Kích hoạt Tem thành công", "Blockchain Farm")
            return data
        } else {
            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    addPack: async (params) => {
        const { latitude, longitude, describe, image, token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.addPack(phone, latitude, longitude, describe)
            customerQuery.addNotification(phone, "Đóng gói sản phẩm thành công !", "Blockchain Farm")
            return data
        } else {
            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    getProfileFarm: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = await customerQuery.checkProfileFarm(phone)
            return {
                status: true,
                message: "Lấy thông tin thành công",
                data: data[0]
            }
        } else {
            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    getListUser: async (params) => {
        const { limit, offset } = params
        const allUser = await customerQuery.checkAllUser()
        const user = await customerQuery.getListUser(limit, offset)
        return {
            message: "Lấy danh sách user thành công ! ",
            data: user,
            total: allUser.length,
            status: true
        }
    },
    deleteFarm: async (params) => {
        const { token, id } = params
      //console.log("ok");
        const phone = validateToken.tokenUser(token)

        if (phone) {
            const data = await customerQuery.deleteFarm(id)
            return data

        } else {

            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    getFarm: async (params) => {
        const { token } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const farm = await customerQuery.getFarm(phone)
            return {
                status: true,
                message: "Lấy danh sách nông trại thành công",
                data: farm
            }
        } else {
            return {
                message: "Vui lòng thêm token ! ",
                status: false
            }
        }
    },
    updateFarm: async (params) => {
        // const { priceMax, priceMin, token, height, width, productivity } = params
        // const user = validateToken.tokenUser(token)
        // if (user) {
        //     const S = width * height
        //     const hecta = (S / 10000)
        //     const tan = hecta * productivity
        //     const kg = tan * 1000
        //     const priceMinTotal = kg * priceMin
        //     const priceMaxTotal = kg * priceMax
        // } else {
        //     return {
        //         status: false,
        //         message: "Người dùng không có quyền cập nhật nông trại"
        //     }
        // }
        const { token, name, width, height, id } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.updateFarm(id, name, width, height)
          //console.log("ok", data);

            return data
        } else if (name == "") {
            return {
                message: "Không được bỏ trống tên nông trại",
                status: false
            }
        }
        else if (width == "") {
            return {
                message: "Không được bỏ trống chiều rộng",
                status: false
            }
        } else if (height == "") {
            return {
                message: "Không được bỏ trống chiều dài",
                status: false
            }
        } else {
            return {
                message: "Người dùng không có quyền thêm nông trại ! (Token)",
                status: false
            }
        }
    },
    addFarm: async (params) => {
        const { token, name, width, height } = params
        const phone = validateToken.tokenUser(token)
        if (phone) {
            const data = customerQuery.addFarm(phone, name, width, height)
            return data
        } else if (name == "") {
            return {
                message: "Không được bỏ trống tên trang trại",
                status: false
            }
        }
        else if (width == "") {
            return {
                message: "Không được bỏ trống chiều rộng",
                status: false
            }
        } else if (height == "") {
            return {
                message: "Không được bỏ trống chiều dài",
                status: false
            }
        } else {
            return {
                message: "Người dùng không có quyền thêm nông trại ! (Token)",
                status: false
            }
        }
    },
    updateFertilizers: async (params) => {
        const { token, name, id } = params
        const flag = validateToken.tokenAdmin(token)
        if (flag) {
            const sql = `UPDATE tb_fertilizers
            SET name = '${name}' 
            WHERE idFertilizer='${id}';`
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, (err, rows) => {
                    if (err) return reject({
                        message: "Lỗi hệ thống !",
                        err
                    });
                    resolve({
                        message: "Cập nhật phân bón thành công !",
                        status: true
                    });
                });

            });
        } else {
            return {
                status: false,
                message: "Người dùng không có quyền"

            }
        }
    },
    updateNews: async (params) => {
        const { token, images, detail, name } = params
        const flag = validateToken.tokenAdmin(token)
        if (flag) {
            const sql = `UPDATE tb_news
            SET name = '${name}' detail = '${detail}' 
            WHERE phone='${decodedToken.cusObj.phone}';`
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, (err, rows) => {
                    if (err) return reject({
                        message: "Lỗi hệ thống !",
                        status: false,
                        err

                    });
                    resolve({
                        message: "Cập nhật tin tức thành công !",
                        status: true
                    });
                });

            });
        } else {
            return {
                status: false,
                message: "Người dùng không có quyền"

            }
        }
    },
    deleteFertilizers: async (params) => {
        const { id, token } = params
        const flag = validateToken.tokenAdmin(token)
        if (flag) {
            var sql = `DELETE FROM tb_fertilizers WHERE idFertilizer=${id}`
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, (err, rows) => {
                    if (err) return reject({
                        status: false,
                        message: "Lỗi hệ thống ",
                        err
                    });
                    resolve({
                        message: "Xóa phân bón thành công thành công",
                        status: true
                    });
                });

            });
        } else {
            return {
                status: false,
                message: "Người dùng không có quyền"
            }
        }

    },
    addFertilizers: async (params) => {
        const { name, token } = params
        const flag = validateToken.tokenAdmin(token)
        if (flag) {
            var sql = `INSERT INTO tb_fertilizers set ?`
            let obj = {
                name,
            }
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, obj, (err, rows) => {
                    if (err)
                        return reject({
                            status: true,
                            message: "Lỗi hệ thống !",
                            err
                        });
                    resolve({
                        status: true,
                        message: "Thêm phân bón thành công !",
                        rows,
                    });
                });
            })

        } else {
            return {
                status: false,
                message: "Người dùng không có quyền !"
            }
        }
    },
    deleteNews: async (params) => {
        const { id, token } = params
        const flag = validateToken.tokenAdmin(token)
        if (flag) {
            var sql = `DELETE FROM tb_news WHERE idNew=${id}`
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, (err, rows) => {
                    if (err) return reject({
                        status: false,
                        message: "Lỗi hệ thống ",
                        err
                    });
                    resolve({
                        message: "Xóa tin tức thành công",
                        status: true
                    });
                });

            });
        } else {
            return {
                status: false,
                message: "Người dùng không có quyền"
            }
        }

    },
    addNews: async (params) => {
        const { name, detail, images, token } = params
        const flag = validateToken.tokenAdmin(token)
        if (flag) {
            var sql = `INSERT INTO tb_news set ?`
            let obj = {
                name,
                detail
            }
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, obj, (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve({
                        status: true,
                        message: "Thêm tin tức thành công",
                        rows,
                    });
                });
            })

        } else {
            return {
                status: false,
                message: "Người dùng không có quyền"
            }
        }
    },
    changePassword: async (params) => {
        const { password, newPassword, token } = params
        var decodedToken = jwt.verify(token, 'token_user_name');
        const user = await checkUser(decodedToken.cusObj.phone)
        if (user[0].password == password) {
            const sql = `UPDATE tb_user
            SET password = '${newPassword}'
            WHERE phone='${decodedToken.cusObj.phone}';`
            return new Promise((resolve, reject) => {
                connect.connect.query(sql, (err, rows) => {
                    if (err) return reject(err);
                    resolve({
                        message: "Thay đổi mật khẩu thành công !",
                        status: true
                    });
                });

            });
        }
        else {
            return {
                message: "Mật khẩu không hợp lệ !",
                status: false
            }
        }

    },

    getNews: async (params) => {
        const getNew = await customerQuery.getNews()
        return {
            message: "Lấy tin tức thành công !",
            data: getNew,
        }
    },
    addManipulation: async (params) => {
        const { codeLocation, nameFertilizer } = params
        let data = {
            codeLocation,
            nameFertilizer
        }
        if (codeLocation == "") {
            return {
                message: "Không được bỏ trống vị trí !",
                status: false
            }
        } else if (nameFertilizer == "") {
            return {
                message: "Không được bỏ trống phân bón ! ",
                status: false
            }
        } else {
            return new Promise((resolve, reject) => {
                var sqlManipulation = `INSERT INTO tb_manipulation set ?`
                connect.connect.query(sqlManipulation, data, (err, rows) => {
                    if (err) return reject(err)
                    resolve({
                        message: "Thêm thành công ! ",
                        status: true
                    })
                })

            })
        }
    },
    fertilizers: async (params) => {
        const fertilizers = await customerQuery.checkAllFertilizers()
        return {
            message: "Lấy danh sách thành công",
            data: fertilizers
        }
    },
    historyNotification: async (params) => {
        const { token } = params
        var decodedToken = jwt.verify(token, 'token_user_name');
        const notification = await customerQuery.checkPhoneDetailNotification(decodedToken.cusObj.phone)
        return { status: true, data: notification, message: "Lấy thông báo thành công ! " }
    },
    procedure: async () => {
        const detailTitle = await customerQuery.checkAllDetailTitle()
        const procedure = await customerQuery.checkAllProcedure()
        return {
            status: true, data: { procedure, detailTitle }
        }
    },
    detailTitle: async () => {
        const procedure = await customerQuery.checkAllProcedure()
        return procedure
    },
    listProduct: async () => {
        const query = `SELECT * FROM tb_procedure`;
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    updateRole: async function (params) {
        const { token, productName, brandName, city, ward, district, idProcedure } = params
        var decodedToken = jwt.verify(token, 'token_user_name');
        var sql = `UPDATE tb_user SET role = 1, productName = '${productName}', brandName='${brandName}',
        city='${city}',ward = '${ward}' ,district = '${district}', IdProcedure = ${idProcedure} WHERE phone = '${decodedToken.cusObj.phone}'`
        const result = await query.checkUser(decodedToken.cusObj.phone)
        if (result.length > 0) {
            if (result[0].role == 0) {
                return new Promise((resolve, reject) => {
                    connect.connect.query(sql, async function (err, resul) {
                        if (err) reject(err);
                        const user = await query.checkUser(decodedToken.cusObj.phone)
                        const wallet = await query.checkPhoneWallet(decodedToken.cusObj.phone)
                        const detailTitle = await customerQuery.checkAllDetailTitle()
                        const procedure = await customerQuery.checkAllProcedure()
                        const listProduce = await customerQuery.checkProduce(idProcedure)
                        const checkProcedure = await customerQuery.checkProcedureDetailTitle(idProcedure)
                        const array = []
                        // for (let i = 0; i < procedure.length; i++) {
                        //     procedure[i].arrayDetail = []
                        // }
                        // procedure.forEach(item => {
                        //     detailTitle.forEach(detail => {
                        //         if (item.IdProcedure == detail.IdProcedure) {
                        //             item.arrayDetail.push(detail)
                        //         }
                        //     })
                        // })
                        array.push(checkProcedure)
                        delete user[0].password
                        user[0].wallets = wallet[0]
                        user[0].data = array[0]
                        user[0].procedure = listProduce[0]
                        return resolve({
                            message: "Khởi tạo thành công !", data: user[0], status: true,
                        })
                    })
                })
            } else {
                return {
                    message: "Bạn đã là nông dân", status: false
                }
            }

        }
        else {
            return {
                message: "Người dùng không có quyền thay đổi thông tin !", status: false
            }
        }
        // return jsonResp(false)
        // return new Promise((resolve, reject) => {
        //     connect.connect.query(sql, function (err, result) {
        //         if (err) reject(err);
        //       //console.log(result.affectedRows + " record(s) updated");
        //     });
        // })
    },
    logOut: function (params, socketIO) {
        const { token } = params
        var decodedToken = jwt.verify(token, 'token_user_name');
        var data = decodedToken.cusObj
      //console.log(socketIO.id);
        const arrayUpdate = functionCustom.checkOutAccount(data.phone, socketIO.id)
        if (arrayUpdate != data.account) {
            data.account = arrayUpdate
          //console.log(data.account, "logout");
            return {
                message: "Đăng xuất thành công !",
                status: true
            }
        } else {
            return {
                message: "Lỗi của Front End !",
                status: false
            }
        }

    },
    logIn: async function (params, socketIO) {
        const { email, password } = params
        let token = null
        if (email.length >6) {
            return {
                message: "Không thể nhập ít hơn 6 ký tự !",
                status: false
            }
        }
    
        let sql = `SELECT * FROM tb_user WHERE phone = '${phone}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, resTable, fields) => {
                if (err) reject(err)
                if (resTable.length == 0) {
                    return resolve({
                        message: "Số điện thoại không tồn tại",
                        status: false
                    })
                } else {
                    resTable.forEach((table) => {
                        if (table.password == password) {
                            let cusObj = {id:table.id}
                            token = jwt.sign({ cusObj }, "token_user_name", { expiresIn: 60 * 518400 });
                            var sqlWallet = `SELECT * FROM tb_wallets WHERE phone = '${phone}'`
                            connect.connect.query(sqlWallet, async (err, resTable, fields) => {
                                try {
                                    if (err) reject(err)
                                    const wallets = {
                                        // phone: resTable[0].phone,
                                        base58: resTable[0].base58,
                                        hex: resTable[0].privateKey,
                                        publicKey: resTable[0].publicKey,
                                        privateKey: resTable[0].privateKey
                                    }
                                    const flag = functionCustom.checkPhoneAccount(phone)
                                    if (flag == true) {
                                        const socket = {
                                            id: socketIO.id,
                                            phone,
                                        }
                                        data.account.push(socket)
                                        data.phone = phone
                                    }
                                    var profileUser = await query.checkUser(phone)
                                    const listProduce = await customerQuery.checkProduce(profileUser[0].IdProcedure)
                                    const detailTitle = await query.checkAllDetailTitle()
                                    const profileFarm = await customerQuery.checkProfileFarm(phone)
                                    const checkArrayIdProcedure = await query.checkProcedureDetailTitle(profileUser[0].IdProcedure)
                                    profileUser[0].procedure = listProduce[0]
                                    profileUser[0].wallets = wallets
                                    profileUser[0].token = token
                                    delete profileUser[0].password
                                    profileUser[0].data = checkArrayIdProcedure
                                    profileUser[0].profileFarm = profileFarm[0]
                                    // arrayUser
                                    let dataWallet = {
                                        address: wallets.base58,
                                        id: socketIO.id
                                    }
                                    // arrayUser.push(dataWallet)
                                    return resolve({
                                        message: "Đăng nhập thành công !",
                                        status: true,
                                        data: profileUser[0],
                                    })
                                }
                                catch (err) {
                                    return err
                                    throw Error(err)

                                }
                            })
                        } else {
                            return resolve({
                                message: "Sai mật khẩu",
                                status: false
                            })
                        }
                    })
                }
            })
        })
    },
    signUp: async function (params) {
        const { fullName, password, phone, type } = params
        var data = null
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (phone.length > 12) {
            return {
                message: "Không thể nhập hơn 12 số",
                status: false
            }
        }
        //  else if (!codelogin) {
        //     return {
        //         message: "Vui lòng nhập code login ! ",
        //         status: false
        //     }
        // } else if (codelogin instanceof Array == false) {
        //     return {
        //         message: "Phải nhập kiểu dữ liệu Array ! ",
        //         status: false
        //     }
        // }
        if (vnf_regex.test(phone) == false) {
            return {
                message: "Số điện thoại không đúng định dạng",
                status: false
            }
        }
        // var str = functionCustom.arrayToString(codelogin)
        var cusObj = {
            fullName: fullName,
            password: password,
            phone: phone,
            role: 0,
            // codelogin,
            idUser: Math.floor(Math.random() * 100000) + 999999,
            type,
        };
        // const checkCodeLogin = await customerQuery.checkCodeLogin(str)
        // if (checkCodeLogin.length < 1) {
        //     return {
        //         status: false,
        //         message: "Mã code login không tồn tại !"
        //     }
        // }
        var status = false;
        var message = "Thông tin đăng ký không hơp lệ!"
        var sqlTable = `SELECT * FROM tb_user WHERE phone = '${phone}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlTable, async (err, resTable, fields) => {
                if (err) return reject(err)
                if (resTable.length == 0) {
                    var sql = `INSERT INTO tb_user set ?`
                    message = "Đăng ký thành công"
                    const token = jwt.sign({ cusObj }, "token_user_name", { expiresIn: 60 * 518400 });
                    const profileFarm = customerQuery.checkProfileFarm(phone)
                    status = true
                    data = {
                        fullName: cusObj.fullName,
                        role: cusObj.role,
                        token,
                        phone: cusObj.phone,
                        profileFarm: profileFarm[0]
                    }
                    customerQuery.addNotification(phone, "Chào mừng bạn đến với Blockchain Farm", "Blockchain Farm")
                    connect.connect.query(sql, cusObj, (err, rows) => {
                        if (err)
                            return reject(err);
                        resolve(rows);
                    });
                    const res = await tronWeb.createAccount()
                    let objWallet = {
                        hex: res.address.hex,
                        base58: res.address.base58,
                        phone: cusObj.phone,
                        privateKey: res.privateKey,
                        publicKey: res.publicKey
                    }
                    data.wallets = objWallet
                    var sqlWallets = `INSERT INTO tb_wallets set ?`
                    connect.connect.query(sqlWallets, objWallet, (err, rows) => {
                        if (err) return reject(err)
                        resolve(rows)
                    })
                } else {
                    message = "Số điện thoại đã có người dùng "
                }
                resolve({
                    status,
                    message,
                    data
                })
            })
        })
    },
    city: function () {
        return new Promise((resolve, reject) => {
            const sql = ` SELECT * FROM province`
            connect.connect.query(sql, (res, err) => {
                if (err) reject(err)
                resolve({
                    res
                })
            })
        })
    },
    district: async function (params) {
        const { matp } = params
        return new Promise((resolve, reject) => {
            const sql = ` SELECT * FROM district`
            connect.connect.query(sql, (res, err) => {
                if (err) reject(err)
                resolve({
                    res
                })
            })
        })
    },
    ward: async function (params) {
        const { maqh } = params
        return new Promise((resolve, reject) => {
            const sql = ` SELECT * FROM ward`
            connect.connect.query(sql, (res, err) => {
                if (err) reject(err)
                resolve({
                    res
                })
                // console.log(res);
            })
        })
    },
    checkQR: async function (params) {
        const { base58 } = params
        const userWallet = await query.checkWalletBase58(base58)
        const profileGarden = await customerQuery.checkCodeGarden(base58)
        const profileFruit = await customerQuery.checkCodeFruit(base58)
        let message = `Mã QR không tồn tại`
        let status = `false`
        if (userWallet.length > 0) {
            const phone = userWallet[0].phone
            const user = await query.checkUser(phone)
            const farm = await query.checkProfileFarm(phone)
            if (user.length > 0) {
                const data = {
                    fullName: user[0].fullName,
                    ward: user[0].ward,
                    role: user[0].role,
                    productName: user[0].productName,
                    brandName: user[0].brandName,
                    district: user[0].district,
                    city: user[0].city,
                    phone: user[0].phone,
                    base58: base58,
                }
                if (farm.length > 0) {
                    const latitude = farm[0].latitude
                    const longitude = farm[0].longitude
                    const width = farm[0].width
                    const height = farm[0].height
                    const quantity = farm[0].quantity
                    const name = farm[0].namefarm
                    const dataFarm = {
                        latitude, longitude, width, height, quantity, name
                    }
                    data.farm = dataFarm

                }
                message = "Quét QR thành công !"
                status = true
                data.link = "/DetailQR/" + base58
                return {
                    message,
                    status,
                    data,
                    user: true,
                }
            }
            return {
                message: "Lỗi không xác định",
                status: false,
            }
        } else if (profileGarden.length > 0) {
            profileGarden[0].link = "/DetailQR/" + base58
            return {
                status: true,
                message: "Quét mã QR thành công ! ",
                data: profileGarden[0],
                garden: true,

            }
        } else if (profileFruit.length > 0) {
            profileFruit[0].link = "/DetailQR/" + base58
            return {
                status: true,
                message: "Quét mã QR thành công ! ",
                data: profileFruit[0],
                fruit: true,

            }
        }
        return {
            message,
            status
        }
    },
    detailQR: async function (params) {
        const { base58 } = params
        const userWallet = await query.checkWalletBase58(base58)
        const profileGarden = await customerQuery.checkCodeGarden(base58)
        const profileFruit = await customerQuery.checkCodeFruit(base58)
        let message = `Mã QR không tồn tại`
        let status = `false`
        if (userWallet.length > 0) {
            const phone = userWallet[0].phone
            const user = await query.checkUser(phone)
            const farm = await query.checkProfileFarm(phone)
            if (user.length > 0) {
                const data = {
                    fullName: user[0].fullName,
                    ward: user[0].ward,
                    role: user[0].role,
                    productName: user[0].productName,
                    brandName: user[0].brandName,
                    district: user[0].district,
                    city: user[0].city,
                    phone: user[0].phone,
                    base58: base58,
                }
                if (farm.length > 0) {
                    const latitude = farm[0].latitude
                    const longitude = farm[0].longitude
                    const width = farm[0].width
                    const height = farm[0].height
                    const quantity = farm[0].quantity
                    const name = farm[0].namefarm
                    const dataFarm = {
                        latitude, longitude, width, height, quantity, name
                    }
                    data.farm = dataFarm

                }
                message = "Quét QR thành công !"
                status = true
                data.link = "DetailQR/" + base58
                return {
                    message,
                    status,
                    data,
                    user: true,
                }
            }
            return {
                message: "Lỗi không xác định",
                status: false,
            }
        } else if (profileGarden.length > 0) {
            profileGarden[0].link = "DetailQR/" + base58
            return {
                status: true,
                message: "Quét mã QR thành công ! ",
                data: profileGarden[0],
                garden: true,

            }
        } else if (profileFruit.length > 0) {
            profileFruit[0].link = "DetailQR/" + base58
            return {
                status: true,
                message: "Quét mã QR thành công ! ",
                data: profileFruit[0],
                fruit: true,

            }
        }
        return {
            message,
            status
        }
    }

}
