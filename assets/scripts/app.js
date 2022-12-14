class DOMHelper{
    static clearEventListener(element){
        // TAKE AN ELEMENT AND CLEAR ALL EVENT LISTENERS BY CLONEING THE ELEMENT
        //  AND RETURNING THE CLONED ELEMENT 
        const clonedElement = element.cloneNode(element);
        element.replaceWith(clonedElement);
        return clonedElement
    };
    static moveElement(elementId, newDestinationSelector){
        // GET THE ELEMENT FROM THE DOM
        const element = document.getElementById(elementId);
        // GET THE NEW DESITINATION LIST FROM THE DOM
        const newDestionation = document.querySelector(newDestinationSelector);
        // APPEND THE EXISTING ELEMENT TO THE NEW DESTINATION WILL MOVE THE ELEMENT 
        newDestionation.append(element);
        // MAKING SURE THE RECENTLY MOVED ELEMENT IS IN VIEW TO THE USER
        element.scrollIntoView({behavior:"smooth"});
    };
};
// PROTO TYPE CLASS RESPONSABLE FOR MANAGING THE TOOL TIPS
class Component{
    constructor(hostElementId,insertBefore = false){
        if(hostElementId){
            this.hostElement = document.getElementById(hostElementId);
        }else{
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore
    }
    // WHEN A TOOL TIP IS CLICK WE REMOVE IT BY CALLLING THIS FROM A SUB CLASS
    detachToolTipElement(){
        if(this.element){
            this.element.remove()
            // OLDER BROWSERS WOULD REQUIRE 
            // this.element.parentElement.removeChild(this.element)
        }
    }
    // ATTACH A TOOL TIP TO THE DOM AND DEPENDING ON WHAT IS PASSED TO
    // SUPER OF THE SUB CLASS WE INSERT BEFORE OR AFTER 
    attachToolTipElement(){
        console.log(this.hostElement)
        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'afterBegin':'beforeEnd',
            this.element
        );
    };
};
// USING INHERITENCE BY EXTENDING THE COMPONENT CLASS
class Tooltip extends Component {
    constructor(closeNotificationFn,message,id){
        super(id);
        this.id = id;
        this.message = message;
        this.closeNotifier = closeNotificationFn;
        this.createToolTip();
       
    }
    // FIELD SYNTAX USING AN ARROW FUNCITON SO WE DO NOT HAVE TO BIND TO THIS
    // ARROW FUNCTIONS WILL NOT REFER TO WHAT CALLED IT AS THIS 
    // THIS FUNCTION WILL BE REPRODUCED FOR EVERY INSTANCE OF TOOL TIP MAY LEAD TO PROFORMANCE ISSUSE
    // BUT THIS APP IS SMALL AND THIS WILL BE A GREAT USE CASE FOR A FIELD SYNTAX 
    closeToolTip = () =>{
        this.detachToolTipElement();
        this.closeNotifier();
    }

    createToolTip(){
        // CREATE DIV FOR THE NEW TOOL TIP
        const tooltipElement = document.createElement('div');
        // GIVE IT A className OF CARD FOR SOME CSS 
        tooltipElement.className = 'card';
        // GET THE TOOLTIP TEMPLATE IN THE HTML PAGE
        const toolTipTemplate = document.getElementById('tooltip');
        // IMPORT NODE WILL CREATE A NEW NODE BASED ON THE TEMPLATE IN THE HTML
        // https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode
        const tooltipBody = document.importNode(toolTipTemplate.content,true);
        // SETTING THE DOM MESSAGE FROM THE CONSTRUCTOR 
        tooltipBody.querySelector('p').textContent = this.message;
        // tooltipElement.textContent = this.message;
        tooltipElement.append(tooltipBody)


        // GET THE LEFT AND TOP OF THE HOSTELEMENT WHEN WE CREATE A TOOLTIP
        // hostElemement COMES FROM THE COMPONENT CLASS WHEN EACH INSTANCE IS CREATED
        const hostElementLeft = this.hostElement.offsetLeft;
        const hostElementTop = this.hostElement.offsetTop;
        // GET CLIENT HIEGHT
        const hostElementHeight = this.hostElement.clientHeight;

        // USING SCROLLTOP TO DETERIME HOW FAR WE HAVE SCROLLED
        // THE ELEMENT FROM THE TOP OF ITS PARENT
        const parentElementScrolling = this.hostElement.parentElement.scrollTop;
        console.log(parentElementScrolling)
        // getBoundingClientRect IS HANDY FOR GETTING AN ELEMENTS LOCATION
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        console.log(this.hostElement.getBoundingClientRect());
        // CREATING A POSITION FOR THE TOOL TIP 
        const x  = hostElementLeft + 20;
        const y = hostElementTop + hostElementHeight - parentElementScrolling - 10;
        // SETTING STYLE PROPERTIES ON WHERE TO RENDER THE TOOL TIP
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x+'px';
        tooltipElement.style.top = y+'px';

        // ADDING THE EVENT LISTNER TO THE TOOLTIP FOR CLOSE
        tooltipElement.addEventListener('click',this.closeToolTip);
        // SETTING THIS ELEMENT
        this.element = tooltipElement;
        console.log('tool tip ....');
        // CALLING THE INHERITED ATTACH TOOL TIP METHOD FROM THE Component CLASS
        this.attachToolTipElement();
    }
};
class ProjectItem{
    // KEEPING TRACK OF EACH ITEMS TOOLTIP SO WE ONLY SHOW ONE AT A TIME
    hasActiveToolTip = false;
    constructor( id, updateProjectListFunction, type){
        // THE ITEMS ID WHEN CREATED BY THE LISTS 
        this.id = id;
        // SETTING LIST TYPE
        this.listType = type;
        // SETTING THE CALL BACK FUNCTION FROM THE PROJECT
        // LIST TO SWITCH THE LIST ITEM IN THE PROJECT LISTS
        // SET ON THE ITEM BY THE LIST WHEN THE ITME IS CREATED
        this.updateProjectListsHandler = updateProjectListFunction;

        // CONNECTING THE BUTTONS IN THEIR OWN METHODS TO KEEP CONSTRUCTOR LEAN
        this.connectSwitchButton(this.listType);
        this.connectMoreInfoButton();
        this.connectDrag()
    };

