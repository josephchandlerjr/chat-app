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

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

server.listen(port, () => console.log(`Listening on port ${port}`))