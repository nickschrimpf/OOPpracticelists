class DOMHelper{
    static clearEventListener(element){
        // TAKE AN ELEMENT AND CLEAR ALL EVENT LISTENERS BY CLONEING THE ELEMENT
        //  AND RETURNING THE CLONED ELEMENT 
        const clonedElement = element.cloneNode(element);
        element.replaceWith(clonedElement);
        return clonedElement
    };
    static moveElement(elementId, newDestinationSelector){
        console.log(newDestinationSelector)
        const element = document.getElementById(elementId)
        console.log(element)
        const newDestionation = document.querySelector(newDestinationSelector)
        newDestionation.append(element)
    };
};
class Component{
    constructor(hostElement,insertBefore = false){
        if(hostElement){
            this.hostElement = document.getElementById(hostElement);
        }else{
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore
    }
    detachToolTipElement(){
        if(this.element){
            this.element.remove()
        }
    }
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
    constructor(closeNotificationFn,listType){
        console.log(listType)
        super(listType,true);
        this.closeNotifier = closeNotificationFn;
        this.createToolTip();
       
    }
    // FIELD SYNTAX USING AN ARROW FUNCITON SO WE DO NOT HAVE TO BIND TO THIS
    // ARROW FUNCTIONS WILL NOT REFER TO WHAT CALLED IT AS THIS 
    // THIS FUNCTION WILL BE REPRODUCED FOR EVERY INSTANCE OF TOOL TIP MAY LEAD TO PROFORMANCE ISSUSE
    // BUT THIS APP IS SMALL AND THIS WILL BE A GREAT USE CASE FOR A FIELD SYNTAX 
    closeToolTip = () =>{
        this.detachToolTipElement();
        this.closeNotifier()
    }

    createToolTip(){
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'tool tip yo!';
        tooltipElement.addEventListener('click',this.closeToolTip);
        this.element = tooltipElement;
        console.log('tool tip ....');
        this.attachToolTipElement()
    }
};
class ProjectItem{
    // KEEPING TRACK OF EACH ITEMS TOOLTIP SO WE ONLY SHOW ONE AT A TIME
    hasActiveToolTip = false;
    constructor(id,updateProjectListFunction,type){
        // THE ITEMS ID WHEN CREATED BY THE LISTS 
        this.id = id;
        // SETTING LIST TYPE
        this.listType = type
        // SETTING THE CALL BACK FUNCTION FROM THE PROJECT
        // LIST TO SWITCH THE LIST ITEM IN THE PROJECT LISTS
        // SET ON THE ITEM BY THE LIST WHEN THE ITME IS CREATED
        this.updateProjectListsHandler = updateProjectListFunction;
        // CONNECTING THE BUTTONS IN THEIR OWN METHODS TO KEEP CONSTRUCTOR LEAN
        this.connectSwitchButton(this.listType);
        this.connectMoreInfoButton();
        // console.log(updateProjectListFunction)
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
    showMoreInfoHandler(type){
        console.log(type)
        // CHECK IF THERE IS AN EXISTING TOOLTIP BEING SHOWN FOR THIS ITEM
        if(this.hasActiveToolTip){
            return;
        };
        // IF THERE IS NOT AN EXISTING TOOLTIP CREATE A NEW TOOL TIP WITH CALL BACK FUNCTION
        const tooltip = new Tooltip(() => this.hasActiveToolTip = false,`${type}-projects`);
        
        this.hasActiveToolTip = true;
    }
    // ADD TOOL TIP
    connectMoreInfoButton(){
        // GET PROJECT ELEMENT
        const projectItemElement = document.getElementById(this.id);
        let infoButton = projectItemElement.querySelector('button:first-of-type');
        infoButton = DOMHelper.clearEventListener(infoButton);

        infoButton.addEventListener('click',
            this.showMoreInfoHandler.bind(this,this.listType)
        );
    }
}
class projectList{
    // LIST OF CURRENT PROJECTS 
    projects = [];
    // CREATING A LIST WE NEED A TYPE
    constructor(listType){
        this.listType = listType
        // GETTING EACH DOM NODE IN EACH LIST TYPE
        const listItems = document.querySelectorAll(`#${listType}-projects li`);
        // console.log(listItems)

        // FOR EACH NODE CREATE A ProjectItem WITH ID AND A SWITCH HANDLER FUNCTION
        // TO BE USED ON CLICK WHEN WE NEED TO SWITCH PROJECTS FROM ONE LIST TO
        // ANOTHER BINDING THE FUNCTION TO THIS LIST
        // ***WHEN THIS SWITCH PROJECT GET CALLED WE ARE GETING A POINTER EVENT NOT A CLICK
        for(const item of listItems){
            // console.log(item)
            // console.log("this")
            // console.log(this)

            this.projects.push(
                
                new ProjectItem(item.id, this.switchProject.bind(this),this.listType)
            );
        }
        console.log('projects!')
        console.log(this.projects)
    }
    // SETTING THE ADD PROJECT CALL BACK TO THE OTHER LIST INSTANCE
    setSwitchHanderFunction(switchHanderFunction){
        this.switchHandler = switchHanderFunction;
        // console.log(this.switchHandler)
    }

    // CALLBACK FUNCTION CALLED FROM THE OTHER LIST INSTANCE
    addProject(project){
        // console.log(this)
        // console.log(project)
        // PUSHING IN THE ProjectItem FROM THE OTHER LIST
      this.projects.push(project);
        // DOMHelper WILL MOVE THE PROJECT FROM LIST TO LIST
      DOMHelper.moveElement(project.id,`#${this.listType}-projects ul`);
        // THE PROJECT WILL NEED TO UPDATE THE TYPE OF BUTTON
        console.log(this.listType)
      project.update(this.switchProject.bind(this),this.listType)
    }
    
    // CALLBACK FUNCITON FROM PROJECT ITEM TO REMOVE A PROJECT FROM ONE LIST TYPE AND ADD TO ANOTHER
    switchProject(projectId){
        // console.log('switch project click handler this')
        // console.log(this)
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
    };
};

App.init();