    update(newUpdateProjectListFn,type){
        // UPDATING THE CALLBACK AFTER THE LISTITEM HAS MOVED
        this.updateProjectListsHandler = newUpdateProjectListFn;
        // RECONNECTING THE BUTTON HERE WILL CLEAR OLD EVENT LISTENERS
        // ALLOWING THEM TO BE GARBAGE COLLECTED AND ADD NEW EVENT LISTENERS
        this.connectSwitchButton(type);
    };
    connectSwitchButton(type){
        // GET PROJECT ELEMENT
        const projectItemElement = document.getElementById(this.id);
        // GET THE BUTTON EITHER FINISH OR ACTIVE TO SWITCH THE PROJECT 
        let switchButton = projectItemElement.querySelector('button:last-of-type');
        // CLEAR ANY EXITING EVENT LISTENTERS ON THE BUTTON BY CALLING DOMHelper.clearEventListener
        switchButton = DOMHelper.clearEventListener(switchButton);
        console.log(type)
        switchButton.textContent = type === 'active' ? 'Finished' : 'Activate';
        // ADD EVENT LISTENER TO SWITCH BUTTON THIS IS THE SWITCH PROJECT CALLBACK FUNCTION
        switchButton.addEventListener(
            'click',
            this.updateProjectListsHandler.bind(null,this.id)
        );
    };
    showMoreInfoHandler(){
        // CHECK IF THERE IS AN EXISTING TOOLTIP BEING SHOWN FOR THIS ITEM
        if(this.hasActiveToolTip){
            return;
        };
        // GET THE ELEMENT OF THE PROJECT
        const projectElement = document.getElementById(this.id)
        const tooltipMessage = projectElement.dataset.extraInfo
        // IF THERE IS NOT AN EXISTING TOOLTIP CREATE A NEW TOOL TIP WITH CALL BACK FUNCTION
        const tooltip = new Tooltip(
            () => this.hasActiveToolTip = false,
            tooltipMessage,
            this.id
        );
        this.hasActiveToolTip = true;
    }
    // ADD TOOL TIP
    connectMoreInfoButton(){
        // GET PROJECT ELEMENT
        const projectItemElement = document.getElementById(this.id);
        let infoButton = projectItemElement.querySelector('button:first-of-type');
        infoButton = DOMHelper.clearEventListener(infoButton);

        infoButton.addEventListener('click',
            this.showMoreInfoHandler.bind(this)
        );
    };
    // SETTING UP DRAG EVENT LISTENERS FOR THE ELEMENTS IN OUR LIST
    // DataTransfer
    // The DataTransfer object is used to hold the data that is being dragged during a drag and drop operation. 
    // It may hold one or more data items, each of one or more data types. For more information about drag and drop, 
    // see HTML Drag and Drop API.
    connectDrag(){
        document.getElementById(this.id).addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain',this.id);
            event.dataTransfer.effectAllowed = "move";

            console.log(event)
    // DataTransfer.setData()
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
    // The DataTransfer.setData() method sets the drag operation's drag data to the
    // specified data and type. If data for the given type does not exist, it is added 
    // at the end of the drag data store, such that the last item in the types list will be
    // the new type. If data for the given type already exists, the existing data is replaced
    // in the same position. That is, the order of the types list is not changed when replacing
    // data of the same type.
        });
    };
};
class projectList{
    // LIST OF CURRENT PROJECTS 
    projects = [];
    // CREATING A LIST WE NEED A TYPE
    constructor(listType){
        this.listType = listType;
        // GETTING EACH DOM NODE IN EACH LIST TYPE
        const listItems = document.querySelectorAll(`#${listType}-projects li`);
        // FOR EACH NODE CREATE A ProjectItem WITH ID AND A SWITCH HANDLER FUNCTION
        // TO BE USED ON CLICK WHEN WE NEED TO SWITCH PROJECTS FROM ONE LIST TO
        // ANOTHER BINDING THE FUNCTION TO THIS LIST
        for(const item of listItems){
            this.projects.push(  
                new ProjectItem(item.id, this.switchProject.bind(this),this.listType)
            );
        }
        console.log(this.projects)
        
        this.connectDropZone()
    }
    // SETTING THE ADD PROJECT CALL BACK TO THE OTHER LIST INSTANCE
    setSwitchHanderFunction(switchHanderFunction){
        this.switchHandler = switchHanderFunction;
        // console.log(this.switchHandler)
    }
    connectDropZone(){
        const dropZone = document.querySelector(`#${this.listType}-projects ul`);
        console.log(dropZone)
        dropZone.addEventListener('dragenter',e => {
            if(e.dataTransfer.types[0] === 'text/plain'){
                dropZone.parentElement.classList.add('droppable');
                e.preventDefault();
            }
           
        });
      
        dropZone.addEventListener('dragover',e => {
            if(e.dataTransfer.types[0] === 'text/plain'){
                console.log(e);
                e.preventDefault();
                e.target.closest('li')
            }
        });
        dropZone.addEventListener('dragleave',e => {
            if(e.relatedTarget.closest(`#${this.listType}-projects ul`) !== dropZone){
                dropZone.parentElement.classList.remove('droppable')
            }
        });
     
        dropZone.addEventListener('drop',e => {
            if(e.dataTransfer.types[0] === 'text/plain'){
                const projId = e.dataTransfer.getData('text/plain');
                if(this.projects.find(p => p.id === projId)){
                    return;
                };
                document.getElementById(projId).lastElementChild.click()
            }   
          
        });
    };
    // CALLBACK FUNCTION CALLED FROM THE OTHER LIST INSTANCE
    addProject(project){
        // PUSHING IN THE ProjectItem FROM THE OTHER LIST
      this.projects.push(project);
        // DOMHelper WILL MOVE THE PROJECT FROM LIST TO LIST
      DOMHelper.moveElement(project.id,`#${this.listType}-projects ul`);
        // THE PROJECT WILL NEED TO UPDATE THE TYPE OF BUTTON
      project.update(this.switchProject.bind(this),this.listType)
    }
    
