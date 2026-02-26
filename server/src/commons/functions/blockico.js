const blockIcoQuery = require("../../query/blockIcoQuery")

function getElementBlock(block) {
    const element = block
    element.created_at = block.created_at.getTime()
    element.end_at = block.end_at.getTime()
    element.token = block.total_token - block.sold
    element.flag = true
    return element
}
async function getNewBlock(block, blockNext, itemBlockPrev) {
    let dataReturn = {}
    if (!blockNext) {
        if (block.sold < block.total_token) dataReturn = getElementBlock(block)
    } else {
        await blockIcoQuery.updateTimeBlockNow(itemBlockPrev.id)
        await blockIcoQuery.updateTimeBlockNext(block.id, itemBlockPrev.end_at)
        dataReturn = getElementBlock(block)
    }
    return dataReturn
}
module.exports = {
    getElementBlock,
    getBlockFunc: async () => {
        try {
            const allBlock = await blockIcoQuery.getBlock()
            const timeNow = new Date().getTime()
            let data = {}

            for (let i = 0; i < allBlock.length; i++) {
                const timeStartBlock = allBlock[i].created_at.getTime()
                const timeEndBlock = allBlock[i].end_at.getTime()

                if (timeNow >= timeStartBlock && timeNow < timeEndBlock) {
                    data = await getNewBlock(allBlock[i])
                    while (!data.flag) {
                        data = await getNewBlock(allBlock[i + 1], true, allBlock[i])
                    }
                    return data
                }
            }
            return {
                created_at: allBlock[0].created_at.getTime(),
                flag: false
            }
        } catch (error) {
        }
    }
}