import taskHandler from './taskHandler.js';
import storageHandler from './storageHandler.js';

import completeIcon from './assets/completed.svg';
import removeIcon from './assets/delete.svg';
import editIcon from './assets/edit.svg';

const displayController = (function() {

    const body = document.querySelector('body');
    const newTask = document.getElementById('add-task');

    const showPopup = function (element) {
        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        element.style.transform = 'translateY(100vh)';
        overlay.appendChild(element);
        body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            element.style.transform = '';
        }, 1);
    }


    const hidePopup = function () {
        const overlay = document.getElementById('popup-overlay');
        if (overlay === null) return;
        const element = overlay.firstChild;
        overlay.style.backgroundColor = '';
        element.style.transform = 'scale(0)';

        setTimeout(() => {
            overlay.parentElement.removeChild(overlay);
        }, 300);

    }

    // PRIORITY AND COLOR SELECTORS

    // sets the selected value to the parent button (color or priority)
    const _setSelection = function () {
        const value = this.getAttribute('data-value');
        const selector = this.parentElement;
        const parentButton = selector.parentElement;
        console.log(parentButton)
        parentButton.setAttribute('data-value', value);

        selector.style.transform += 'scale(0.6 ,0)';
        selector.style.opacity = '0.5';

        setTimeout(() => {
            if (parentButton.classList.contains('color')) {
                parentButton.style.backgroundColor = value;
                parentButton.removeChild(selector);
            } else {
                parentButton.removeChild(selector);
                parentButton.textContent = value;
            }
        }, 150);

    }

    // takes an iterable object or array and displays it in a selector
    const _showSelector = function (values, parentButton, colors = false) {

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.bottom = '0';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.className = 'selector';
        container.onclick = (e) => {
            e.stopPropagation();
        }
        
        for (const value in values) {
            const element = document.createElement('button');
 
            element.setAttribute('data-value', values[value]);

            if (colors) {
                element.style.backgroundColor = values[value];
            } else {
                element.textContent = values[value];
            }


            element.onclick = _setSelection;
            container.appendChild(element);
        }

        container.style.transformOrigin = 'bottom';
        container.style.transform += 'scaleY(0)';
        parentButton.replaceChildren(container);
        setTimeout(() => {
            container.style.transform = 'translateX(-50%)';
        }, 1);
    }

    const _showColorSelector = function () {
        const colors = {
            cyan: '#06b6d4',
            red: '#dc2626',
            yellow: '#facc15',
            green: '#84cc16'
        }

        _showSelector(colors, this, true);
    }

    const _showPrioritySelector = function () {
        const priorityValues = ['1', '2', '3', '4', '5'];

        _showSelector(priorityValues, this, false);
    }

    


    const createForm = function(ConfirmButtonName) {
        
        // creating inputs for the task data (title, description, date)
        const form = document.createElement('div');
        form.className = 'form';

        const title = document.createElement('input');
        title.className = 'title';
        title.placeholder = 'title';

        const desc = document.createElement('textarea');
        desc.className = 'desc';
        desc.placeholder = 'Description';

        const bottomContainer = document.createElement('div');
        
        const date = document.createElement('input');
        date.type = 'date';
        date.className = 'date';
        
        const bottomRightContainer = document.createElement('div');


        // creating the priority and color selectors
        const priorityContainer = document.createElement('div');
        const priorityLabel = document.createElement('div');
        priorityLabel.textContent = 'Priority';
        const priority = document.createElement('button');
        priority.className = 'priority';
        priority.style.position = 'relative';
        
        priority.setAttribute('data-value', '4');
        priority.textContent = priority.getAttribute('data-value');
        priority.onclick = _showPrioritySelector;
        priorityContainer.append(priorityLabel, priority);

        const colorContainer = document.createElement('div');
        const colorLabel = document.createElement('div');
        colorLabel.textContent = 'Color';
        const color = document.createElement('button');
        color.className = 'color';

        color.setAttribute('data-value', '#aaaaaa');
        color.style.backgroundColor = color.getAttribute('data-value');
        color.style.position = 'relative';
        color.onclick = _showColorSelector;


        colorContainer.append(colorLabel, color);

        bottomRightContainer.append(priorityContainer, colorContainer);

        bottomContainer.append(date, bottomRightContainer);


        // creating the cancel and confirm buttons
        const buttonContainer = document.createElement('div');
        
        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.className = 'cancel';
        cancel.onclick = hidePopup;

        const confirm = document.createElement('button');
        confirm.textContent = ConfirmButtonName || 'Save';
        confirm.className = 'confirm';
        confirm.onclick = () => {
            confirmTask(title, desc, color, priority, date);
        }

        buttonContainer.append(cancel, confirm);

        form.append(title, desc, bottomContainer, buttonContainer);
        
        
        return form;
    }


    // getting the form inputs to create/edit a task
    function confirmTask (title, desc, color, priority) {
        const task = {
            title: title.value || 'Untitled',
            desc: desc.value || '',
            color: color.getAttribute('data-value'),
            priority: priority.getAttribute('data-value')
        }
        const selectedProject = document.querySelector('.selected-project');
        if (selectedProject === null) return null;

        taskHandler.insertTask(selectedProject.textContent, task);

        viewTasks();
        hidePopup();

    }

    // binding the new task button
    newTask.onclick = () => {
        showPopup(createForm('Add'));
    };


    // SIDEBAR //
    const projectsContainer = document.getElementById('projects');

    // update current projects in storage to the DOM
    const updateProjects = function () {
        const projects = storageHandler.fetchProjects();
        
        let selected = document.querySelector('.selected-project');
        if (selected !== null) selected = selected.textContent;
        projectsContainer.innerHTML = '';

        projects.forEach((pr) => {
            const project = document.createElement('button');
            project.className = 'project';
            
            // keep selection on selected project after reseting projects
            if (selected !== null && pr === selected) {
                project.classList.add('selected-project');
            } 
            project.textContent = pr;
            project.onclick = selectProject;
            projectsContainer.appendChild(project);
        });


        if (selected === null && projects.length > 0) {
            document.querySelectorAll('.project')[0].classList.add('selected-project');
        }
    };

    const taskContainer = document.getElementById('tasks');
    // view tasks of given project on click
    const selectProject = function() {

        removeProjectSelection();
        this.classList.add('selected-project');

        viewTasks();

    }

    function viewTasks () {
        const selectedProject = document.querySelector('.selected-project');
        if (selectedProject === null) {
            taskContainer.innerHTML = '';
            return null;
        }
        const projectTasks = storageHandler.getTasks(selectedProject.textContent);

        taskContainer.innerHTML = '';
        projectTasks.forEach((t) => {
            createTask(t);
        });
    }
    

    const removeProjectSelection = function() {
        const shownProjects = document.querySelectorAll('#projects>button');

        shownProjects.forEach((project) => {
            project.classList.remove('selected-project');
        });
    }


    // create task DOM element
    const createTask = function (task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.style.borderColor = task.color;

        const priorityMultiplier = 100 - 20*task.priority;
        taskElement.style.flexBasis = `${150 + priorityMultiplier}px`;
        taskElement.style.fontSize = `${0.6 + priorityMultiplier/150}rem`;

        const title = document.createElement('p');
        title.className = 'task-title';
        title.textContent = task.title;
        
        const desc = document.createElement('div');
        desc.textContent = task.desc;
        desc.className = 'task-desc';

        const bottomContainer = document.createElement('div');
        bottomContainer.className = 'task-bottom-container';

        const date = document.createElement('div');
        date.textContent = task.date;
        date.className = 'task-date';

        const actionButtons = document.createElement('div');
        actionButtons.className = 'task-buttons';

        const complete = document.createElement('img');
        complete.src = completeIcon;
        complete.alt = 'Complete';

        const edit = document.createElement('img');
        edit.src = editIcon;
        edit.alt = 'Edit';

        const remove = document.createElement('img');
        remove.src = removeIcon;
        remove.alt = 'Remove';

        actionButtons.append(remove, edit, complete);

        bottomContainer.append(date, actionButtons);

        taskElement.append(title, desc, bottomContainer);

        taskContainer.append(taskElement);
    }


    // create new projects from new project button
    const newProject = document.getElementById('new-project');
    newProject.onclick = () => {
        showPopup(createProjectForm());
    }

    function createProject (name) {
        name = String(name);
        if (!name) return;
        storageHandler.newProject(name);
        updateProjects();
    }

    function createProjectForm () {
        const form = document.createElement('div');
        form.className = 'form';
        const name = document.createElement('input');
        name.id = 'new-project-name';
        name.placeholder = 'Project Name';
        
        const confirm = document.createElement('button');
        confirm.className = 'confirm';
        confirm.textContent = 'Add Project';
        confirm.onclick = () => {
            createProject(name.value);
            hidePopup();
        }

        const cancel = document.createElement('button');
        cancel.className = 'cancel';
        cancel.textContent = 'Cancel';
        cancel.onclick = hidePopup;

        form.append(name, confirm, cancel);

        return form;

    }

    // delete project button functionality
    const removeProjectButton = document.getElementById('remove-project');
    removeProjectButton.onclick = removeProjectForm;
    
    function removeProjectForm () {
        const selected = document.querySelector('.selected-project');
        if (selected === null ) return;

        showPopup(createRemoveForm(selected.textContent, removeProject));

    }

    function removeProject () {
        const selectedProject = document.querySelector('.selected-project');
        if (selectedProject === null) return null;

        storageHandler.removeProject(selectedProject.textContent);
        
        updateProjects();
        const currentProjcets = document.querySelectorAll('.project');
        if (currentProjcets.length > 0) {
            currentProjcets[0].classList.add('selected-project');
        }
        viewTasks();
    }
    
    function createRemoveForm (name, func) {
        const form = document.createElement('div');
        form.className = 'form';

        const message = document.createElement('p');
        message.className = 'message';
        message.textContent = `Are you sure you want to remove ${name}?`

        const confirm = document.createElement('button');
        confirm.className = 'confirm';
        confirm.textContent = 'Confirm';
        confirm.onclick = () => {
            func();
            hidePopup();
        }

        const cancel = document.createElement('button');
        cancel.className = 'cancel';
        cancel.textContent = 'Cancel';
        cancel.onclick = hidePopup;

        form.append(message, confirm, cancel);
        return form;
    }


    updateProjects();
    
    if (document.querySelector('.selected-project') === null
    && document.getElementById('projects').hasChildNodes()) {
        document.querySelector('.project:first-child').classList.add('selected-project');
    }
    
    viewTasks();



})();

export default displayController;