// code away!
const express = require("express")
const usersRouter = require('./users/userRouter')
const logger = require('./logger')

const server = express()

server.use(express.json())

server.use(logger())

server.use('/users', usersRouter)

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong"
	})
})

server.listen(5000, () => {
    console.log("Server available on port 5000")
})