const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const User = require('./src/models/user')
const db = require('./db')
const PORT = process.env.PORT || 8080
const app = express()

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

app.all('/', (req, res, next) => {
    res.redirect('/login')
})

app.use(require('./src/controllers/userControllers'))
app.use(require('./src/controllers/todoControllers'))


app.listen(PORT,() => {
    console.log('Serveur sur port:', PORT)
})  

module.exports = {app}