module.exports = {
    getCoinListQuery: async function (params) {
        const query = `SELECT wallet, name, image FROM tb_wallet_support
        WHERE 1 = 1 
        AND email = '${params.email}' 
        AND active_code = '${params.active_code}'`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    },
}