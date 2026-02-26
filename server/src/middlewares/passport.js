const passport = require("passport")
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: `${process.env.KEYTOKEN}`
}, (payload,done) => {
    try {
        done(null, payload.cusObj.id)
    } catch (error) {
      //console.log(error,"asd");
        done(error,false)
    }
}))