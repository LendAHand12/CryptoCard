const { success, error_500 } = require("../message");
const { getRowToTable, updateRowToTable, addRowToTable } = require("../query/funcQuery");



module.exports = {
    getExchange: async function (req, res, next) {
        try {
            const exhcange = await getRowToTable(`tb_exchange_rate`)
            success(res, "get list success!", exhcange)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    editExchange: async function (req, res, next) {
        try {
            const { title, rate, id } = req.body
            await updateRowToTable(`tb_exchange_rate`, `title='${title}',rate=${rate}`, `id=${id}`)
            success(res, "Update success!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    addExchange: async function (req, res, next) {
        try {
            const { title, rate } = req.body
            const obj = {
                title, rate
            }
            await addRowToTable(`tb_exchange_rate`, obj)
            success(res, "Add success!")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
}