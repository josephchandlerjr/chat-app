 const express 	= require('express'),
 	   app		= express(),
 	   path		= require('path'),
 	   http		= require('http'),
 	   socketio	= require('socket.io'),
 	   Filter	= require('bad-words'),
 	   filter 	= new Filter(),
 	   port		= process.env.PORT || 3000


const server = http.createServer(app)

const io = socketio(server)

const publicPath = path.join(__dirname, '../public')
const viewsPath  = path.join(__dirname, '../templates')

app.use(express.static(publicPath))
app.set('views', viewsPath)


io.on('connection', (socket) => {
	socket.emit('message', 'welcome') // just this client

	socket.broadcast.emit('message', 'A new user has joined') // all clients but this socket
	socket.on('sendMessage', (msg, callback) => {
		if(!filter.isProfane(msg)) {
			io.emit('message', msg) // every client
			callback()
		} else {
			callback('Message rejected due to profanity.')
		}
		
	})

	socket.on('disconnect', (socket) => {
		io.emit('message', 'A user has left')
	})

	socket.on('sendLocation', (coords, callback) => {
		io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
		callback('Location shared!')
	})
})



server.listen(port, () => console.log(`Listening on port ${port}`))