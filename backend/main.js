const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const expressWS = require('express-ws')

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

const ROOM = {}

const app = express()
const appWS = expressWS(app)

app.use(morgan('combined'))
app.use(cors())

app.ws('/chat', (ws, req) => {
    const name = req.query.name
    // should check if name is inside ROOM

    console.info(`New websocket connection: ${name}`)
    // add the websocket connection to the room
    ws.participantName = name
    ROOM[name] = ws
    
    // setup
    ws.on('message', (payload) => {
        const chat = JSON.stringify({
            from: name,
            message: payload,
            timestamp: (new Date().toString())
        })
        for (let p in ROOM) {
            ROOM[p].send(chat)
        }
    })

    ws.on('close', () => {
        console.info(`Closing websocket connection for ${name}`)
        // close our end of the connection
        ROOM[name].close()
        // remove ourself from the room
        delete ROOM[name]
    })
})

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})