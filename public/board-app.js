const buttons = document.getElementsByClassName("display")
const addForm = document.getElementById('addForm')
const editForm = document.getElementById('editForm')
const taskAddStatus = document.getElementById('taskAddStatus')
const taskEditStatus = document.getElementById('taskEditStatus')
const taskStatus = document.getElementById('taskStatus')
const modalBtn = document.getElementById('addNewTask')
const modal = document.getElementById('addTask')
const toDo = document.getElementById("to-do")
const inProgress = document.getElementById("in-progress")
const completed = document.getElementById("completed")
document.getElementById("boardDisplay").onclick = function () {
    location.href = "/board.html";
};
document.getElementById("tableDisplay").onclick = function () {
    location.href = "/";
};

Array.from(buttons).forEach(button => {
    button.addEventListener('click', () => {
        button.style.backgroundColor = '#24A0ED'
        button.style.color = "white"
    })
});

addForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let taskName = document.getElementById('taskNameInput').value
    let taskAssigned = document.getElementById('taskAssignedInput').value
    let dueDate = document.getElementById('datepicker').value
    try {
        await axios.post('/api/v1/tasks', {
            name: taskName,
            assignedTo: taskAssigned,
            dueDate: dueDate.split("/").reverse().join("-")
        })
        taskAddStatus.textContent = `success, task added`
        taskAddStatus.classList.add('text-success')
        setTimeout(() => {
            taskAddStatus.textContent = ' '
            $('#addTask').modal('hide');
            $('#addTask').on('hidden.bs.modal', function () {
                $(this).find('form').trigger('reset');
            })
            showTasks()

        }, 4000)
    } catch (error) {
        taskAddStatus.style.display = 'block'
        taskAddStatus.innerHTML = `error, please try again ${error}`
    }
})

async function showTasks() {
    toDo.innerHTML='<h4>To-Do</h4>'
    inProgress.innerHTML='<h4>In Progress</h4>'
    completed.innerHTML='<h4>Completed</h4>'
    const {
        data: { tasks },
    } = await axios.get('/api/v1/tasks')
    console.log(tasks)
    const allTasks = tasks
        .map((task, index) => {
             const { _id, name, assignedTo, dueDate, status } = task
            if (status == 'to-do') {
                renderCard(task,index,"bg-primary",toDo)
            }

            if (status == 'In Progress') {
                renderCard(task,index,"bg-secondary",inProgress)
            }
            if (status == 'Completed') {
                renderCard(task,index,"bg-success",completed)
            }

        })
    }
            renderCard = (task,index,type,statusColumn) => {
                let content = ""
            const { _id, name, assignedTo, dueDate, status } = task
                content += `<div id="closeablecard" class="card text-white ${type} mb-3" style="max-width: 18rem;">
           <div class="card-header">Task ${index + 1}
           <div class="card-body">
           <h5 class="card-title">${name}</h5>
    <p class="card-text">Assigned To: ${assignedTo}</p>
    <p class="card-text">Due Date: ${new Date(dueDate).toLocaleDateString('en-GB')}</p>
    </div>
    </div> `
                var myPanel = $(content);
                let btnGroup =$('<div class="btn-group" role="group" aria-label="BtnGroup"></div>')
                myPanel.append(btnGroup)
                let editBtn = document.createElement('button')
                editBtn.className = 'btn btn-block btn-info'
                editBtn.style.margin = 0;
                editBtn.innerText = "Edit"
                editBtn.setAttribute('data-id', 'edit')
                editBtn.addEventListener('click', () => {
                    var taskID = _id
                    console.log('clicked' + taskID)
                    showTask(taskID)
                })
                myPanel.append(editBtn)
                let deleteBtn = document.createElement('button')
                deleteBtn.className = 'btn btn-block btn-dark'
                deleteBtn.style.margin = 0;
                deleteBtn.innerText = "Delete"
                deleteBtn.setAttribute('data-id', 'edit')
                deleteBtn.addEventListener('click', () => {
                    var taskID = _id
                    console.log('clicked' + taskID)
                    deleteTask(taskID)
                })
                btnGroup.append(editBtn)
                btnGroup.append(deleteBtn)
                myPanel.appendTo(statusColumn);
            }

            showTasks()

            const showTask = async (id) => {
                try {
                    const {
                        data: { task },
                    } = await axios.get(`/api/v1/tasks/${id}`)
                    const { _id, name, assignedTo, dueDate, status } = task
                    $('#editask').modal('show')
                    $('#taskName').val(name)
                    $('#taskAssigned').val(assignedTo)
                    $('#taskName').val(name)
                    $('#taskStatus').val(status)
                    $('#datepicker1').datepicker("setDate", new Date(dueDate));
                    addEditFunction(_id)
                } catch (error) {
                    console.log(error)
                }
            }

            const addEditFunction = (id) => {
                editForm.addEventListener('submit', async (e) => {
                    e.preventDefault()
                    let taskName = document.getElementById('taskName').value
                    let taskAssigned = document.getElementById('taskAssigned').value
                    let dueDate = document.getElementById('datepicker1').value
                    try {
                        await axios.patch(`/api/v1/tasks/${id}`, {
                            name: taskName,
                            assignedTo: taskAssigned,
                            dueDate: dueDate.split("/").reverse().join("-"),
                            status: taskStatus.options[taskStatus.selectedIndex].text
                        })
                        taskEditStatus.textContent = `success, task updated`
                        taskEditStatus.classList.add('text-success')
                        setTimeout(() => {
                            taskEditStatus.textContent = ' '
                            $('#editask').modal('hide');
                            $('#editask').on('hidden.bs.modal', function () {
                                $(this).find('form').trigger('reset');
                            })
                            showTasks()

                        }, 4000)
                    } catch (error) {
                        taskEditStatus.style.display = 'block'
                        taskEditStatus.innerHTML = `error, please try again ${error}`
                    }

                })
            }

            const deleteTask = async (id) => {
                try {
                    await axios.delete(`/api/v1/tasks/${id}`)
                    showTasks()
                } catch (error) {
                    console.log(error)
                }
            }

