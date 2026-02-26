
const connect = require('../../database/database')



module.exports = {
    checkAllUserEmailPassword: async function (email, password) {
        const query = `SELECT * FROM tb_user WHERE email='${email}' AND password='${password}'
       `;
        return new Promise((resolve, reject) => {
            connect.connect.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
}