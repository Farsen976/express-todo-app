const db = require('../../db')
const Todo = require('./todo')
const bcrypt = require('bcrypt')

let User = db.define('user', {
    username: {type: db.Sequelize.STRING, unique: true, allowNull: false},
    password: {type: db.Sequelize.STRING, allowNull: false},
  }, 
  {
    instanceMethods: {
      validPassword: (password, passwd, done) => {
        bcrypt.compare(password, passwd, (err, isMatch) => {
          if(err) console.log(err)
          if(isMatch) {
            return done(null, this)
          } else {
            return done(null, false)
          }
        })
      }
    }
  })

User.hook('beforeCreate', (user, cb) => {
  return bcrypt.hash(user.password, 12).then((password) => {
    user.password = password
  })
})

User.hasMany(Todo)

module.exports = User