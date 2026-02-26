const { default: axios } = require("axios")
const { error_400 } = require("../message")

module.exports = {
    checkRecaptcha: async (req, res, next) => {
        next()
        // const {tokenRecaptcha} = req.body
        // const secretKey = "6LdflhodAAAAAKkxRRWZXWffdP9EaXG4VyZU3jIm"
        // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${tokenRecaptcha}`
        // const ress = await axios({
        //     url,
        //     methods: "POST"
        // })
        // const flag = ress.data.success
        // if (flag) {
        //     next()
        // } else {
        //     error_400(res, `Not verified recaptcha`, 23)
        // }
    }
}