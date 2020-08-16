const express = require('express')
var cors = require('cors')
const Group = require('../models/group')
const auth = require('../middleware/auth')
const router = new express.Router()
const { generateLoginKey, generateLoginKeys } = require('../utils/loginkey')
const { agentJoinUrl, glanceClient, agentJoinUrls, glanceClients } = require('../utils/urls')


var corsOptions = {
    origin: process.env.FRONTENDORIGIN,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


router.post('/groups', cors(corsOptions), auth, async (req, res) => {
    const group = new Group({
        ...req.body,
        owner: req.user._id
    })

    try {
        await group.save()
        group.loginKey = generateLoginKey(group)
        group.agentJoin = agentJoinUrl(group)
        group.glanceClient = glanceClient(group)
        res.status(201).send(group)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/groups', cors(corsOptions), auth, async (req, res) => {
    try {
        const groups = await Group.find({owner: req.user._id})
        generateLoginKeys(groups)
        agentJoinUrls(groups)
        glanceClients(groups)
        res.send(groups)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/groups/:id', cors(corsOptions), auth, async (req, res) => {
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

// Update group
router.patch('/groups/:id', cors(corsOptions), auth, async (req, res) => {
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
        group.loginKey = generateLoginKey(group)
        group.agentJoin = agentJoinUrl(group)
        group.glanceClient = glanceClient(group)
        res.send(group)

    } catch(e) {
        res.status(400).send(e)
    }
})

// Clone group with updates
router.post('/groups/clone/:id', cors(corsOptions), auth, async (req, res) => {
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

        const groupClone = new Group({
            name: group.name,
            partnerId: group.partnerId,
            apiKey: group.apiKey,
            partnerUserId: group.partnerUserId,
            timeout: group.timeout,
            owner: req.user._id
        })

        await groupClone.save()
        groupClone.loginKey = generateLoginKey(group)
        groupClone.agentJoin = agentJoinUrl(group)
        groupClone.glanceClient = glanceClient(group)
        res.send(groupClone)

    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/groups/:id', cors(corsOptions), auth, async (req, res) => {
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


router.delete('/groups', cors(corsOptions), auth, async (req, res) => {
    try {
        const group = await Group.deleteMany({owner: req.user._id})
        if(!group){
            res.status(404).send()
        }
        res.send(group)

    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router