const connect = require('../../database/database');
const funcQuery = require('../../query/funcQuery');
const coinList = require('../../realtimes/models/coinList')
module.exports = {
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
    getCountToTable: async function (table, where) {
        var query = `SELECT COUNT(*) FROM ${table} ${where ? `WHERE ${where}` : ""} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getLimitPageToTable: async function (table, limit, page, where, oder) {
        var query = `SELECT *  FROM ${table} ${where ? `WHERE ${where}` : ""} ORDER BY id DESC LIMIT ${limit * (page - 1)},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    deleteHandling: async function (id, name) {
        var sql = `DELETE FROM  tb_handing WHERE userid=${id} AND name="${name}"`
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
    // tb_handing
    deleteNews: async function (id) {
        var sql = `DELETE FROM  news WHERE id=${id} `
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
    deleteHandling: async function (id) {
        var sql = `DELETE FROM  tb_handing WHERE id!=-1 `
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
    deleteQrscan: async function (qrcode) {
        var sql = `DELETE FROM  tb_qrscan WHERE qrcode='${qrcode}' `
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
    deleteBankingUserToIdUser: async function (id, userid) {
        var sql = `DELETE FROM  tb_banking_user WHERE id=${id} AND userid=${userid}`
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
    getCountry: async function () {
        var query = `SELECT * FROM country`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getVNDTOUSD: async function () {
        var query = `SELECT * FROM tb_raito_exchange WHERE name="USD"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getAllExhange: async function (str) {
        var query = `SELECT * FROM tb_raito_exchange `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getExhange: async function (str) {
        var query = `SELECT * FROM tb_raito_exchange WHERE name="${str}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getDepositVNDToId: async function (id) {
        var query = `SELECT * FROM tb_banking_transaction WHERE id="${id}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBUYSELLP2P: async function () {
        var query = `SELECT * FROM tb_raito_exchange WHERE name="BUYSELL"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getExchgetTransaction: async function () {
        var query = `SELECT * FROM tb_type_exchange `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getExchangeP2PBUYSELL: async function () {
        var query = `SELECT * FROM tb_raito_exchange WHERE name="BUYSELL"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getExchangeDEPOSITVND: async function () {
        var query = `SELECT * FROM tb_raito_exchange WHERE name="DEPOSITVND"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getExchangeP2P: async function () {
        var query = `SELECT * FROM tb_raito_exchange WHERE name="P2P"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getRefUser: async function (ref) {
        var query = `SELECT * FROM users WHERE unique_code='${ref}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    loginUser: async function (ref, password) {
        var query = `SELECT * FROM users WHERE username='${ref}' AND password='${password}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    getUserToUseNamePosition: async function (username) {
        var query = `SELECT * FROM users WHERE POSITION('${username}' IN username) OR POSITION('${username}' IN email)`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToUseNamePagination: async function (username, limit, page) {
        var query = `SELECT * FROM users WHERE POSITION('${username}' IN username) OR POSITION('${username}' IN email) ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        //console.log(query);
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToUseNameOrEmail: async function (username) {
        var query = `SELECT * FROM users WHERE  username="${username}" OR email="${username}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToUseName: async function (username) {
        var query = `SELECT * FROM users WHERE  username="${username}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    editSecret: async function (idUser, secret) {
        const sql = `UPDATE users SET twofa_id='${secret}' WHERE id=${idUser} ;`

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
    updateSTFTURN: async function (amount) {
        const sql = `UPDATE tb_raito_exchange SET raito=raito+${amount} WHERE name='STF_Turn'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Package activated successfully ! ",
                    status: 200
                });
            });

        });
    },
    updateStaking: async function (idUser, staking) {
        const sql = `UPDATE tb_wallet SET usdt_balance=${staking} WHERE userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Package activated successfully ! ",
                    status: 200
                });
            });

        });
    },
    updateUserLeverCommission: async function (idUser, levelCommission) {
        const sql = `UPDATE tb_wallet SET levelCommission=${levelCommission} WHERE idUser=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Kích hoạt gói thành công ! ",
                    status: true
                });
            });

        });
    },
    updateUserDirectCommission: async function (idUser, directCommission) {
        const sql = `UPDATE tb_wallet SET directCommission=${directCommission} WHERE userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Kích hoạt gói thành công ! ",
                    status: true
                });
            });

        });
    },
    updateUserLeverCommission: async function (idUser, levelCommission) {
        const sql = `UPDATE tb_wallet SET levelCommission=${levelCommission} WHERE userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Kích hoạt gói thành công ! ",
                    status: true
                });
            });

        });
    },
    addHistoryCommissione: async function (userName, idUser, bonus, status, type, price) {
        const sqlNotification = `INSERT INTO tb_historycommission set ?`
        const cusObj = {
            userName,
            idUser,
            bonus,
            status,
            type,
            price
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
    getPackageToIdUserPagination: async function (idUser, limit, page) {
        var query = `SELECT * FROM tb_package WHERE idUser=${idUser} ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    updateUserDailyInterestPackage: async function (idUser, dailyInterest) {
        const sql = `UPDATE tb_wallet SET dailyInterest=dailyInterest+${dailyInterest} WHERE idUser=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Kích hoạt gói thành công ! ",
                    status: 200
                });
            });

        });
    },
    updatePackageReceived: async function (id, totalinterestcoin) {
        const sql = `UPDATE tb_package SET received=received+1 ,totalinterestcoin=totalinterestcoin+${totalinterestcoin} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: false,
                    err
                });
                resolve({
                    message: "Package activated successfully ! ",
                    status: 200
                });
            });

        });
    },
    getPackageToIdUser: async function (idUser) {
        var query = `SELECT * FROM tb_package WHERE idUser=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    addPackage: async function (price, idUser, month, typecoin, amountcoin, interest, interest_day) {
        const sqlNotification = `INSERT INTO tb_package set ?`
        const cusObj = {
            idUser,
            price: price,
            month,
            typecoin,
            amountcoin,
            interest,
            interest_day
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
    getWalletToUsername: async function (username) {
        var query = `SELECT * FROM tb_wallet_code WHERE username='${username}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    checkTransaction: async function (hash) {
        var query = `SELECT * FROM blockchain_log WHERE hash='${hash}'`

        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTrc20Show: async function () {
        var query = `SELECT * FROM tb_trc20 WHERE symbol!="USDT"`

        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTrc20: async function () {
        var query = `SELECT * FROM tb_trc20 `

        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTransaction: async function (idUser, transaction) {
        var query = `SELECT * FROM blockchain_log WHERE user_id=${idUser} AND contract='${transaction}'`

        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWalletToAddressUSDTERC20: async function (address) {
        var query = `SELECT * FROM tb_wallet_code WHERE address='${address}' AND `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWalletAllToSymbol: async function (symbol) {
        var query = `SELECT * FROM tb_wallet_code WHERE code='${symbol}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWalletToAddress: async function (str, address) {
        var query = `SELECT * FROM tb_wallet_code WHERE ${str}='${address}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWalletToAddressLabel: async function (str, address, label) {
        var query = `SELECT * FROM tb_wallet_code WHERE ${str}='${address}' AND label='${label}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWalletToIdUserAPI: async function (id) {
        var query = `SELECT * FROM tb_wallet_code WHERE userid=${id} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWalletToIdUser: async function (id, symbol) {
        var query = `SELECT * FROM tb_wallet_code WHERE userid=${id} AND code="${symbol}" ORDER BY id`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    deletewalletcodeToIdUser: async function (id) {
        var sql = `DELETE FROM  tb_wallet_code WHERE id='${id}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    status: false,
                    message: `Welcome to ${process.env.NAME}!`,
                    err
                });
                resolve({
                    message: "Update STF Wallet Success !",
                    status: true
                });
            });

        });
    },
    getTransactionP2PBuyToId: async function (id, symbol, type_exchange, USER) {
        var query = `SELECT * FROM tb_buy WHERE id='${id}' AND status='BUYPENDDING' AND type="${symbol}" AND type_exchange=${type_exchange} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTransactionP2PSellToId: async function (id, symbol, type_exchange, USER) {
        var query = `SELECT * FROM tb_sell WHERE id='${id}' AND status='SELLPENDDING' AND type="${symbol}" AND type_exchange=${type_exchange} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getParentToIdUser: async function (idUser) {
        var query = `SELECT username,id,email 
    FROM users
    where JSON_EXTRACT(parent,"$.F1")="${idUser}" AND status=1`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getLeverToIdUser: async function (idUser) {
        var query = `SELECT * FROM tb_lever WHERE idUser=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);

            });
        });
    },
    addNews: async function (title, description, thumb, content, status) {
        const sqlNotification = `INSERT INTO news set ?`
        const cusObj = {
            status: 1,
            created_at: new Date().getTime() / 1000,
            title,
            description,
            thumb,
            content,
            status
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
    updateNews: async function (id, title, description, thumb, content) {
        const sql = `UPDATE news SET title="${title}", description="${description}", thumb="${thumb}", content="${content}" WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    addBankingUser: async function (userid, owner_banking, name_banking, number_banking) {
        const sqlNotification = `INSERT INTO tb_banking_user set ?`
        const cusObj = {

            created_at: new Date().getTime() / 1000,
            userid,
            owner_banking,
            name_banking,
            number_banking
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
    addWidthDraw: async function (user_id, coin_key, wallet, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin, fee_amount, amount_after_fee, coin_rate, rate, blockchain_status, form_address, note, status, amountBeforeFrom, amountAfterFrom) {
        const sqlNotification = `INSERT INTO withdrawal set ?`
        const cusObj = {
            form_address,
            user_id,
            created_at: new Date().getTime() / 1000,
            status,
            descriptions: "User withdraw",
            coin_key,
            wallet,
            amount,
            to_address,
            withdraw_pay_percent,
            amount_pay_by_coin_key,
            amount_pay_by_coin,
            fee_amount,
            amount_after_fee,
            coin_rate,
            rate,
            blockchain_status,
            note,
            amountBeforeFrom, amountAfterFrom

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
    addWidthDrawHash: async function (user_id, coin_key, wallet, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin, fee_amount, amount_after_fee, coin_rate, rate, blockchain_status, form_address, note, status, hash, amountBeforeFrom, amountAfterFrom) {
        const sqlNotification = `INSERT INTO withdrawal set ?`
        const cusObj = {
            form_address,
            user_id,
            created_at: new Date().getTime() / 1000,
            status,
            descriptions: "User withdraw",
            coin_key,
            wallet,
            amount,
            to_address,
            withdraw_pay_percent,
            amount_pay_by_coin_key,
            amount_pay_by_coin,
            fee_amount,
            amount_after_fee,
            coin_rate,
            rate,
            blockchain_status,
            note,
            hash,
            amountBeforeFrom, amountAfterFrom

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
    addWidthDrawSuccess: async function (user_id, coin_key, wallet, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin, fee_amount, amount_after_fee, coin_rate, rate, blockchain_status, form_address, amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo) {
        const sqlNotification = `INSERT INTO withdrawal set ?`
        const cusObj = {
            form_address,
            user_id,
            created_at: new Date().getTime() / 1000,
            status: 1,
            descriptions: "User withdraw",
            coin_key,
            wallet,
            amount,
            to_address,
            withdraw_pay_percent,
            amount_pay_by_coin_key,
            amount_pay_by_coin,
            fee_amount,
            amount_after_fee,
            coin_rate,
            rate,
            blockchain_status,
            amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo
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
    addWidthDrawvnd: async function (user_id, coin_key, wallet, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin, fee_amount, amount_after_fee, coin_rate, rate, blockchain_status, bank_name, bank_owner, bank_number, bank_address, hash) {
        const sqlNotification = `INSERT INTO withdrawal set ?`
        const cusObj = {
            user_id,
            created_at: new Date().getTime() / 1000,
            status: 2,
            descriptions: "User withdraw",
            coin_key,
            wallet,
            amount,
            to_address,
            withdraw_pay_percent,
            amount_pay_by_coin_key,
            amount_pay_by_coin,
            fee_amount,
            amount_after_fee,
            coin_rate,
            rate,
            blockchain_status,
            hash,
            bank_name,
            bank_owner,
            bank_number,
            bank_address,
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
    addHanding: async function (userid, name) {
        const sqlNotification = `INSERT INTO tb_handing set ?`
        const cusObj = {
            userid,
            name
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
    addQrCode: async function (qrcode) {
        const sqlNotification = `INSERT INTO tb_qrscan set ?`
        const cusObj = {
            qrcode
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
    addLever: async function (idUser, star) {
        const sqlNotification = `INSERT INTO tb_lever set ?`
        const cusObj = {
            idUser,
            star
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
    updateBase58WalletAll: async function (idUser, base58, hex, privateKey, publicKey) {
        const sql = `UPDATE tb_wallet SET base58="${base58}",hex="${hex}",privateKey="${privateKey}",publicKey="${publicKey}" WHERE userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Cập nhật thông tin thất bại !",
                    status: 1,
                    err
                });
                resolve({
                    message: "Cập nhật thông tin thành công ! ",
                    status: 200
                });
            });

        });
    },

    getAllUser: async function (limit, page) {
        var query = `SELECT * FROM users ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);

            });
        });
    },
    getAllUserLength: async function () {
        var query = `SELECT * FROM users`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);

            });
        });
    },
    getListPricePackage: async function (id) {
        var query = `SELECT * FROM tb_list_package`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListPricePackageToId: async function (id) {
        var query = `SELECT * FROM tb_list_package WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getCommissionToId: async function (id) {
        var query = `SELECT * FROM tb_list_commission WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToKycPendding: async function (limit, page) {
        var query = `SELECT * FROM users WHERE verified=2 ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToKycPenddingPagination: async function (limit, page) {
        var query = `SELECT * FROM users WHERE verified=2`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToId: async function (id) {
        var query = `SELECT * FROM users WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    turnCharacters: async function (id, flag) {
        var sql = ""
        if (flag) {
            sql = `UPDATE users SET characters=1  WHERE id=${id} ;`

        } else {
            sql = `UPDATE users SET characters=0  WHERE id=${id} ;`

        }
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: 9,
                    err
                });
                if (flag) {
                    resolve({
                        message: "Bật 12 ký tự thành công ! ",
                        status: 200
                    });
                } else {
                    resolve({
                        message: "Tắt 12 ký tự thành công ! ",
                        status: 200
                    });
                }
            });

        });
    },
    getUserToCharacters: async function (code_characters) {
        // code_characters
        var query = `SELECT * FROM users WHERE code_characters='${code_characters}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToIdAndCharacters: async function (id, code_characters) {
        // code_characters
        var query = `SELECT * FROM users WHERE id=${id} AND code_characters='${code_characters}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getQrCodeToQr: async function (qrcode) {
        var query = `SELECT * FROM tb_qrscan WHERE qrcode='${qrcode}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToId: async function (id) {
        var query = `SELECT * FROM users WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToInvertId: async function (id) {
        var query = `SELECT * FROM users WHERE inviter_id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHandling: async function (id, name) {
        var query = `SELECT * FROM tb_handing WHERE userid=${id} AND name="${name}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToEmail: async function (email) {
        var query = `SELECT * FROM users WHERE email='${email}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getCountryToUserName: async function (nicename) {
        var query = `SELECT * FROM country WHERE nicename='${nicename}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getCountry: async function (nicename) {
        var query = `SELECT * FROM country`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getNews: async function () {
        var query = `SELECT * FROM news`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getNewsToId: async function (id) {
        var query = `SELECT * FROM news WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBankingToNameBanking: async function (id) {
        var query = `SELECT * FROM tb_banking_admin WHERE name_banking = '${id}' `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBankingUserToIdPagination: async function (id) {
        var query = `SELECT * FROM tb_banking_user WHERE userid= ${id} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBankingUserToId: async function (id, limit, page) {
        var query = `SELECT * FROM tb_banking_user WHERE userid= ${id} ORDER by id DESC LIMIT ${limit * (page - 1)},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBankingUserToIdUserAndId: async function (id, idbanking) {
        var query = `SELECT * FROM tb_banking_user WHERE userid= ${id} AND id=${idbanking}  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBankingUserToIdAndNumberBanking: async function (id, number) {
        var query = `SELECT * FROM tb_banking_user WHERE userid= ${id} AND number_banking='${number}'  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBankingToId: async function (id) {
        var query = `SELECT * FROM tb_banking_admin WHERE id = ${id} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBangkingTransactionToIdType0: async function (id) {
        var query = `SELECT * FROM tb_banking_transaction WHERE userid=${id} AND type_user=0 `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTransactionToIdPagination: async function (id) {
        var query = `SELECT * FROM tb_banking_transaction WHERE userid=${id} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWidthDrawToId: async function (id) {
        var query = `SELECT * FROM withdrawal WHERE id=${id}  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWidthDraw: async function (id, limit, page, symbol) {
        var query = `SELECT * FROM withdrawal WHERE user_id=${id} AND coin_key='${symbol}'  ORDER by id DESC LIMIT ${limit * (page - 1)},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getWidthDrawPagination: async function (id, symbol) {
        var query = `SELECT * FROM withdrawal WHERE user_id=${id} AND coin_key='${symbol}'  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTransactionToId: async function (id, limit, page) {
        var query = `SELECT * FROM tb_banking_transaction WHERE userid=${id} ORDER by created_at DESC  LIMIT ${limit * (page - 1)},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBangkingTransactionToIdAndToIdTrans: async function (id, idTrans) {
        var query = `SELECT * FROM tb_banking_transaction WHERE userid=${id} AND id='${idTrans}' `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToWallet: async function (limit, page) {
        var query = `SELECT ${validationAc} FROM tb_wallet_code WHERE ${validationAc} is not null ORDER by id DESC LIMIT ${limit * (page - 1)},${limit} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getUserToWalletCount: async function (limit, page) {
        var query = `SELECT COUNT(*) FROM tb_wallet_code WHERE ${validationAc} is not null  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getAllBanking: async function (token) {
        var query = `SELECT * FROM tb_banking_admin `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getTokenToName: async function (token) {
        var query = `SELECT * FROM tb_coin WHERE name='${token}' `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getAllTokenTRC20: async function (token) {
        var query = `SELECT * FROM tb_coin WHERE type="TRC20" `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getAllToken: async function (token) {
        var query = `SELECT * FROM tb_coin `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    addSellP2P: async function (id, userid, amount, amount_usd, amount_money, symbol, username, type_exchange, amount_maximum, amount_accept, idSell_accept, amount_exchange_usd, percent, amount_exchange_vnd) {
        const sqlNotification = `INSERT INTO tb_sell set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            id,
            userid,
            created_at: new Date().getTime() / 1000,
            amount_usd,
            amount_money,
            type: symbol,
            status: "SELLPENDDING",
            username,
            amount,
            type_exchange,
            amount_maximum,
            amount_accept,
            idbuy_accept: idSell_accept,
            amount_exchange_usd,
            percent,
            amount_exchange_vnd


            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    getSellAdListPagination: async function (type) {
        var query = `SELECT * FROM tb_sell WHERE status='SELLPENDDING' AND active=1 AND type='${type}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListPaginationUser: async function (idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='SELLPENDDING'  AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListPaginationUserACCEPT: async function (idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='ACCEPT'  AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListPaginationUserCancel: async function (idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='DELETE'  AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListPaginationUserPedding: async function (idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='PENDDING'  AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListUserACCEPT: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='ACCEPT'  AND userid=${idUser} ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListUserCancel: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='DELETE'  AND userid=${idUser} ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListUserPedding: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='PENDDING'  AND userid=${idUser} ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListUser: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_sell WHERE status='SELLPENDDING'  AND userid=${idUser} ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdList: async function (limit, page, type) {
        var query = `SELECT * FROM tb_sell WHERE status='SELLPENDDING' AND active=1 AND type='${type}' ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListPagination: async function (type) {
        var query = `SELECT * FROM tb_buy WHERE status='BUYPENDDING' AND type='${type}' AND active=1`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    // ACCEPT
    getBuyAdListPaginationUserACCEPT: async function (idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='ACCEPT' AND userid=${idUser} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListPaginationUserCancel: async function (idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='DELETE' AND userid=${idUser} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListPaginationUserPendding: async function (idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='PENDDING' AND userid=${idUser} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListPaginationUser: async function (idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='BUYPENDDING' AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListUserActive: async function (idP2P, idUser) {
        var query = `SELECT * FROM tb_sell WHERE id='${idP2P}' AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListUserActiveDelete: async function (idP2P, idUser) {
        var query = `SELECT * FROM tb_sell WHERE id='${idP2P}' AND userid=${idUser} AND status='SELLPENDDING' OR status='PENDDING'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListUserActiveDelete: async function (idP2P, idUser) {
        var query = `SELECT * FROM tb_buy WHERE id='${idP2P}' AND userid=${idUser} AND status='BUYPENDDING' OR status='PENDDING'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListUserActive: async function (idP2P, idUser) {
        var query = `SELECT * FROM tb_buy WHERE id='${idP2P}' AND userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListUserACCEPT: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='ACCEPT' AND userid=${idUser}  ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListUserCancel: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='DELETE' AND userid=${idUser}  ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListP2PAdminAll: async function (limit, page) {
        var query = `SELECT * FROM tb_buy ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListStakingAdminAll: async function (limit, page) {
        var query = `SELECT * FROM tb_package  ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListStakingAdminAllPagination: async function () {
        var query = `SELECT * FROM tb_package  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListWidthdrawAdminAll: async function (limit, page) {
        var query = `SELECT * FROM withdrawal WHERE coin_key!="vnd" ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    // getListWidthdrawAdminPagination
    getListWidthdrawAdminPagination: async function (symbol) {
        var query = `SELECT * FROM withdrawal WHERE coin_key = "${symbol}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListWidthdrawAdmin: async function (limit, page, symbol) {
        var query = `SELECT * FROM withdrawal WHERE coin_key = "${symbol}" ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListWidthdrawAdminPendding: async function (limit, page, symbol) {
        var query = `SELECT * FROM withdrawal WHERE coin_key = "${symbol}" AND status=2 ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListWidthdrawAdminPaginationAll: async function (symbol) {
        var query = `SELECT * FROM withdrawal WHERE coin_key!="vnd"  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListWidthdrawAdminPaginationPedding: async function (symbol) {
        var query = `SELECT * FROM withdrawal WHERE coin_key = "${symbol}" AND status=2`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListDepositAdminVND: async function (limit, page) {
        var query = `SELECT * FROM tb_banking_transaction ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getListDepositAdminVNDPagination: async function (limit, page) {
        var query = `SELECT * FROM tb_banking_transaction`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListP2PAdminAll: async function (limit, page) {
        var query = `SELECT * FROM tb_sell ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListP2PAdminAllPagination: async function (limit, page) {
        var query = `SELECT * FROM tb_buy ORDER by id DESC `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListP2PAdminAllPagination: async function (limit, page) {
        var query = `SELECT * FROM tb_sell ORDER by id DESC `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    getBuyAdListP2PAdmin: async function (limit, page) {
        var query = `SELECT * FROM tb_buy WHERE status='PENDDING' ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListP2PAdminPending: async function (limit, page) {
        var query = `SELECT * FROM tb_sell WHERE status='PENDDING' ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getSellAdListP2PAdminPendingPagination: async function (limit, page) {
        var query = `SELECT * FROM tb_sell WHERE status='PENDDING'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListP2PAdminPagination: async function (limit, page) {
        var query = `SELECT * FROM tb_buy WHERE status='PENDDING' `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListUserPendding: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='PENDDING' AND userid=${idUser}  ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistorySwapPagination: async function (idUser, symbolForm, symbol_to) {
        var query = `SELECT * FROM convert_history WHERE user_id=${idUser} AND(wallet = "${symbolForm}" AND coin_key="${symbol_to}" OR(wallet = "${symbol_to}" OR coin_key="${symbolForm}") ) `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryTransferPagination: async function (idUser) {
        var query = `SELECT * FROM transfer_log WHERE user_id=${idUser} or receive_id=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistorySwapExchange: async function (limit, page, idUser, symbolForm, symbol_to) {
        var query = `SELECT * FROM tb_convert_admin WHERE userid=${idUser} AND(symbol = "${symbolForm}" AND symbol_to="${symbol_to}" OR(symbol = "${symbol_to}" OR symbol_to="${symbolForm}") ) ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistorySwapExchangePagination: async function (idUser, symbolForm, symbol_to) {
        var query = `SELECT * FROM tb_convert_admin WHERE userid=${idUser} AND(symbol = "${symbolForm}" AND symbol_to="${symbol_to}" OR(symbol = "${symbol_to}" OR symbol_to="${symbolForm}") )`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistorySwap: async function (limit, page, idUser, symbolForm, symbol_to) {
        var query = `SELECT * FROM convert_history WHERE user_id=${idUser} AND(wallet = "${symbolForm}" AND coin_key="${symbol_to}" OR(wallet = "${symbol_to}" OR coin_key="${symbolForm}") ) ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getNotificationToIdPagination: async function (idUser) {
        var query = `SELECT * FROM tb_notification WHERE userid=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getNotificationToId: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_notification WHERE userid=${idUser} ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryLenddingPagination: async function (idUser) {
        var query = `SELECT * FROM lending_user_packages WHERE user_id=${idUser}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryLenddingPaginationTime: async function (time) {
        var query = `SELECT * FROM lending_user_packages WHERE  created_at > ${time}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryLenddingTime: async function (limit, page, time) {
        var query = `SELECT * FROM lending_user_packages WHERE created_at > ${time} ORDER  by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getInterestPackage: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_interest_package WHERE userid=${idUser}  ORDER  by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getInterestPackagePagination: async function (idUser) {
        var query = `SELECT * FROM tb_interest_package WHERE userid=${idUser} `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryLendding: async function (limit, page, idUser) {
        var query = `SELECT * FROM lending_user_packages WHERE user_id=${idUser}  ORDER  by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryDeposit: async function (limit, page, idUser, symbol) {
        var query = `SELECT * FROM blockchain_log WHERE user_id=${idUser} AND coin_key='${symbol}' ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getAllHistoryHistoryCommission: async function (idUser) {
        var query = `SELECT * FROM tb_historycommission WHERE idUser=${idUser}`

        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryHistoryCommission: async function (idUser, limit, page) {
        var query = `SELECT * FROM tb_historycommission WHERE idUser=${idUser} ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`

        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryInterestLeding: async function (limit, page, idUser, symbol) {
        var query = `SELECT * FROM lending_amount_log WHERE user_id=${idUser} AND coin_key='${symbol}'  ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryInterestLedingPagination: async function (idUser, symbol) {
        var query = `SELECT * FROM lending_amount_log WHERE user_id=${idUser}  AND coin_key='${symbol}' `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryDepositPagination: async function (idUser, symbol) {
        var query = `SELECT * FROM blockchain_log WHERE user_id=${idUser} AND coin_key='${symbol}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryWidthdrawUser: async function (limit, page, idUser, symbol, to_address) {
        var query = `SELECT * FROM withdrawal WHERE coin_key='${symbol}' AND to_address="${to_address}" OR(user_id=${idUser} AND coin_key='${symbol}')  ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        //console.log(query);
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryWidthdrawUserPagination: async function (idUser, symbol, to_address) {
        var query = `SELECT * FROM withdrawal WHERE coin_key='${symbol}' AND to_address="${to_address}" OR(user_id=${idUser} AND coin_key='${symbol}') `
        //console.log(query);
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryTransfer: async function (limit, page, idUser, symbol, time) {
        var query = `SELECT * FROM transfer_log WHERE coin_key='${symbol}' AND( user_id=${idUser} or receive_id=${idUser}) AND created_at > ${time}  ORDER by id DESC LIMIT ${limit * (page - 1)},${limit}`
        //console.log(query);
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getHistoryTransferPagination: async function (idUser, symbol, time) {
        var query = `SELECT * FROM transfer_log WHERE coin_key='${symbol}' AND( user_id=${idUser} or receive_id=${idUser}) AND created_at > ${time}  `
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdListUser: async function (limit, page, idUser) {
        var query = `SELECT * FROM tb_buy WHERE status='BUYPENDDING' AND userid=${idUser}  ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    getBuyAdList: async function (limit, page, type) {
        var query = `SELECT * FROM tb_buy WHERE status='BUYPENDDING' AND active=1 AND type='${type}' ORDER by created_at DESC LIMIT ${limit * (page - 1)},${limit}`
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    addSellP2PACCEPT: async function (id, userid, amount, amount_usd, amount_money, symbol, username, type_exchange, idbuy, amount_maximum, amount_accept, idbuy_accept, amount_exchange_usd, percent, amount_exchange_vnd) {
        const sqlNotification = `INSERT INTO tb_sell set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            id,
            userid,
            accept_at: new Date().getTime() / 1000,
            created_at: new Date().getTime() / 1000,
            amount_usd,
            amount_money,
            type: symbol,
            status: "ACCEPT",
            username,
            amount,
            type_exchange,
            amount_maximum,
            amount_accept,
            idbuy_accept,
            amount_exchange_usd,
            percent,
            amount_exchange_vnd,
            idbuy


            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addBuyP2PACCEPT: async function (id, userid, amount, amount_usd, amount_money, symbol, username, type_exchange, idsell, amount_maximum, amount_accept, idSell_accept, amount_exchange_usd, percent, amount_exchange_vnd) {
        const sqlNotification = `INSERT INTO tb_buy set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            id,
            userid,
            accept_at: new Date().getTime() / 1000,
            created_at: new Date().getTime() / 1000,
            amount_usd,
            amount_money,
            type: symbol,
            status: "ACCEPT",
            username,
            amount,
            type_exchange,
            amount_maximum,
            amount_accept,
            idSell_accept,
            amount_exchange_usd,
            percent,
            amount_exchange_vnd,
            idsell


            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addBuyP2P: async function (id, userid, amount, amount_usd, amount_money, symbol, username, type_exchange, amount_maximum, amount_accept, idSell_accept, amount_exchange_usd, percent, amount_exchange_vnd) {
        const sqlNotification = `INSERT INTO tb_buy set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            id,
            userid,
            created_at: new Date().getTime() / 1000,
            amount_usd,
            amount_money,
            type: symbol,
            status: "BUYPENDDING",
            username,
            amount,
            type_exchange,
            amount_maximum,
            amount_accept,
            idSell_accept,
            amount_exchange_usd,
            percent,
            amount_exchange_vnd


            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addWallet: async function (userid, username) {
        const sqlNotification = `INSERT INTO tb_wallet set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            userid,
            created_at: new Date().getTime() / 1000,
            username



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addWalletCodeBEP20: async function (userid, username, address, code, privateKey) {
        const sqlNotification = `INSERT INTO tb_wallet_code set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            userid,
            created_at: new Date().getTime() / 1000,
            username,
            address,
            code,
            privateKey: privateKey,



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addWalletCodeTRC20: async function (userid, username, address, code, privateKey, publicKey, hex) {
        const sqlNotification = `INSERT INTO tb_wallet_code set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            userid,
            created_at: new Date().getTime() / 1000,
            username,
            address,
            code,
            privateKey,
            publicKey,
            hex



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addWalletCodeVND: async function (userid, username, code) {
        const sqlNotification = `INSERT INTO tb_wallet_code set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            userid,
            created_at: new Date().getTime() / 1000,
            username,

            code,



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addWalletCode: async function (userid, username, address, code, label) {
        const sqlNotification = `INSERT INTO tb_wallet_code set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            userid,
            created_at: new Date().getTime() / 1000,
            username,
            address,
            code,
            label


            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addConvenrtCoin: async function (user_id, amount, coin_key, wallet_amount, wallet, rate, userName, email) {
        const sqlNotification = `INSERT INTO convert_history set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            user_id,
            created_at: new Date().getTime() / 1000,
            amount,
            coin_key,
            wallet_amount,
            wallet,
            rate,
            userName,
            email



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addConvenrtCoinAdmin: async function (userid, amount, symbol, amount_to, rate, symbol_to) {
        const sqlNotification = `INSERT INTO tb_convert_admin set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            userid,
            created_at: new Date().getTime() / 1000,
            amount,
            symbol,
            amount_to,
            rate,
            symbol_to



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addDepositVND: async function (id, amount, bank_name, percent, id_banking_admin, userid) {
        const sqlNotification = `INSERT INTO tb_banking_transaction set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {

            created_at: new Date().getTime() / 1000,
            id,
            amount,
            bank_name,
            percent,
            id_banking_admin,
            userid
            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addInterestPackage: async function (id_package, interest, price, type_coin, userid, month, wallet) {
        const sqlNotification = `INSERT INTO tb_interest_package set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            created_at: new Date().getTime() / 1000,
            id_package,
            interest,
            price,
            type_coin,
            userid,
            month,
            wallet



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addBalanceLog: async function (user_id, amount, before_amount, last_amount, log_type, wallet, message) {
        const sqlNotification = `INSERT INTO balance_log set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            user_id,
            created_at: new Date().getTime() / 1000,
            amount,
            before_amount,
            last_amount,
            log_type,
            wallet,
            message,
            base_amount: amount



            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addListing: async function (email,
        fullname,
        company,
        position,
        project_name,
        token_fullname,
        token_website,
        image_company,
        advertisement,
        token_application,
        token_jurisdiction,
        image_laws) {
        const sqlNotification = `INSERT INTO tb_listing set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            email,
            fullname,
            company,
            position,
            project_name,
            token_fullname,
            token_website,
            image_company,
            advertisement,
            token_application,
            token_jurisdiction,
            image_laws
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addTransfer: async function (user_id, coin_key, amount, receive_id, message, fee, type_exchange, status, address_form, address_to, note, amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo) {
        const sqlNotification = `INSERT INTO transfer_log set ?`

        let walletToAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${coin_key}' AND userid=${receive_id}`)
        amountAfterTo = walletToAfter[0].amount
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            user_id,
            created_at: new Date().getTime() / 1000,
            status,
            coin_key,
            amount,
            receive_id,
            message,
            fee,
            type_exchange,
            address_form,
            address_to,
            note,
            amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo

            // verified : 0
        }
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addNotification: async function (userid, username, title, detail) {
        const sqlNotification = `INSERT INTO tb_notification set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {

            created_at: new Date().getTime() / 1000,
            userid,
            username,
            title,
            detail

            // verified : 0
        }
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addLedding: async function (user_id, amountUSD, coin_rate, interest, symbol, bonus_percent_month, bonus_percent_day, month, paid_day, max_day, source_amount, max_out_amount, coin_amount) {
        const sqlNotification = `INSERT INTO lending_user_packages set ?`
        // var oneYearFromNow = new Date();
        // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // 31104000000 360 day
        const cusObj = {
            user_id,
            created_at: new Date().getTime() / 1000,
            status: 1,
            amount: amountUSD,
            coin_rate,
            rate: coin_rate,
            interest,
            source: symbol,
            bonus_percent_month,
            bonus_percent_day,
            cycle: month,
            paid_day,
            max_day,
            source_amount,
            max_out_amount,
            coin_amount


            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addUserEmail: async function (unique_code, username, email, password, parent, inviter_id, signup_app) {
        const sqlNotification = `INSERT INTO users set ?`

        const cusObj = {
            unique_code,
            username,
            email,
            password,
            // password_fk: password,

            // status: 1,/// đang ký tự active

            // country_id,
            parent,
            inviter_id,
            enabled_twofa: 0,
            created_at: new Date().getTime() / 1000,
            signup_app,
            isbonus: 1
            // verified : 0
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    addWalletAccount: async function (username, email, password, idWallet, parentUserIdWallet, totalWalletChildren) {
        const sqlNotification = `INSERT INTO users set ?`

        const cusObj = {

            username,
            email,
            password,
            // password_fk: password,

            idWallet, parentUserIdWallet, totalWalletChildren,



            created_at: new Date().getTime() / 1000,


            verified: 1
        }
        //console.log(cusObj);
        return new Promise((resolve, reject) => {
            connect.connect.query(sqlNotification, cusObj, (err, rows) => {
                if (err)
                    return reject({
                        status: 7,
                        message: "Người dùng đã tồn tại !",
                        err
                    });
                return resolve({
                    status: 200,
                    message: "Đăng ký thành công !",
                    resolve: rows

                });
            });
        })
    },
    edit2fa: async function (idUser, flag) {
        var sql = ""
        if (flag) {
            sql = `UPDATE users SET enabled_twofa=1  WHERE id=${idUser} ;`

        } else {
            sql = `UPDATE users SET enabled_twofa=0  WHERE id=${idUser} ;`

        }
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Lỗi hệ thống !",
                    status: 9,
                    err
                });
                if (flag) {
                    resolve({
                        message: "Bật 2Fa thành công ! ",
                        status: 200
                    });
                } else {
                    resolve({
                        message: "Tắt 2Fa thành công ! ",
                        status: 200
                    });
                }
            });

        });
    },
    activeKycUser: async function (verified, id) {
        const sql = `UPDATE users SET verified=${verified}
            WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateKycUser: async function (arrayImages, verified, id, phone, fullname, passport, address, type_kyc) {
        const sql = `UPDATE users SET verified=${verified} ,verified_images='${arrayImages}' , phone="${phone}",fullname="${fullname}",type_kyc=${type_kyc},passport="${passport}",address="${address}"
            WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateBalanceCoin: async function (id, btc_balance, str) {
        const sql = `UPDATE tb_wallet SET ${str}=${str}+${btc_balance} WHERE userid=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },

    updateBalanceCoinSell: async function (id, btc_balance, str) {
        const sql = `UPDATE tb_wallet SET ${str}=${str}-${btc_balance} WHERE userid=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    addTransacitonBonus: async function (user_id, from_id, category, coin_key, amount, usd_amount, message, before_amount, after_amount) {
        const sqlNotification = `INSERT INTO blockchain_log set ?`
        const cusObj = {
            user_id,
            from_id,
            category,
            coin_key,
            amount,
            usd_amount,
            message,
            created_at: new Date().getTime() / 1000,
            before_amount, after_amount
        }
        //console.log(cusObj);
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
    addTransacitonCoin: async function (transaction, idUser, amount, fromAddress, toAddress, message, coin_key, usd_amount, before_amount, after_amount) {
        const sqlNotification = `INSERT INTO blockchain_log set ?`
        const cusObj = {
            hash: transaction,
            user_id: idUser,
            from_id: idUser,
            coin_key,
            usd_amount,
            amount,
            category: "receive",
            address: fromAddress,
            to_address: toAddress,
            status: 1,
            message,

            created_at: new Date().getTime() / 1000,
            before_amount, after_amount
        }
        //console.log(cusObj);
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
    addTransaciton: async function (transaction, idUser, contract, image, amount, fromAddress, toAddress, decimal, message, coin_key, usd) {
        const sqlNotification = `INSERT INTO blockchain_log set ?`
        const cusObj = {
            hash: transaction,
            user_id: idUser,
            from_id: idUser,
            contract,
            image,
            amount,
            category: "receive",
            address: fromAddress,
            to_address: toAddress,
            status: 1,
            message,
            confirmations: decimal,
            coin_key,
            created_at: new Date().getTime() / 1000,
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
    updateBalanceUsers: async function (id, btc_balance, str) {
        const sql = `UPDATE users SET ${str}=${btc_balance} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    ///// pricecoin
    updateTurnPriceCoin: async function (idCoin, func, turn) {
        const flag = turn ? 1 : 0
        const sql = `UPDATE tb_coin SET ${func}=${flag} WHERE id=${idCoin}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updatePriceCoin: async function (symbol, price, percent, volume) {
        const sql = `UPDATE tb_coin SET price=${price},percent=${percent},volume=${volume} WHERE name="${symbol}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    update2FA: async function (userid, flag) {
        const sql = `UPDATE users SET enabled_twofa=${flag} WHERE id=${userid}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateActiveUser: async function (userid) {
        const sql = `UPDATE users SET status=1 WHERE id=${userid}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateFee: async function (symbol, price) {
        const sql = `UPDATE tb_raito_exchange SET raito=${price} WHERE name="${symbol}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updatePriceSymbolAdmin: async function (symbol, price) {
        const sql = `UPDATE tb_coin SET flag=1, set_price=${price} WHERE name="${symbol}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateResetSymbolAdmin: async function (symbol) {
        const sql = `UPDATE tb_coin SET flag=0 WHERE name="${symbol}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateBalance: async function (id, btc_balance, symbol) {
        const sql = `UPDATE tb_wallet_code SET amount=${btc_balance} WHERE userid=${id} AND code="${symbol}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateTotalStaking: async function (id, price) {
        const sql = `UPDATE users SET total_staking=total_staking+${price} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateVNDBalance: async function (id, btc_balance) {
        const sql = `UPDATE tb_wallet SET vnd_balance=${btc_balance} WHERE userid=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateSellAdListOne: async function (id, idsell_accept, accept_at, idsell, amount_accept, amount_maximum, amount_totalsell) {
        const sql = `UPDATE tb_sell SET idbuy_accept='${idsell_accept}', status='ACCEPT',accept_at=${accept_at}, idbuy='${idsell}', amount_accept='${amount_accept}',
            amount_maximum=${amount_maximum}, amount_totalbuy=amount_totalbuy+${amount_totalsell}, amount=0 WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateBuyAdListOne: async function (id, idsell_accept, accept_at, idsell, amount_accept, amount_maximum, amount_totalsell) {
        const sql = `UPDATE tb_buy SET idsell_accept='${idsell_accept}', status='ACCEPT',accept_at=${accept_at}, idsell='${idsell}', amount_accept='${amount_accept}',
            amount_maximum=${amount_maximum}, amount_totalsell=amount_totalsell+${amount_totalsell}, amount=0 WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateBuyMinium: async function (id, minium) {
        const sql = `UPDATE tb_buy SET amount=${minium} WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateSellMinium: async function (id, minium) {
        const sql = `UPDATE tb_sell SET amount=${minium} WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },

    deleteBuy: async function (id) {
        const sql = `UPDATE tb_buy SET status='DELETE'  WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    deleteSell: async function (id) {
        const sql = `UPDATE tb_sell SET status='DELETE'  WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateBuy: async function (id, idsell_accept, accept_at, idsell, amount_accept, amount_maximum, amount_totalsell, status) {
        const sql = `UPDATE tb_buy SET idsell_accept='${idsell_accept}', status='${status}',accept_at=${accept_at}, idsell='${idsell}', amount_accept='${amount_accept}',
            amount_maximum=${amount_maximum}, amount_totalsell=amount_totalsell+${amount_totalsell} WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateSell: async function (id, idsell_accept, accept_at, idsell, amount_accept, amount_maximum, amount_totalsell, status) {
        const sql = `UPDATE tb_sell SET idbuy_accept='${idsell_accept}', status='${status}',accept_at=${accept_at}, idbuy='${idsell}', amount_accept='${amount_accept}',
            amount_maximum=${amount_maximum}, amount_totalbuy=amount_totalbuy+${amount_totalsell} WHERE id = '${id}'
            `
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    activeWidthdraw: async function (id, status) {
        const sql = `UPDATE withdrawal SET status=${status} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    cancelWidthdraw: async function (id, status, note) {
        const sql = `UPDATE withdrawal SET status=${status},note="${note}" WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    activeDepositVND: async function (id, status) {
        const sql = `UPDATE tb_banking_transaction SET type_admin=${status}, type_user=${status} WHERE id="${id}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    cancelDepositVND: async function (id, status, note) {
        const sql = `UPDATE tb_banking_transaction SET type_admin=${status},note="${note}" WHERE id="${id}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    activeP2PSell: async function (id, status) {
        const sql = `UPDATE tb_sell SET status="${status}" WHERE id="${id}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    activeP2PBuy: async function (id, status) {
        const sql = `UPDATE tb_buy SET status="${status}" WHERE id="${id}"`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateBTCBalance: async function (id, btc_balance) {
        const sql = `UPDATE users SET btc_balance=${btc_balance} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateETHBalance: async function (id, btc_balance) {
        const sql = `UPDATE users SET eth_balance=${btc_balance} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateTRXBalance: async function (id, btc_balance) {
        const sql = `UPDATE users SET trx_balance=${btc_balance} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    createWalletUSDTERC20: async function (address, userid, lable) {
        const sql = `UPDATE tb_wallet SET usdt_erc20_address='${address}', usdt_erc20_lable = '${lable}' WHERE userid=${userid}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    createWallet: async function (address, strLable, strAdress, userid, lable) {
        const sql = `UPDATE tb_wallet SET ${strAdress}='${address}', ${strLable} = '${lable}' WHERE userid=${userid}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    disableTransactionP2PBuy: async function (idP2P, number) {
        const sql = `UPDATE tb_buy SET active=${number} WHERE id='${idP2P}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    disableTransactionP2PSell: async function (idP2P, number) {
        const sql = `UPDATE tb_sell SET active=${number} WHERE id='${idP2P}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateTypeTransactionVNDCancel: async function (idTrans, type, userid) {
        const sql = `UPDATE tb_banking_transaction SET type_user=${type} WHERE id='${idTrans}' AND userid=${userid}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateTypeTransactionVND: async function (idTrans, type, userid) {
        const sql = `UPDATE tb_banking_transaction SET type_admin=${type} WHERE id='${idTrans}' AND userid=${userid}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateParentUser: async function (parent, id) {
        const sql = `UPDATE users SET parent='${parent}' WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updatePassword: async function (password, username) {
        const sql = `UPDATE users SET password='${password}' WHERE username='${username}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateCharactersToId: async function (code_characters, id) {
        const sql = `UPDATE users SET code_characters='${code_characters}' WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateAddressWallet: async function (phone, tokenApp) {
        const sql = `UPDATE tb_user SET phone='${phone}' WHERE email='${tokenApp}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateImagesTransaction: async function (images, id) {
        const sql = `UPDATE tb_banking_transaction SET images='${images}' WHERE id='${id}'`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    activeStatus: async function (status, id) {
        const sql = `UPDATE users SET status=${status} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },
    updateLogin: async function (id) {
        const sql = `UPDATE users SET lasted_login=${new Date().getTime() / 1000} WHERE id=${id}`
        return new Promise((resolve, reject) => {
            connect.connect.query(sql, (err, rows) => {
                if (err) return reject({
                    message: "Error, please try again !",
                    status: false,
                    err
                });
                resolve({
                    message: "Successful ! ",
                    status: true
                });
            });

        });
    },

}