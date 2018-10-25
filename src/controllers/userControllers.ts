import {Router} from 'express'
import * as bcrypt from 'bcrypt';
import * as session from 'express-session'
import {Todo} from '../models/Todo';
import User from '../models/User'
const app = Router()

app.post('/register', async (req, res, next) => {
    let   errors   = []
    const username = req.body.username
    const password = req.body.password
    if (password && username){
        try{
            let user               = await User.scope(req.query['scope']).create({username, password})
                req.session.userId = user.id
        res.format({
            html: () => {res.redirect('/todos/list')},
            json: () => {res.send({user})}
        })
        }catch(e){

        }
        
    }else {
        
    }
  
})
app.get('/user', async (req, res, next) => {
    const user = await User.findAll()
    res.format({
        html: () => {res.send('todo')},
        json: () => {res.send({user})}
    })
})
app.delete('/user', async(req, res, nect) =>{
    const user = await User.drop()
    res.format({
        html: () => {res.send('todo')},
        json: () => {res.send({user})}
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
    let user = await User.findOne({where: {username: req.body.username}})
    if(!user) res.send('User not found')
    
    const password = req.body.password
    if(user.validPassword(password)){
        req.session.userId = user.id
        res.format({
            html: () => {res.redirect('todos/list')},
       })
    } else {
        res.send('U break the app')
    }
})

app.get('/logout', (req, res, next) => {
    req.session.destroy(this)
    res.redirect('/')
})

export default app