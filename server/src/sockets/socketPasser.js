const selfConfig = require('./configs/serviceConfig.json');
const service = require('./services/service');

apiPasser = async function (req, socketIo,io) {
    const params = req.api_passer;
    var key = '';
    var dataService = null;
    try {
        if (isValidObject(params, "undefined") && isValidObject(params.key_passer)) { key = selfConfig[params.key_passer] }
        else { return false }

        dataService = await service[key](params, socketIo,io);
        socketIo.emit(params.key_passer, dataService);
    } catch (error) {

        socketIo.emit(params.key_passer, error);
    }
}

module.exports = apiPasser