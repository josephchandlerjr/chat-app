 const express 	= require('express'),
 	   app		= express(),
 	   path		= require('path'),
 	   http		= require('http'),
 	   socketio	= require('socket.io'),
 	   Filter	= require('bad-words'),
 	   filter 	= new Filter(),
 	   {generateMessage, generateLocationMessage } = require('./utils/messages'),
 	   { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
 	   port		= process.env.PORT || 3000


const server = http.createServer(app)

const io = socketio(server)

const publicPath = path.join(__dirname, '../public')
const viewsPath  = path.join(__dirname, '../templates')

app.use(express.static(publicPath))
app.set('views', viewsPath)


io.on('connection', (socket) => { // just to this client

	socket.on('join', ( { username, room }) => {
		socket.join(room)

		socket.emit('message', generateMessage('Welcome!')) 
		socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined.`)) // all clients but this socket

		//socket.emit, io.emit, socket,broadcast.emit
		// when dealing with rooms use these two
		//io.to.emit, socket.broadcast.to.emit
	})

	socket.on('sendMessage', (msg, callback) => {
		if(!filter.isProfane(msg)) {
			io.emit('message', generateMessage(msg)) // every client
			callback()
		} else {
			callback('Message rejected due to profanity.')
		}
	})

	socket.on('disconnect', (socket) => {
		io.emit('message', generateMessage('A user has left'))
	})

	socket.on('sendLocation', (coords, callback) => {
		io.emit('locationMessage', generateLocationMessage(coords))
		callback('Location shared!')
	})
})



server.listen(port, () => console.log(`Listening on port ${port}`))