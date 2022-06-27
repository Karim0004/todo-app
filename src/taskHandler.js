import storageHandler from './storageHandler.js';

const taskHandler = (function () {
    
    const _create = function (taskObject) {
        if (!taskObject instanceof Object) return null;

        const task = {};
        task.title = taskObject.title || '';
        task.desc = taskObject.desc || '';
        task.priority = taskObject.priority || '4';
        task.date = taskObject.date || 'No Date';
        task.color = taskObject.color || '#ffffff';
        task.completed = taskObject.completed || false;
        task.id = String(taskObject.id || storageHandler.fetchId());

        return task;
    }

    const insertTask = function (project, taskObject) {
      
        const task = _create(taskObject);
        if (task === null) return null;

        project = String(project);

        if (project === '' || project === 'null') project = 'Default';

        if (taskObject.id !== null) {
            storageHandler.replace(project, task.id, task);
        } else {
            storageHandler.add(project, task);
        }

    }


    return {insertTask};
})();

export default taskHandler;