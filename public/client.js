const taskInput = document.querySelector("#task-input")
const addTask = document.querySelector("#addtaskbtn")
const alert = document.querySelector(".container-fluid")
const alerttittle = document.querySelector(".alert")
let cmpltBtn = document.querySelectorAll(".completebutton")
let mainContainer = document.querySelector(".main-container")
const loginform = document.getElementById('loginform')
const loginBtn = document.getElementById('loginBtn')
const usernameInput = document.getElementById('usernameInput')
let localdata = [];
loginform.style = 'display:none'
const postTask = async () => {
    if (taskInput.value) {

        const data = {
            task: taskInput.value,
            completed: false,
            id: uuidv4(),
            priority: ""
        }
        localdata.push(data)
        renderTask();
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const postresponse = await fetch('/posttask', options)
        try {
            if (!postresponse.ok) {
                throw new Error(postresponse.status)
            }
        } catch (error) {
            console.log(`Unable to send ${error}`)
        }
    } else {
        alertMessage()
    }
}
function alertMessage() {
    window.alert("Task can not be empty")
}
addTask.addEventListener('click', postTask)

const deleteTask = async (taskId) => {
    try {
        const deleteresponse = await fetch(`/deletetask/${taskId}`, { method: 'DELETE' })
        if (!deleteresponse.ok) {
            throw new Error(deleteresponse.status)
        }
    } catch (error) {
        console.error(error)
    }
}


const getTask = async () => {
    try {
        const getTaskresponse = await fetch('/alltasks', {
            method: "GET"
        })
        if (!getTaskresponse.ok) {
            throw new Error(getTaskresponse.status)
        }
        const tasks = await getTaskresponse.json()
        console.log(tasks)
        tasks !== 'Err_Login' ? localdata = await tasks : renderlogin();
        renderTask();
    } catch (error) {
        console.error(error)
    }
}
getTask();

function renderTask() {
    taskInput.value = ""
    mainContainer.innerHTML = "";
    localdata.map((x, y) => {
        const isUrgent = x.priority === "Urgent";
        const isMedium = x.priority === "Medium";
        const isPriority = x.priority === "";
        const isLow = x.priority === "Low";
        const isCmplt = x.completed === "true";
        mainContainer.innerHTML += `
        <div class="row p-1">
        <div class="col-12 mb-xl-2 p-1 unselectable">
        <span style="text-decoration: ${isCmplt ? 'line-through' : 'none'}" id=${x.id}>
          ${x.task}
        </span>
      </div>
          <hr>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <div class="priority d-flex justify-content-center align-items-center">
              <label for="priority"></label>
              <select class="${isUrgent ? "Urgent" : ""} ${isMedium ? "Medium" : ""} ${isPriority ? "default-priority" : ""} ${isLow ? "Low" : ""}">
                <option value="Priority" disabled ${isPriority ? "selected" : ""}>Priority</option>
                <option value="Urgent" ${isUrgent ? "selected" : ""}>Urgent</option>
                <option value="Medium" ${isMedium ? "selected" : ""}>Medium</option>
                <option value="Low" ${isLow ? "selected" : ""}>Low</option>
              </select>
            </div>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-outline-success custombtn completebutton">Done</button>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <button type="button" class="custombtn removebutton btn btn-outline-danger">Remove</button>
          </div>
        </div>
        <br>`;
    });
    updateselectornode();
    handleRemoveBtn();
}

function updateselectornode() {
    let selector = document.getElementsByTagName("select");
    for (let index = 0; index < selector.length; index++) {
        selector[index].addEventListener("change", (e) => {
            while (e.target.classList.length > 0) {
                e.target.classList.remove(e.target.classList[0]);
            }
            const currentClassListValue = e.target.value
            const desc = e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.id
            localdata.map((x, y) => {
                if (x.id === desc) {
                    x.priority = e.target.value
                    updatePriority(x.id, x.priority)
                }
            })
            if (currentClassListValue === 'Urgent') {
                e.target.firstElementChild.parentElement.classList.add("Urgent");
            } else if (currentClassListValue === 'Medium') {
                e.target.firstElementChild.parentElement.classList.add("Medium");
            } else {
                e.target.firstElementChild.parentElement.classList.add("Low");
            }
        })

    }
}

const updatePriority = async (id, priority) => {
    try {
        const res = await fetch(`/priority/${id}/${priority}`, { method: 'PATCH' })
        if (!res.ok) {
            throw new Error(`Unable to update Priority ${updatePriority.status}`)
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

function handleRemoveBtn() {
    const removeBtn = document.querySelectorAll(".removebutton")
    for (let index = 0; index < removeBtn.length; index++) {
        removeBtn[index].addEventListener("click", (e) => {
            let taskId = e.target.parentElement.parentElement.firstElementChild.firstElementChild.id
            console.log(taskId)
            localdata.map((x, y) => {
                if (x.id === taskId) {
                    localdata.splice(y, 1)
                    deleteTask(taskId)
                    renderTask();
                }
            })
        })
    }
}

const renderlogin = () => {
    loginform.style = 'display:flex'
}

const sendLogin = async (req, res) => {
    try {
        console.log(usernameInput.value)
        const res = await fetch('/login', {
            headers:
            {
                'Content-Type': 'application/json',
                'username': `${usernameInput.value}`
            }
        });
        if (res.ok) {
            loginform.style = 'display:none'
            getTask();
        }
    } catch (error) {

    }
}
loginBtn.addEventListener('click', sendLogin)