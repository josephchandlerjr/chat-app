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

	socket.on('join', (options, callback) => {
		const { error, user } = addUser({ id: socket.id, ...options })
		if (error) {
			return callback(error)
		}
		socket.join(user.room)

		socket.emit('message', generateMessage('Welcome!')) 
		socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`)) // all clients but this socket

		callback()

		//socket.emit, io.emit, socket,broadcast.emit
		// when dealing with rooms use these two
		//io.to.emit, socket.broadcast.to.emit
	})

	socket.on('sendMessage', (msg, callback) => {
		const user = getUser(socket.id)
		if(!filter.isProfane(msg)) {
			io.to(user.room).emit('message', generateMessage(msg)) // every client
			callback()
		} else {
			callback('Message rejected due to profanity.')
		}
	})

	socket.on('disconnect', () => {
		const user = removeUser(socket.id)
		if (user) {
			io.to(user.room).emit('message', generateMessage(`${user.username} has left`))
		}
		
	})

	socket.on('sendLocation', (coords, callback) => {
		const user = getUser(socket.id)
		io.to(user.room).emit('locationMessage', generateLocationMessage(coords))
		callback('Location shared!')
	})
})



server.listen(port, () => console.log(`Listening on port ${port}`))