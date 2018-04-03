const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(async (user, done) =>{
    const User = await User.find({
        where: {id: user.id}
    })

    done(null, user)
})

passport.use(new LocalStrategy((username, password, done) => {
    const user = User.find({where: {username: username}}).success((user) =>{
        const passwd = user? user.password : ''
        const isMastch = User.validPassword(password, passws, done, user)
    })
}))

module.exports = passport