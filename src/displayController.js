const displayController = (function() {

    const body = document.querySelector('body');
    const newTask = document.getElementById('add-task');
    const tasks = document.querySelectorAll('.task');

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

        color.setAttribute('data-value', '#ffffff');
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

        buttonContainer.append(cancel, confirm);

        form.append(title, desc, bottomContainer, buttonContainer);
        
        
        return form;
    }


    // binding the new task button
    newTask.onclick = () => {
        showPopup(createForm('Add'));
    };


})();

export default displayController;