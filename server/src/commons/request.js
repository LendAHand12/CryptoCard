const {
    convertArrayCreated_at, convertArrayWallet
} = require(".")
const funcQuery = require("../query/funcQuery")

module.exports = {
    getListLimitPageSreach: async (table, limit, page, where, flag) => {
        const listQuery = await funcQuery.getLimitPageToTable(table, limit, page, where)
        const lengthQuery = await funcQuery.getCountToTable(table, where)
        const [list, length] = await Promise.all([listQuery, lengthQuery])
        // if (list.length > 0) convertArrayCreated_at(list, flag)
        const obj = {
            array: list,
            total: length[0][`COUNT(*)`]
        }
        return obj
    },
    getListLimitPage: async (table, limit, page, where, flag) => {
        const listQuery = await funcQuery.getLimitPageToTable(table, limit, page, where)
        const lengthQuery = await funcQuery.getCountToTable(table, where)
        const [list, length] = await Promise.all([listQuery, lengthQuery])
        if (list.length > 0) convertArrayCreated_at(list, "int")
        const obj = {
            array: list,
            total: length[0][`COUNT(*)`]
        }
        return obj
    },
     getListLimitPageWallet: async (table, limit, page, where, flag) => {
         const listQuery = await funcQuery.getLimitPageToTableWallet(table, limit, page, where)
         const lengthQuery = await funcQuery.getCountToTable(table, where)
         const [list, length] = await Promise.all([listQuery, lengthQuery])
         
         if (list.length > 0) convertArrayWallet(list)
         const obj = {
             array: list,
             total: length[0][`COUNT(*)`]
         }
         return obj
     },
    getLimitPageToTableVideo: async (table, limit, page, where) => {
        const listQuery = await funcQuery.getLimitPageToTableVideo(table, limit, page, where)
        const lengthQuery = await funcQuery.getCountToTable(table, where)
        const [list, length] = await Promise.all([listQuery, lengthQuery])
        if (list.length > 0) convertArrayCreated_at(list)
        const obj = {
            array: list,
            total: length[0][`COUNT(*)`]
        }
        return obj
    },
}