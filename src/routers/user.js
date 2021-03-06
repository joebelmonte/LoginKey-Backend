const express = require('express')
var cors = require('cors')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

var corsOptions = {
    origin: process.env.FRONTENDORIGIN,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

// Create a user
router.post('/users', cors(corsOptions), async (req, res) => {
    const user = new User(req.body)

    try { 
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

// Login
router.post('/users/login', cors(corsOptions), async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch(e) {
        res.status(400).send()
    }
})

// Logout
router.post('/users/logout', cors(corsOptions), auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// Log out of all devices
router.post('/users/logoutAll', cors(corsOptions), auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// Get user profile
router.get('/users/me', cors(corsOptions), auth, async (req, res) => {
    res.send(req.user)
})

// Update user profile
router.patch('/users/me', cors(corsOptions), auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)

    } catch(e) {
        res.status(400).send(e)
    }
})

// delete an account
router.delete('/users/me', cors(corsOptions), auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)

    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router