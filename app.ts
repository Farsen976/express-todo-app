import * as express from  'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as methodOverride from 'method-override';
import db from './db'
import userControllers from './src/controllers/userControllers';
const PORT = process.env.PORT || 8080
const app  = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(session({
  secret: 'keyboard cat'
}))
app.use(methodOverride('_method'))

app.set('views', path.join(__dirname, 'src/views/'))
app.set('view engine', 'twig')

app.all('*', (req, res, next) => {
    if(req.session.userId||req.path === '/login'){
        next()
    }else{
        res.redirect('/login')
    }
})

app.use(userControllers)
app.use(require('./src/controllers/todoControllers'))

async function start(){
    await db.sync();

    await db.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    
    app.listen(PORT,() => {
        console.log(`Server listen on port: ${PORT}`)
    }) 
}

start();

