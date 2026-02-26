const { getListLimitPage } = require("../commons")
const { error_500, success } = require("../message")
const { getRowToTable, updateRowToTable } = require("../query/funcQuery")




module.exports = {
    getListNotification: async (req, res, next) => {
        try {
            const { limit, page } = req.body
            const userid = req.user
            // const time = getStartWeekAndLastDay()
            //
            const list = await getListLimitPage(`tb_notification_user_visa`, limit, page, `userid=${userid}`)
            const listWatched = await getRowToTable(`tb_notification_user_visa`, `userid=${userid} AND watched=1`)
            list.watched = listWatched.length
            success(res, "Get getListNotification success", list)
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    clickNotification: async (req, res, next) => {
        try {
            const { idNotification } = req.body
            const userid = req.user
            await updateRowToTable(`tb_notification_user_visa`, `watched=1`, `id=${idNotification}`)
            success(res, "click getListNotification success")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
    clickAllNotification: async (req, res, next) => {
        try {
            // const { idNotification } = req.body
            const userid = req.user
            await updateRowToTable(`tb_notification_user_visa`, `watched=1`, `userid=${userid}`)
            success(res, "click getListNotification success")
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    },
}