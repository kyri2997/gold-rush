export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      function send(price) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ price })}\n\n`)
        )
      }

      // send initial price
      send((1800 + Math.random() * 50).toFixed(2))

      // update every 2s
      const interval = setInterval(() => {
        send((1800 + Math.random() * 50).toFixed(2))
      }, 2000)

      // clean up when client disconnects
      controller.close = () => clearInterval(interval)
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
