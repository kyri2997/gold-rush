import http from 'node:http'
import path from "node:path"
import { fileURLToPath } from "node:url"
import { getRandomGoldPrice } from './utils/getPrice.js'
import { serveStatic } from './utils/serveStatic.js'


const PORT = 8000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http.createServer(async(req, res)=> {
     if (req.url === '/events') {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });

        const interval = setInterval(()=>{
            const currentPrice = getRandomGoldPrice()
            res.write(
            `data: ${JSON.stringify({ 
                event:"price-updated",
                price: currentPrice})}\n\n`
            )
    
        }, 2000)

    req.on("close", () =>{
        clearInterval(interval)
    }) 
} else {
    return await serveStatic(req, res, __dirname)
}
})

server.listen(PORT, ()=> {
    console.log(`Connected to Port: ${PORT}`)
})