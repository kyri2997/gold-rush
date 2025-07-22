
const eventSource = new EventSource("/events")

const trackerStatus = true
const priceDisplayEl = document.getElementById("price-display")
const connectionStatusEl = document.getElementById("connection-status")
const investForm = document.getElementById("invest-form")
const closeBtn = document.getElementById("close-btn")
const dialogBoxEl = document.getElementById("dialog-box")
const investedAmount = document.getElementById("investment-amount")
const investmentSummary = document.getElementById("investment-summary")


let currentPrice = 0
let data={}

investForm.addEventListener("submit", buyGold)
closeBtn.addEventListener("click", closeModal)

if(trackerStatus){
    
    connectionStatusEl.textContent=`Live Price 🟢`
    eventSource.onmessage = (event) =>{
        data = JSON.parse(event.data)
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
    const newDate = new Date()
    data={
        newDate,
        "amount paid": investedAmount.value,
        "price per oz": currentPrice,
        "gold sold": goldCalc() 
    }
    fetch("/log", {method:"POST", headers:{
        "Content-Type": "application/json"}, body: JSON.stringify(data)
    })
    .then(res=>res.json)
    // .then(result=>)

    dialogBoxEl.showModal()
    investmentSummary.innerHTML=`
     <p>You just bought ${goldCalc()}oz of gold for £${investedAmount.value}. \n You will receive documentation shortly.</p>`
}
function closeModal(event,data){
    event.preventDefault()
    dialogBoxEl.close()
    investedAmount.value=""
    
}


