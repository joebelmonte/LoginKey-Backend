const { MongoClient , ObjectID} = require('mongodb')

const connectionURL = process.env.MONGODB_URL
const databaseName = 'loginkey-backend'

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if (error) {
       return console.log('Unable to connect to DB')
    }

    console.log('Connected to database.')

})