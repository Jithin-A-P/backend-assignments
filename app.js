const http = require('http')


const server = http.createServer((req, res) => {
    console.log(req.url)
    res.writeHead(200)
    res.end("Hello world")
})

server.listen(3000, () => {
    console.log('Started is listening to port 3000')
})

