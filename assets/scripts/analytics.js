(() => {
    // https://developer.mozilla.org/en-US/docs/Glossary/Self-Executing_Anonymous_Function
    console.log("this is a self invoking function")

    // https://developer.mozilla.org/en-US/docs/Web/API/Location
    // YOU CAN CHANGE A USERS LOCATION AS WELL AS GET INFORMTAION
    // ABOUT WHERE THEY ARE NOW IN THE BROWSER URL WISE!
    console.log(location)

    // https://developer.mozilla.org/en-US/docs/Web/API/History_API
    // FINDOUT WHERE A USER HAS BEEN MOVE THEM BACK OR FORWARD AND GO()
    console.log(history)
    // USING NAVIGATOR TO LOG USERS CURRENT LOCATION
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator
    navigator.geolocation.getCurrentPosition((data)=>{
        console.log(data)
        console.log(navigator.onLine)
    })
})()

const analyticsLogger = setInterval(()=>console.log('sending analytic data...'),2000)

document.getElementById('stop-analytics-btn').addEventListener('click',() => clearInterval(analyticsLogger))

