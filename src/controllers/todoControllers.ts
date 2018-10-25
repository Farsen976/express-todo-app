import {Completion, Todo} from '../models/Todo';
import User from '../models/User';
import {Router} from 'express';
const app = Router()

app.get('/todos/list', async (req, res, next) => {
        let user = await User.findById(req.session.userId)
        
        let todos = await user.$get('todos')
        if(todos){
            res.format({ 
                html: () => {res.render('todo/index', {todos})},
                json: () => {res.send({todos})}
            })
        }
   })
app.post('/todos', async (req, res, next) => {
    const message    = req.body.message
    const completion = req.body.completion
    //if (!message || !completion) throw new Errors.BadRequestError('les deux champs doivent être remplit')
    try{

    
    let user = await User.findById(req.session.userId)
    let todo = await Todo.create({message, completion, userId: user.id})
    res.format({
        html: () => {res.redirect('todos/list')},
        json: () => {res.send({todo})}
    })
}catch(e){
    res.send(e)
}
})
app.get('/todos/add', async (req, res, next) => {
        res.format({
            html: () => {res.render('todo/create', {Completion})}
        })
})
app.get('/todos/:id', async (req, res, next) => {
    const todo = await Todo.findById(req.params.id)
    res.format({
        html: () => {res.render('todo/update', {todo, Completion})},
        json: () => {res.send({todo})}
    })
})
app.get('/todos/delete/:id', async (req, res, next) => {
    const todo = await Todo.findById(req.params.id)
    res.format({
        html: () => {res.render('todo/delete', {todo})},
        json: () => {res.send({todo})}
    })
})
app.delete('/todos/delete', async (req, res, next) => {
    await Todo.destroy({
        where: {
            id: req.body.todoId
        }
    })
    res.format({
        html: () => {res.redirect('list')},
        json: () => {res.send()}
    })
})
 app.patch('/todos/:id', async (req, res, next) => {
    const todo = await Todo.findById(req.params.id)

    if(todo){
        await todo.updateAttributes({
            message   : req.body.message,
            completion: req.body.completion
        })
    }
    res.format({
        html: () => {res.send('todo')},
        json: () => {res.send({todo})}
    })
})

app.put('/todos/update', async (req, res, next) =>{
   const todo = await Todo.findById(req.body.todoId)

    if(todo){
        await todo.updateAttributes({
            message   : req.body.message,
            completion: req.body.completion
        })
    }
    res.format({
        html: () => {res.redirect('list')},
        json: () => {res.send({todo})}
    })
})

module.exports = app
