"use client"
import { useState, useEffect, useRef } from "react"

export default function HomePage() {
  const [price, setPrice] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState("Disconnected 🔴")
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [goldBought, setGoldBought] = useState(0)
  const dialogRef = useRef(null)

  // SSE connection
  useEffect(() => {
    const es = new EventSource("/api/events")
    es.onopen = () => {
      // console.log("✅ [SSE] Connection opened")
      setConnectionStatus("Live Price 🟢")
    }
    es.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setPrice(Number(data.price))
    }
    es.onerror = () => {
      console.log("❌ Connection failed...")
      setConnectionStatus("Disconnected 🔴")
    }
    return () => es.close()
  }, [])

  // Calculate gold based on input
  const goldCalc = (amount) => {
    if (!price || price <= 0) return 0
    const amt = parseFloat(amount) || 0
    return (amt / price).toFixed(2)
  }

  // Handle form submission
  const handleBuyGold = async (e) => {
    e.preventDefault()
    const amount = parseFloat(investmentAmount) || 0
    const gold = goldCalc(amount)
    setGoldBought(gold)

    const data = {
      date: new Date(),
      "amount paid": amount,
      "price per oz": price,
      "gold sold": gold,
    }

    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch (err) {
      console.error("Error logging purchase:", err)
    }

    dialogRef.current.showModal()
  }

  const closeDialog = () => {
    dialogRef.current.close()
    setInvestmentAmount("")
  }

  return (
    <main>
      <h1 className="title">Gold Rush</h1>
      <img src="/gold.png" alt="gold bars and nuggets" />
      <section className="price-info-container">
        <p>
          £
          <span className="price" aria-live="assertive">
            {price.toFixed(2) || "----.--"}
          </span>{" "}
          / Oz*
        </p>
        <p className="status" aria-live="polite">
          {connectionStatus}
        </p>
      </section>

      <form onSubmit={handleBuyGold}>
        <label htmlFor="investment-amount">Amount to invest</label>
        <div className="input-container">
          <div className="currency">£</div>
          <input
            type="number"
            id="investment-amount"
            placeholder="100.00"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            required
          />
        </div>
        <button className="invest-btn" aria-label="Invest in gold now">
          Invest Now!
        </button>
      </form>

      <dialog
        ref={dialogRef}
        className="outputs"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby="investment-summary"
        lang="en"
      >
        <h2>Summary</h2>
        <p id="investment-summary">
          You just bought {goldBought} oz of gold for £{investmentAmount}. <br /> You
          will receive documentation shortly.
        </p>
        <button aria-label="Close dialog" onClick={closeDialog} autoFocus>
          OK
        </button>
      </dialog>

      <p className="footnote">* 1oz = 1 troy ounce of 24 Carat Gold</p>
    </main>
  )
}
