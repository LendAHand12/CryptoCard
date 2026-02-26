class JsonResponse {
    status = false
    message = ''
    token = null
    data = null
}

jsonResp = async function (status, message, token, data) {

    var jsonResp = await new JsonResponse()
    jsonResp.status = status,
    jsonResp.message = message,
    jsonResp.token = token,
    jsonResp.data = data

    return jsonResp;
}

module.exports = { jsonResp };