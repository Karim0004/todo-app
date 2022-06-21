import storageHandler from './storageHandler.js';

const taskHandler = (function () {
    
    const create = function (taskObject) {
        if (!taskObject instanceof Object) return false;

        const task = {};
        task.title = taskObject.title || '';
        task.desc = taskObject.desc || '';
        task.priority = taskObject.priority || '';
        task.date = taskObject.date || '';
        task.color = taskObject.color || '#ffffff';
        task.id = storageHandler.fetchId();

        return task;
    }


})();

export default taskHandler;