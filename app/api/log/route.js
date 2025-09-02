export async function POST(request) {
  try {
    const data = await request.json()

    // ⚠️ On Vercel, you can’t append to local files.
    // You’ll need a DB or an external logging service.
    console.log("Log entry:", data)

    return Response.json({ status: "ok" })
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
