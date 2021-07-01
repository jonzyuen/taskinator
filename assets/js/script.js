let taskIdCounter = 0;
let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let pageContentEl = document.querySelector("#page-content");
let tasks = [];

let taskFormHandler = function(event) {
  event.preventDefault();

  let taskNameInput = document.querySelector("input[name='task-name']").value;
  let taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if input values are empty strings 
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  };

  formEl.reset();

  let isEdit = formEl.hasAttribute("data-task-id");

  // has data attribute, so get task id and call function to complete edit process 
  if (isEdit) {
    let taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }

  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    let taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
  }
};

let createTaskEl = function(taskDataObj) {
  // create list item
  let listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute 
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  let taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
 
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  let taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  // increase task counter for next unique id 
  taskIdCounter++;
};

let createTaskActions = function(taskId) {
  let actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button 
  let editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  let deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  let statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";

  actionContainerEl.appendChild(statusSelectEl);

  let statusChoices = ["To Do", "In Progress", "Completed"];

  for (let i = 0; i < statusChoices.length; i++) {
    // create option element 
    let statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

let completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item 
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values 
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  formEl.querySelector("#save-task").textContent = "Add Task";
};

let taskButtonHandler = function(event) {
  // get target element from event 
  let targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    let taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    let taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

let taskStatusChangeHandler = function(event) {
  console.log(event.target.value);
  // get the task item's id 
  let taskId = event.target.getAttribute("data-task-id");

  // find the parent task item element based on the id 
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get the currently selected option's value and convert to lowercase 
  let statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  };

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  };
};

let editTask = function(taskId) {
  console.log(taskId);
  // get task list item element 
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type 
  let taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  let taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
 

  formEl.setAttribute("data-task-id", taskId);
  formEl.querySelector("#save-task").textContent = "Save Task";
};

let deleteTask = function(taskId) {
  console.log(taskId);
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create new array to hold updated list of tasks 
  let updatedTaskArr = [];

  // loop through current tasks 
  for (let i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, keep that task 
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  };   

  // reassign tasks array to be the same as updatedTaskArr 
  tasks = updatedTaskArr;
};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);