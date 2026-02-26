const connect = require("../database/database");

module.exports = {
    getHistoryBuyICO: async function (limit, page, idUser) {
            var query = `SELECT * FROM tb_buy_ico WHERE userid=${idUser} ORDER by id DESC LIMIT ${limit * (page-1 )},${limit}`
            console.log(query);  
        return new Promise((resolve, reject) => {
                connect.connect.query(query, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            });
        },
        getHistoryBuyICOPagination: async function (idUser) {
            var query = `SELECT * FROM tb_buy_ico WHERE userid=${idUser}`

            return new Promise((resolve, reject) => {
                connect.connect.query(query, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            });
        },
     addHistoryBuyICO: async function (userid, amount, priceUSD, username, priceCoin,wallet) {
         const sqlNotification = `INSERT INTO tb_buy_ico set ?`
         const cusObj = {
             userid, amount, priceUSD, username, priceCoin, wallet
         }
         return new Promise((resolve, reject) => {
             connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                 if (err)
                     return reject({
                         status: false,
                         message: "đăng ký thất bại !",
                         err
                     });
                 return resolve({
                     status: 200,
                     message: "Kích hoạt gói thành công !",
                     resolve: rows

                 });
             });
         })
     },
     getListAmountIco: async function () {
         var query = `SELECT * FROM tb_list_amount_ico`
         return new Promise((resolve, reject) => {
             connect.connect.query(query, (err, rows) => {
                 if (err) return reject(err);
                 resolve(rows);
             });
         });
     },
    getBlock: async function () {
        var query = `SELECT * FROM block_ico`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
     updateSold: async function (id, amount) {
         const sql = `UPDATE block_ico SET sold=sold+${amount} WHERE id=${id};`

         return new Promise((resolve, reject) => {
             connect.connect.query(sql, (err, rows) => {
                 if (err) return reject({
                     message: "Lỗi hệ thống !",
                     status: false,
                     err
                 });
                 resolve({
                     message: "Thay đổi secret thành công ! ",
                     status: true
                 });
             });

         });
     },
     updateTimeBlockNow: async function (id) {
         const sql = `UPDATE block_ico SET end_at=CURRENT_TIMESTAMP WHERE id=${id};`

         return new Promise((resolve, reject) => {
             connect.connect.query(sql, (err, rows) => {
                 if (err) return reject({
                     message: "Lỗi hệ thống !",
                     status: false,
                     err
                 });
                 resolve({
                     message: "Thay đổi secret thành công ! ",
                     status: true
                 });
             });

         });
     },
     updateTimeBlockNext: async function (id,time) {
         const sql = `UPDATE block_ico SET created_at=CURRENT_TIMESTAMP WHERE id=${id};`

         return new Promise((resolve, reject) => {
             connect.connect.query(sql, (err, rows) => {
                 if (err) return reject({
                     message: "Lỗi hệ thống !",
                     status: false,
                     err
                 });
                 resolve({
                     message: "Thay đổi secret thành công ! ",
                     status: true
                 });
             });

         });
     },
    deletePriceCoin: async function (id) {
        var sql = `DELETE FROM  tb_pricecoin WHERE idTransaction='${id}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    status: false,
                    message: "Lỗi hệ thống ",
                    err
                });
                resolve({
                    message: "detele success !",
                    status: true
                });
            });

        });
    },
}