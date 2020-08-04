const mongoose = require('mongoose')
const validator = require('validator')
var crypto = require('crypto')

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc', process.env.API_KEY_ENCRYPTION_KEY); 
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
  } 
  
  function decrypt(text){
    if (text === null || typeof text === 'undefined') {return text;};
    var decipher = crypto.createDecipher('aes-256-cbc', process.env.API_KEY_ENCRYPTION_KEY); 
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
  }

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    partnerId: {
        type: Number,
        trim: true,
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        trim: true,
        get: decrypt,
        set: encrypt
    },
    partnerUserId: {
        type: String,
        required: true,
        trim: true
    },
    timeout: {
        type: Number,
        min: 1,
        default: 3600 // Defaults to 1 hour
    },
    agentJoin: {
        type: String,
        default: 'initialvalue'
    },
    glanceClient: {
        type: String,
        default: 'initialvalue'
    },
    loginKey: {
        type: String,
        default:'initialValue'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

groupSchema.methods.toJSON = function () {
    const group = this
    const groupObject = group.toObject()

    delete groupObject.apiKey

    return groupObject
}

groupSchema.pre('save', async function(next) {
    const group = this
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group