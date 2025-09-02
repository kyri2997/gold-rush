// app/not-found.js

import Image from "next/image"

export const metadata = {
  title: "Page Not Found | GoldDigger",
  description: "GoldDigger - Invest in gold with ease. Get live prices and make informed decisions.",
}

export default function NotFound() {
  return (
    <main>
      <h1 className="title">GoldDigger</h1>
      <Image src="/gold.png" alt="gold bars and nuggets" width={300} height={200} />
      <section className="price-info-container">
        <h2>404 - No gold here!</h2>
      </section>
    </main>
  )
}
