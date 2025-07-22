
const eventSource = new EventSource("/events")

const trackerStatus = true
const priceDisplayEl = document.getElementById("price-display")
const connectionStatusEl = document.getElementById("connection-status")
const investBtn = document.getElementById("invest-btn")
const closeBtn = document.getElementById("close-btn")
const dialogBoxEl = document.getElementById("dialog-box")
const investedAmount = document.getElementById("investment-amount")
const investmentSummary = document.getElementById("investment-summary")


let currentPrice = 0

if(trackerStatus){
    
    connectionStatusEl.textContent=`Live Price 🟢`
    eventSource.onmessage = (event) =>{
        const data = JSON.parse(event.data)
        currentPrice = data.price
        priceDisplayEl.textContent= currentPrice
    }
    
    eventSource.onerror = () => {
        console.log('Connection failed...')
    }
} else {
    connectionStatusEl.textContent=`Disconnected 🔴`
}

function goldCalc(){
    let result = 0
    result = investedAmount.value / currentPrice
    return result.toFixed(2)
}

function buyGold(event){
    event.preventDefault()
    console.log(currentPrice)
    dialogBoxEl.showModal()
    investmentSummary.innerHTML=`
     <p>You just bought ${goldCalc()}oz of gold for £${investedAmount.value}. \n You will receive documentation shortly.</p>`
}
function closeModal(event){
    event.preventDefault()
    dialogBoxEl.close()
    investedAmount.value=""
}

investBtn.addEventListener("click", buyGold)
closeBtn.addEventListener("click", closeModal)
