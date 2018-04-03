const express = require('express')
const app = express.Router()
const Todos =  require('../models/todo') 
const User = require('../models/user')
const Errors = require('../exceptions/errors')

app.get('/todos/list', async (req, res, next) => {
    if(req.session.userId !== undefined){
        let user = await User.find({where: {id: req.session.userId}, include: [{model: Todos}]})
        let todos = user.todos;
        if(todos){
            res.format({ 
                html: () => {res.render('todo/index', {todos})},
                json: () => {res.send({todo})}
            })
        }
    }else{
        res.send('Dommage')
    }
})
app.post('/todos', async (req, res, next) => {
    const message = req.body.message
    const completion = req.body.completion
    //if (!message || !completion) throw new Errors.BadRequestError('les deux champs doivent être remplit')
    if(req.session.userId){
    let user = await User.find({where: {id: req.session.userId}})
    let todo = await Todos.create({message, completion, userId: user.id})
    await user.addTodo(todo)
    req.session.userId = user.id
    res.format({
        html : () => {res.redirect('todos/list')},
        json : () => {res.send({todo})}
    })
}
})
app.get('/todos/add', async (req, res, next) => {
    if(req.session.userId){
        const completion = ['In_Progress', 'To_Do', 'DONE']
        res.format({
            html : () => {res.render('todo/create', {completion})}
        })
    }
})
app.get('/todos/:id', async (req, res, next) => {
    const todo = await Todos.findById(req.params.id);
    const user = await User.getTodo(todo)
    res.format({
        html : () => {res.send()},
        json : () => {res.send({todo: user.todo})}
    })
})
app.delete('/todos/:id', async (req, res, next) => {
    await User.removeTodo({
        where: {
            id: req.params.id
        }
    })

    res.json({message : 'Element destroy !'})
})
 app.patch('/todos/:id', async (req, res, next) => {
    const todo = await User.getTodo({
        where:{
            id: req.params.id
        }
    })

    if(todo){
        await todo.updateAttributes({
            message: req.body.message,
            completion: req.body.completion
        })
    }
    res.format({
        html : () => {res.send('todo')},
        json : () => {res.send({todo})}
    })
})

app.put('/todos/:id', async (req, res, next) =>{
   const todo = await User.hasTodo({
        where:{
            id: req.params.id
        }
    })

    if(todo){
        await todo.updateAttributes({
            message: req.body.message,
            completion: req.body.completion
        })
    }
    res.format({
        html : () => {res.send('todo')},
        json : () => {res.send({todo})}
    })
})

module.exports = app