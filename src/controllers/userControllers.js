const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')
const User =  require('../models/user') 
const Todos = require('../models/todo')

app.post('/register', async (req, res, next) => {
    let errors = []
    const username = req.body.username
    const password = req.body.password
    if (password && username){
        let user = await User.create({username, password}, {include: [{model: Todos}]})
        req.session.userId = user.id
        res.format({
            html : () => {res.redirect('/todos/list')},
            json : () => {res.send({user})}
        })
    }else {
        
    }
  
})
app.get('/user', async (req, res, next) => {
    const user = await User.findAll()
    res.format({
        html : () => {res.send('todo')},
        json : () => {res.send({user})}
    })
})
app.delete('/user', async(req, res, nect) =>{
    const user = await User.drop()
    res.format({
        html : () => {res.send('todo')},
        json : () => {res.send({user})}
    })
})
app.get('/register', (req,res,next) => {
    res.format({
        html: () => {res.render('user/signUp')},
   })
})
app.get('/login', async (req, res, next) => {
    res.format({
         html: () => {res.render('user/signIn')},
    })
})
app.post('/login', async(req, res, next) => {
    let user = await User.find({where: {username: req.body.username}})
    const passwd = user ? user.password : ''
    const password = req.body.password
    let isMatch = bcrypt.compare(password, passwd)
    if(isMatch){
        req.session.userId = user.id
        res.format({
            html: () => {res.redirect('todos/list')},
       })

    }
})

app.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = app