 const express 	= require('express'),
 	   app		= express(),
 	   path		= require('path'),
 	   http		= require('http'),
 	   socketio	= require('socket.io'),
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
	socket.on('sendMessage', (msg) => {
		io.emit('message', msg) // every client
	})

	socket.on('disconnect', (socket) => {
		io.emit('message', 'A user has left')
	})
})



server.listen(port, () => console.log(`Listening on port ${port}`))