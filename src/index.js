const express = require('express')
var cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const groupRouter = require('./routers/group')


const app = express()
app.options('*', cors())
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(groupRouter)


app.listen(port, () => {
    console.log('Server is up on port ', port)
})