    // CALLBACK FUNCITON FROM PROJECT ITEM TO REMOVE A PROJECT FROM ONE LIST TYPE AND ADD TO ANOTHER
    switchProject(projectId){
        // const pjtidx = this.project.findIndex(p => p.id === id)
        // this.projects.splice(idx,1)
        console.log(projectId)
        // console.log(this.projects.find(p => p.id === projectId))
        this.switchHandler(this.projects.find(p => p.id === projectId))
        this.projects = this.projects.filter(p => p.id !== projectId)
    }
}
class App{
    static init(){
       
        // CREATING A NEW LIST A NEW "ACTIVE" AND "FINISHED" PROJECT LIST TYPES
        const activeList = new projectList('active');
        const finishedList = new projectList('finished');

        
        // SETTING THE CALL BACK FUNCTION FOR LATER USE WHEN A USER CLICKS A BUTTON 
        // THE CALL BACK FUNCTION FROM ONE LIST IS BOUND TO ITSELF SO WHEN ITS CALLED
        //  THIS IS ITS OWN LIST
        activeList.setSwitchHanderFunction(
            finishedList.addProject.bind(finishedList)
        );
        finishedList.setSwitchHanderFunction(
            activeList.addProject.bind(activeList)
        );
        // STARTING ANALYTICS AFTER 3000MS OR 3SECS
        // https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
        // const startAnalyticsTimerId = setTimeout(this.startAnalytics,3000);
        
        document.getElementById('stop-analytics-btn').addEventListener('click',()=> clearTimeout(startAnalyticsTimerId));
    };
    // LOADING SCRIPTS DYNAMICALLY 
    static startAnalytics(){
        const analyticsScript = document.createElement('script');
        analyticsScript.src = 'assets/scripts/analytics.js';
        analyticsScript.defer = true;
        document.head.append(analyticsScript)
    };
};

App.init();