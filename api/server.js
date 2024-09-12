// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!'})
});

server.post('/api/users', async (req, res) => {
    try {
        const { name, bio } = req.body
        if (!name || !bio) {
            res.status(400).json({ 
                message: "Please provide name and bio for the user" 
            })
        } else {
            const createdUser = await User.insert({ name, bio })
            res.status(201).json(
                { ...createdUser }
            )
        }
    } catch (err) {
        res.status(500).json({
            message: "There was an error while saving the user to the database"
        })
    }
})

server.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ 
            message: "The users information could not be retrieved" 
        })
    }
})

server.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const person = await User.findById(id)
        if(!person) {
            res.status(404).json({ 
                message: "The user with the specified ID does not exist" 
            })
        } else {
            res.status(200).json(person)
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The user information could not be retrieved" 
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.remove(id)
        if (!deletedUser) {
            res.status(404).json({ 
                message: "The user with the specified ID does not exist" 
            })
        } else {
            res.json(deletedUser)
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The user could not be removed" 
        })
    }
})

server.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, bio } = req.body
        const updatedUser = await User.update(id, { name, bio })
        if (!updatedUser) {
            res.status(404).json({ 
                message: "The user with the specified ID does not exist" 
            })
        }
        else if(!name || !bio) {
            res.status(400).json({
                message: "Please provide name and bio for the user" 
                })
        } else {
            res.status(200).json(updatedUser)
        }
    } catch (err) {
        res.status(500).json({
            message: "The user information could not be modified"
        })
    }
})



module.exports = server; // EXPORT YOUR SERVER instead of {}
