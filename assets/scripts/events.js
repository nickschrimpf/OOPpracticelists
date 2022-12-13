// const theButton = document.getElementById('theButton')
// const theSecondButton = document.getElementById('theSecondButton')
const circle = document.getElementById('circle');
const allButtons = document.querySelectorAll('button');

const theButtonClickHandler = (e)=>{
    // https://developer.mozilla.org/en-US/docs/Web/API/Event
    console.log(e)
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    console.log(e.target)
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles
    console.log(e.bubbles)
   
    // e.target.disabled = true;
};
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// The addEventListener() method of the EventTarget interface sets up a function that
// will be called whenever the specified event is delivered to the target.

// theButton.addEventListener('click',theButtonClickHandler)
// theSecondButton.addEventListener('click',theButtonClickHandler)

allButtons.forEach(btn => {
    btn.addEventListener('click',theButtonClickHandler)
});

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
// The removeEventListener() method of the EventTarget interface removes an event listener 
// previously registered with EventTarget.addEventListener() from the target. The event listener 
// to be removed is identified using a combination of the event type, the event listener function
// itself, and various optional options that may affect the matching process; see Matching event 
// listeners for removal.

// useCapture *Optional - interesting not sure what a capture listener is yet
// A boolean value that specifies whether the event listener to be removed is registered as 
// a capturing listener or not. If this parameter is absent, the default value false is assumed.

// ***REMOVING AN EVENT LISTENER YOU HAVE TO PASS IN THE EXACT SAME REFERENCE OBJECT***
// USEING AN ARROW FUNCTION WILL NOT WORK BECAUSE THEY ARE 2 DIFFERENT REFFERENCE OBJECTS

// theButton.addEventListener('drag',()=>{
//     console.log('this will be very difficault to remove later')
// })
// theButton.removeEventListener('drag',()=>{
//     console.log('This wont work!')
// })
// EVERY TIME WE BIND TO THIS WE WILL ALSO CREATE A NEW REFERENCE OBJECT
// theButton.addEventListener('click',theButtonClickHandler.bind(this))
// ***THIS WONT WORK***
// theButton.removeEventListener('click',theButtonClickHandler.bind(this))
// BUT WE COULD CREATE A FUNCTION THAT WOULD BIND THE FUNCITON TO THIS

// const boundFn = theButtonClickHandler.bind(this)
// theButton.addEventListener('click',boundFn)
//  ***THIS will WORK***
// theButton.removeEventListener('click',boundFn)

// setTimeout(()=> {
//     console.log('the event listener was removed')
//     theButton.removeEventListener('click',theButtonClickHandler)
// },5000)

// https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event
// The mouseenter event is fired at an Element when a pointing device (usually a mouse)
// is initially moved so that its hotspot is within the element at which the event was fired.

circle.addEventListener('mouseenter',theButtonClickHandler)
