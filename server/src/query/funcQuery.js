const connect = require('../database/database')

module.exports = {
    getLimitPageToTableWallet: async function (table, limit, page, where) {
        var query = `SELECT *  FROM ${table} ${where?`WHERE ${where}`:""} ORDER by amount DESC LIMIT ${limit * (page-1 )},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getLimitPageToTable: async function (table, limit, page, where) {
        var query = `SELECT *  FROM ${table} ${where?`WHERE ${where}`:""} LIMIT ${limit * (page-1 )},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getLimitPageToTableVideo: async function (table, limit, page, where) {
        var query = `SELECT *  FROM ${table} ${where?`WHERE ${where}`:""} ORDER by type,id ASC LIMIT ${limit * (page-1 )},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    addRowToTable: async function (table, obj) {
        const sqlNotification = `INSERT INTO ${table} set ?`
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, obj, (err, rows) => {
                if (err)
                    return reject({
                        status: false,
                        message: `${table} error :' '`,
                        err
                    });
                resolve({
                    status: 200,
                    message: "Success !",
                    resolve: rows
                });
            });
        })
    },
    getRowToTable: async function (table, where) {
        var query = `SELECT * FROM ${table} ${where?`WHERE ${where}`:""} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getCountToTable: async function (table, where) {
        var query = `SELECT COUNT(*) FROM ${table} ${where?`WHERE ${where}`:""} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    updateRowToTable: async function (table, set, where) {
        const sql = `UPDATE ${table} SET ${set} WHERE ${where} ;`
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
    deleteRowToTable: async function (table, where) {
        var sql = `DELETE FROM ${table} WHERE ${where}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    status: false,
                    message: "Lỗi hệ thống ",
                    err
                });
                resolve({
                    message: "Xóa nông trại thành công thành công !",
                    status: true
                });
            });

        });
    },
}