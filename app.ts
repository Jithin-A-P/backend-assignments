import express from 'express'

const server = express()
const PORT = 3000

server.get('/', (req, res) => {
  res.status(200).send(`${req.url} : Hello`)
})

server.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`)
})
