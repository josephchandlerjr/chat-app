const users = []

const addUser = ({ id, username, room }) => {
	//clean data
	username = username.trim().toLowerCase()
	room     = room.trim().toLowerCase()

	//validate the data
	if (!username || !room) {
		return {
			error: 'Username and room are required'
		}
	}
	//check for existing user
	const existingUser = users.find( (user) => {
		return user.room === room && user.username === username
	})
	// validate username
	if (existingUser) {
		return {
			error: 'Username in use'
		}
	}

	//store user
	const user = { id, username, room }
	users.push(user)
	return { user }

}
const removeUser = (id) => {
	const ix = users.findIndex( (user) => user.id === id)
	if (ix !== -1) {
		return users.splice(ix, 1)[0] //splices users and returns user that was deleted
	}
}
const getUser = (id) => {
	return users.find( (user) => user.id === id)
}
const getUsersInRoom = (room) => {
	return users.filter( (user) => user.room === room)
}


module.exports = { addUser, removeUser, getUser, getUsersInRoom } 