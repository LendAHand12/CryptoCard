var jwt = require('jsonwebtoken');

token = function (params) {
    const user = {
        key: `_${params.user_name}_${new Date().getDate()}`,
    }
    return jwt.sign(user, `PRIVATE_TOKEN_KEY_${params.user_name}`);
}

module.exports = { token }