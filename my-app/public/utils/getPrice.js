

export function getRandomGoldPrice() {
  const basePrice = 1850; // base price per ounce in USD
  const fluctuation = Math.random() * 100 - 50; // simulate ±$50 variation
  return (basePrice + fluctuation).toFixed(2);
}