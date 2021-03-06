const storageHandler = (function() {

    if (localStorage.length === 0) localStorage.setItem("Default", JSON.stringify([]));
    
    // fetch all tasks of a project
    const getTasks = function(project) {
        if (project === 'ID_STORAGE') return null;
        const tasks = localStorage.getItem(project);
        if (tasks === null || tasks === '') return [];
        return JSON.parse(tasks);
    }
    
    // add a task
    const add = function (project, task) {
        const tasks = getTasks(project);
        if (tasks === null) return null;

        tasks.push(task);
        localStorage.setItem(project, JSON.stringify(tasks));
    }

    const fetchTask = function (project, id) {
        const tasks = getTasks(project);
        if (tasks === null) return null;

        for (let i in tasks) {
            if (tasks[i].id === id) {

                return tasks[i];
            }
        }
        return null;
    }
    // remove a task
    const remove = function (project, id) {
        const tasks = getTasks(project);
        if (tasks === null) return null;

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
        if (tasks === null) return null;

        for (let i in tasks) {
            if (tasks[i].id === id) {
                tasks.splice(i, 1, task);
                localStorage.setItem(project, JSON.stringify(tasks));
                return true;
            }
        }
        return false;
    }


    const toggleCompletion = function (project, id) {
        const tasks = getTasks(project);
        if (tasks === null) return null;

        for (let i in tasks) {
            if (tasks[i].id === id) {
                tasks[i].completed = !tasks[i].completed;
                console.log('ytyy');
                localStorage.setItem(project, JSON.stringify(tasks));
                return true;
            }
        }
        return false;


    }


    // fetch an id from storage and increment the stored id for next fetch
    const fetchId = function() {
        let id = localStorage.getItem('ID_STORAGE');
        if (id === null) id = '0';
        id = Number(id);
        let nextId = id + 1;
        localStorage.setItem('ID_STORAGE', nextId.toString());
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

    const newProject = function (name) {
        const projects = fetchProjects();
        if (projects.includes(name)) return null;

        localStorage.setItem(name, JSON.stringify([]));
    }

    const removeProject = function (projectName) {
        
        if (!projectName) return null;

        const projects = fetchProjects();

        projectName = String(projectName);

        if (projects.includes(projectName)) {
            localStorage.removeItem(projectName);
        }
    }


    return {getTasks, add, remove, replace, fetchId, fetchProjects, newProject,
        removeProject, toggleCompletion, fetchTask};
})();

export default storageHandler;