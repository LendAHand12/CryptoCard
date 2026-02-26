const customerQuery = require("../../sockets/queries/customerQuery");
const query = require("../../sockets/queries/query");
const connect = require('../../database/database')
const jwt = require('jsonwebtoken')
module.exports = {
    notification: async (listNotification, phone) => {
        try {
          //console.log(listNotification);

            // do stuff with the eventual result and return something
        } catch (error) {
            throw Error(error);
        }
    }
    ,
    addNotification: async (params, io, socket) => {
        try {
            const { detail, title, token } = params
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
                // allUser.forEach(user => {
                //     allCheck.forEach(async (e) => {
                //         let data = await customerQuery.checkPhoneDetailNotification(socket.phone)
                //         // console.log(socket.phone);
                //       //console.log(`${user.phone}`);
                //         io.emit(`${user.phone}`, data)
                //     })
                // })
                let data = {
                    title,
                    detail
                }
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

        } catch (err) {
            throw Error(err)
        }
    },
}