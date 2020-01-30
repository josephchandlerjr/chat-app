const socket = io()

socket.on('message', (message) => {
	console.log(message)
})



document.querySelector('#message-form').addEventListener('submit', (evt) => {
	evt.preventDefault()

	const clientMessageText = evt.target.elements.message // use name of input field to accessed it on elements obj
 	socket.emit('sendMessage', clientMessageText.value)
})