const socket = io()

// ELements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => { 
	const html = Mustache.render(messageTemplate, {
		message: message.text,
		username: message.username,
		createdAt: moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location) => {
	const html = Mustache.render(locationTemplate, {
		url: location.url,
		username: location.username,
		createdAt: moment(location.createdAt).format('h:mm a')
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
 			alert(error)
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

socket.on('roomData', ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	})
	$sidebar.innerHTML = html
})

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error)
		location.href = '/'
	}
})