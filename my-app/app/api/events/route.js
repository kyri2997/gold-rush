export async function GET() {
  console.log("🔌 [SSE] Client connected")

  let interval

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      function send(price) {
        const payload = `data: ${JSON.stringify({ event: "price-updated", price })}\n\n`
        
        controller.enqueue(encoder.encode(payload))
      }

      // initial price
      send((1800 + Math.random() * 50).toFixed(2))

      // send every 2s
      interval = setInterval(() => {
        send((1800 + Math.random() * 50).toFixed(2))
      }, 2000)
    },

    cancel(reason) {
      // called automatically if client disconnects
      console.log("❌ [SSE] Client disconnected", reason)
      clearInterval(interval)
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
