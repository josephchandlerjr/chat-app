const socket = io()

// ELements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('message', (message) => { 
	const html = Mustache.render(messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location) => {
	console.log(location)
	const html = Mustache.render(locationTemplate, {
		url: location.url,
		createdAt: location.createdAt
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

// when submited emit 'sendMessage' event
$messageForm.addEventListener('submit', (evt) => {
	evt.preventDefault()
	// disable
	$messageFormButton.setAttribute('disabled', 'disabled')

	const clientMessageText = evt.target.elements.message // use name of input field to accessed it on elements obj

 	socket.emit('sendMessage', clientMessageText.value, (error) => {
 		//clear input form and focus on it
		$messageFormInput.value = ''
		$messageFormInput.focus()

 		if (error) {
 			console.log(error)
 		}

 		//re-enable
 		$messageFormButton.removeAttribute('disabled')
 	})
})

// when clicked get geolocation with a callback that emits 'sendLocation'
$sendLocationButton.addEventListener('click', () => {
	$sendLocationButton.setAttribute('disabled', 'disabled')
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}

	navigator.geolocation.getCurrentPosition( (position) => {  //asyncronous but currently doesn't support promises
        let {latitude, longitude} = position.coords
		socket.emit('sendLocation', {latitude, longitude}, (msg) => {
			if (msg) console.log(msg)
			$sendLocationButton.removeAttribute('disabled')

		})
	}) 
})