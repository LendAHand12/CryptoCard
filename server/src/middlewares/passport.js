const passport = require("passport")
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { getRowToTable } = require('../query/funcQuery')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: `${process.env.KEYTOKEN}`
}, async (payload, done) => {
    try {
        const id = Number(payload.cusObj.id)
        const user = await getRowToTable(`users`, `id=${id}`)
        // user bị khóa thì token cũ cũng không còn hiệu lực
        if (user.length > 0 && user[0].is_locked == 1) return done(null, false)
        done(null, id)
    } catch (error) {
      //console.log(error,"asd");
        done(error,false)
    }
}))
