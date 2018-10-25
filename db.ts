import {Sequelize} from 'sequelize-typescript'

const db = new Sequelize({
    database  : 'todos',
    dialect   : 'sqlite',
    username  : 'root',
    password  : '',
    storage   : './.sqlite',
    modelPaths: [__dirname + '/src/models/**/*.ts']
});

export default db