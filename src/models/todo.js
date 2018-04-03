const db = require('../../db')

  let Todos = db.define('todo', {
    message: db.Sequelize.STRING,
    completion: {
      type: db.Sequelize.ENUM('In_Progress', 'To_Do', 'DONE')
    },
    userId: db.Sequelize.INTEGER
  })

module.exports = Todos