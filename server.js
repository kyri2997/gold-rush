import http from 'node:http'
import path from "node:path"
import { fileURLToPath } from "node:url"

import { serveStatic } from './utils/serveStatic.js'


const PORT = 8000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http.createServer(async(req, res)=> {

    return await serveStatic(req, res, __dirname)

})

server.listen(PORT, ()=> {
    console.log(`Connected to Port: ${PORT}`)
})