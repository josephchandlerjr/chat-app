const socket = io()

socket.on('message', (message) => {
	console.log(message)
})



document.querySelector('#message-form').addEventListener('submit', (evt) => {
	evt.preventDefault()

	const clientMessageText = evt.target.elements.message // use name of input field to accessed it on elements obj
 	socket.emit('sendMessage', clientMessageText.value)
})

document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}

	navigator.geolocation.getCurrentPosition( (position) => {  //asyncronous but currently doesn't support promises
		let {latitude, longitude} = position.coords
		console.log(latitude, longitude)
	}) 
})