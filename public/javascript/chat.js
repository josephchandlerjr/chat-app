const socket = io()


const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

socket.on('message', (message) => {
	console.log(message)
})



$messageForm.addEventListener('submit', (evt) => {
	evt.preventDefault()
	// disable
	$messageFormButton.setAttribute('disabled', 'disabled')
	//clear input form and focus on it
	$messageFormInput.value = ''
	$messageFormInput.focus()

	const clientMessageText = evt.target.elements.message // use name of input field to accessed it on elements obj
 	socket.emit('sendMessage', clientMessageText.value, (error) => {
 		if (error) {
 			console.log(error)
 		}

 		//enable
 		$messageFormButton.removeAttribute('disabled')


 	})
})

document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}

	navigator.geolocation.getCurrentPosition( (position) => {  //asyncronous but currently doesn't support promises
        let {latitude, longitude} = position.coords
		socket.emit('sendLocation', {latitude, longitude}, (msg) => {if (msg) console.log(msg)})
	}) 
})