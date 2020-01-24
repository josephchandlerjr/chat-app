 const express 	= require('express'),
 	   app		= express(),
 	   path		= require('path'),
 	   port		= process.env.PORT || 3000


const publicPath = path.join(__dirname, '../public')
const viewsPath  = path.join(__dirname, '../templates')

app.use(express.static(publicPath))
app.set('views', viewsPath)


app.listen(port, () => console.log(`Listening on port ${port}`))