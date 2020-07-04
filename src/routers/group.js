const express = require('express')
const Group = require('../models/group')
const auth = require('../middleware/auth')
const router = new express.Router()
const { generateLoginKey, generateLoginKeys } = require('../utils/loginkey')
const { agentJoinUrl, glanceClient } = require('../utils/urls')


router.post('/groups', auth, async (req, res) => {
    const group = new Group({
        ...req.body,
        owner: req.user._id
    })

    try {
        await group.save()
        group.loginKey = generateLoginKey(group)
        res.status(201).send(group)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/groups', auth, async (req, res) => {
    try {
        const groups = await Group.find({owner: req.user._id})
        generateLoginKeys(groups)
        res.send(groups)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/groups/:id', auth, async (req, res) => {
    try {
        const group = await Group.findOne({_id: req.params.id, owner: req.user._id})
        if(!group) {
            return res.status(404).send()
        }
        group.loginKey = generateLoginKey(group)
        group.agentJoin = agentJoinUrl(group)
        group.glanceClient = glanceClient(group)
        res.send(group)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/groups/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'partnerId', 'apiKey', 'partnerUserId', 'timeout']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try {
        const group = await Group.findOne({_id: req.params.id, owner: req.user._id})
        if (!group){
            return res.status(404).send()
        }

        updates.forEach((update) => group[update] = req.body[update])
        await group.save()
        res.send(group)

    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/groups/:id', auth, async (req, res) => {
    try {
        const group = await Group.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!group){
            res.status(404).send()
        }
        res.send(group)

    } catch(e) {
        res.status(500).send()
    }
})


module.exports = router