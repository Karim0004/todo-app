const storageHandler = (function() {
    
    // fetch all tasks of a project
    const getTasks = function(project) {
        if (project === 'ID_STORAGE') return null;
        const tasks = localStorage.getItem(project);
        if (tasks === null) return [];
        return JSON.parse(tasks);
    }
    
    // add a task
    const add = function (project, task) {
        const tasks = getTasks(project);
        if (tasks === null) return false;

        tasks.push(task);
        localStorage.setItem(project, JSON.stringify(tasks));
    }

    // remove a task
    const remove = function (project, id) {
        const tasks = getTasks(project);
        if (tasks === null) return false;

        for (let i in tasks) {
            if (tasks[i].id === id) {
                tasks.splice(i, 1);
                localStorage.setItem(project, JSON.stringify(tasks));
                return true;
            }
        }
        return false;
    }
    
    const replace = function (project, id, task) {
        const tasks = getTasks(project);
        if (tasks === null) return false;

        for (let i in tasks) {
            if (tasks[i].id === id) {
                tasks.splice(i, 1, task);
                localStorage.setItem(project, JSON.stringify(tasks));
                return true;
            }
        }
        return false;
    }


    // fetch an id from storage and increment the stored id for next fetch
    const fetchId = function() {
        const id = localStorage.getItem('ID_STORAGE');
        if (id === null) id = '0';
        id = Number(id);
        let nextId = id + 1;
        localStorage.setItem('ID_STORAGE', nextId.toString);
        return id;
    }

    // fetch all project names which are the keys of localStorage
    const fetchProjects = function() {
        const projects = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === 'ID_STORAGE') continue;
            projects.push(key);
        }

        return projects;
    }


    return {getTasks, add, remove, replace, fetchId, fetchProjects};
})();

export default storageHandler;