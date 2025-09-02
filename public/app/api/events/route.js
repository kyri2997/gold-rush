export async function GET() {
    console.log("🔌 [SSE] Client connected")

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      function send(price) {
        const payload = `data: ${JSON.stringify({ event: "price-updated", price })}\n\n`
        console.log("📤 [SSE] Sending:", payload.trim())

        controller.enqueue(
          encoder.encode(encoder.encode(payload))
        )
      }

      // send initial price
      send((1800 + Math.random() * 50).toFixed(2))

      // update every 2s
      const interval = setInterval(() => {
        send((1800 + Math.random() * 50).toFixed(2))
      }, 2000)

      // clean up when client disconnects
      controller.close = () => {
        console.log("❌ [SSE] Client disconnected")
        clearInterval(interval)}
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
