const theButton = document.getElementById('theButton')
// const theSecondButton = document.getElementById('theSecondButton')
const circle = document.getElementById('circle');
// const allButtons = document.querySelectorAll('button');

const theDiv = document.querySelector('div')

const theButtonClickHandler = (e)=>{
    // https://developer.mozilla.org/en-US/docs/Web/API/Event
    console.log(e)
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    console.log(e.target)
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles
    // DOES THIS EVENT PROPIGATE DOES IT BUBBLE UP TO ANCSESTORS
    console.log(e.bubbles)
   
    // e.target.disabled = true;
};
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// The addEventListener() method of the EventTarget interface sets up a function that
// will be called whenever the specified event is delivered to the target.

// theButton.addEventListener('click',theButtonClickHandler)
// theSecondButton.addEventListener('click',theButtonClickHandler)

// allButtons.forEach(btn => {
//     btn.addEventListener('click',theButtonClickHandler)
// });

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
// The removeEventListener() method of the EventTarget interface removes an event listener 
// previously registered with EventTarget.addEventListener() from the target. The event listener 
// to be removed is identified using a combination of the event type, the event listener function
// itself, and various optional options that may affect the matching process; see Matching event 
// listeners for removal.

// useCapture *Optional 
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

// https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
// USE THIS FOR AN INFANATE SCROLL FEELING BUT CAN BE VERY COSTLY PROFORMANCE WISE
// window.addEventListener('scroll',(eventObject)=>{
//     const scrollPos = window.scrollY;
//     if(scrollPos > 300){
//         console.log(`fired at ${scrollPos}`)
//     }
    // console.log(eventObject)
// })

// THIS APPROCH ** WONT ** WORK WE NEED AN EVENT LISTENER
// TO LISTEN FOR THE SCROLL EVENT
// const scrollPos = window.scrollY;
// if(scrollPos === 500){
//     console.log('fired at 500px')
// }

// IMPLEMENTING A BASIC INFANATE SCROLLING EFFECT
let curElementNumber = 0;
 
function scrollHandler(e) {
    
    // MESSURE THE TOTAL DISTANACE BETWEEN OUR VIEW PORT AND THE END OF 
    // THE PAGE (NOT JUST THE END OF OUR CURRENTLY VISAIBLE AREA)
    const distanceToBottom = document.body.getBoundingClientRect().bottom;
    //  IF THE DISTANCE TO THE BOTTOM IS LESS THEN THE OVERALL HEIGHT OF THE DOCUMENT + 165PX
    if (distanceToBottom < document.documentElement.clientHeight + 165) {
        // ONCE THE DISTANCE TO THE BOTTOM IS LESS THEN THE OVERALL CONTENT HIGHT
        // WE CREATE AN ELEMENT PER EVENT ALLOWING FOR THE INFINATE SCROLLING EFFECT
        const newDataElement = document.createElement('div');
        curElementNumber++;
        newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
        document.body.append(newDataElement);
    }
}
 
window.addEventListener('scroll', scrollHandler);

// SUBMIT EVENT LISTENER ON A FORM! building blocks for ngSubmit?
// https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent/SubmitEvent

const thisForm = document.querySelector('form')
thisForm.addEventListener('submit',(e)=>{
    // Event.preventDefault()
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    // The preventDefault() method of the Event interface tells the user agent that if
    // the event does not get explicitly handled, its default action should not be taken as it normally would be.
    e.preventDefault()
    console.log(e)
})
console.log(thisForm)

// PROPIGATION - NOT JUST THE ELEMENT ITSELF BUT ON ANY ANCESTOR
// theDiv.addEventListener('click', event => {
//     console.log('theDiv')
//     console.log(event)
// })
// theButton.addEventListener('click', event => {
//     console.log('theButton')
//     console.log(event)
// })
// STOP PROPIGATON STOP THE CLICK EVENT ON THE BUTTON
// FROM TRIGGERING ON THE DIV
theDiv.addEventListener('click', event => {
    console.log('theDiv')
    console.log(event)
})
theButton.addEventListener('click', event => {
    event.stopPropagation()
    console.log('theButton')
    console.log(event)
})
const listItems = document.querySelectorAll('li');
const list = document.querySelector('ul');

// *** NOT USING PROPIGATION *** 
// listItems.forEach(item => {
//     item.addEventListener('click',(event)=> {
//         event.target.classList.toggle('highlight')
//     });
// });

// *** USING PROPIGATION TO ATTACH ONLY ONE EVENT LISTENER TO THE ANCSETOR OF ALL ITEMS
list.addEventListener('click',event => {
    // event.target.classList.toggle('highlight')// THIS WILL CAUSE PROBLEMS WITH MORE COMPLEX LIST ITEMS OR DIVS SEE RESULT HERE
    console.log(event.currentTarget) //REFERS TO THE WHERE THE LISTENER WAS PLACED
    event.target.closest('li').classList.toggle('highlight')
})

// theDiv.addEventListener('click', event => {
//     console.log('theDiv')
//     console.log(event)
// },true)
// useCapture *Optional 
// A boolean value that specifies whether the event listener to be removed is registered as 
// a capturing listener or not. If this parameter is absent, the default value false is assumed.
// THIS WILL REVERSE THE ORDER OF THE PREVIOUS CONSOLE LOGS SO THE DIV WILL LOG FIRST
// INSTEAD OF BUBBLING THIS WILL RUN IN THE CAPTURING PHASE INSTEAD OF BUBBLING
// theButton.addEventListener('click', event => {
//     console.log('theButton')
//     console.log(event)
// })