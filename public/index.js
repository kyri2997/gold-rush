const trackerStatus = false
const priceDisplayEl = document.getElementById("price-display")


function getRandomGoldPrice() {
  const basePrice = 1850; // base price per ounce in USD
  const fluctuation = Math.random() * 100 - 50; // simulate ±$50 variation
  return (basePrice + fluctuation).toFixed(2);
}

function renderGoldPrice(){
    const priceDisplayEl = document.getElementById("price-display")
    console.log(priceDisplayEl)
    // priceDisplayEl.textContent= getRandomGoldPrice()
}