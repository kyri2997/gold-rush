import http from 'node:http'
import path from "node:path"
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url"
import { getRandomGoldPrice } from './utils/getPrice.js'
import { serveStatic } from './utils/serveStatic.js'
import { getData } from './utils/getData.js'


const PORT = 8000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logPath = path.join(__dirname, 'log.txt');
fs.truncate(logPath, 0)

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
    
} else if (req.url === "/log") {
    if (req.method === "POST") {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const logLine = JSON.stringify(data) + '\\n';
                await fs.appendFile("log.txt", logLine, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', error: err.message }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'method not allowed' }));
    }

} else {
    return await serveStatic(req, res, __dirname)
}
})

server.listen(PORT, ()=> {
    console.log(`Connected to Port: ${PORT}`)
})