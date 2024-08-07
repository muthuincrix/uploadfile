const http = require('http');
const fs = require('fs')

let port = 3022

http.createServer((req, response) => {
  /**
   * `/` loads index.html
   */
    if (req.url == '/load' && req.method.toLowerCase() == 'get') {
    setTimeout(() =>{
   response.end("<html><body><h1>Page Doesn't exist<h1></body></html>")
},52000)
 
  } 
  else if (req.url == '/' && req.method.toLowerCase() == 'get') {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader('Content-Type', 'text/html')
    const stream = fs.createReadStream(`${__dirname}/zindex.html`)
    // No need to call res.end() because pipe calls it automatically
    console.log(stream);
    stream.pipe(response)
  } 
  /**
   * `/fileUpload` only works with POST
   * Saves uploaded files to the root
   */


  /**
   * `/fileUpload` only works with POST
   * Saves uploaded files to the root
   */
  else if (req.url == '/fileUpload' && req.method.toLowerCase() == 'post') {

    response.setHeader('Content-Type', 'application/json')
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    let contentLength = parseInt(req.headers['content-length'])
    if (isNaN(contentLength) || contentLength <= 0 ) {
      response.statusCode = 411;
      response.end(JSON.stringify({status: "error", description: "No File"}))
      return
    }

    // Try to use the original filename
    let filename = req.headers['filename']
    if (filename == null) {
      filename = "file." + req.headers['content-type'].split('/')[1]
    }

    const filestream = fs.createWriteStream(`${__dirname}/${filename}`)

    filestream.on("error", (error) => {
      console.error(error)
      response.statusCode = 400;
      response.write(JSON.stringify({status: "error", description: error}))
      response.end()
    })

    // Write data as it comes
    req.pipe(filestream)

    req.on('end', () => {
      filestream.close(() => {
        response.end(JSON.stringify({status: "success"}))
      })
    })
  } 
  /**
   * Error on any other path
   */
  else {
    response.setHeader('Content-Type', 'text/html')
    response.end("<html><body><h1>Page Doesn't exist<h1></body></html>")
  }
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})
