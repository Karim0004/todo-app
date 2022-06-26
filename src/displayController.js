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

    const createForm = function(ConfirmButtonName) {
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

        const priorityContainer = document.createElement('div');
        const priorityLabel = document.createElement('div');
        priorityLabel.textContent = 'Priority';
        const priority = document.createElement('button');
        priority.className = 'priority';
        priorityContainer.append(priorityLabel, priority);

        const colorContainer = document.createElement('div');
        const colorLabel = document.createElement('div');
        colorLabel.textContent = 'Color';
        const color = document.createElement('button');
        color.className = 'color';

        color.setAttribute('data-color', '#ffffff');
        color.style.position = 'relative';
        

        colorContainer.append(colorLabel, color);

        bottomRightContainer.append(priorityContainer, colorContainer);

        bottomContainer.append(date, bottomRightContainer);

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



    newTask.onclick = () => {
        showPopup(createForm('Add'));
        console.log('srsa')
    };


})();

export default displayController;