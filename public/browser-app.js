const buttons = document.getElementsByClassName("display")
const taskTable = document.getElementById("table").getElementsByTagName('tbody')[0];
const addForm = document.getElementById('addForm')
const editForm = document.getElementById('editForm')
const taskAddStatus = document.getElementById('taskAddStatus')
const taskEditStatus = document.getElementById('taskEditStatus')
const taskStatus =document.getElementById('taskStatus')
const modalBtn = document.getElementById('addNewTask')
const modal = document.getElementById('addTask')
document.getElementById("boardDisplay").onclick = function () {
    location.href = "/board.html";
};
document.getElementById("tableDisplay").onclick = function () {
    location.href = "/";
};

Array.from(buttons).forEach(button => {
    button.addEventListener('click',()=>{
        button.style.backgroundColor='#24A0ED'
        button.style.color="white"
    })
});



addForm.addEventListener('submit',async(e)=>{
    e.preventDefault()
    let taskName=document.getElementById('taskNameInput').value
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
        setTimeout(()=>{
            taskAddStatus.textContent=' '
            $('#addTask').modal('hide');
            $('#addTask').on('hidden.bs.modal', function () {
                $(this).find('form').trigger('reset');
            })
            showTasks()

        },4000)
      } catch (error) {
        taskAddStatus.style.display = 'block'
        taskAddStatus.innerHTML = `error, please try again ${error}`
      }
})

async function showTasks(){
    taskTable.innerHTML=''
        const {
            data: { tasks },
          } = await axios.get('/api/v1/tasks')
        console.log(tasks)
        const allTasks = tasks
      .map((task,index) => {
        const {_id, name, assignedTo, dueDate, status } = task
        var newRow = taskTable.insertRow();
        // Insert a cell at the end of the row
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);
        let cell6 = newRow.insertCell(5);
        cell1.innerHTML = index + 1;
        cell2.innerHTML = name;
        cell3.innerHTML = assignedTo;
        cell4.innerHTML = new Date(dueDate).toLocaleDateString('en-GB');
        cell5.innerHTML = status
        let editBtn = document.createElement('button')
        editBtn.className='btn btn-outline-primary edit'
        editBtn.style.margin=0;
        editBtn.innerText="Edit"
        editBtn.setAttribute('data-id','edit')
        editBtn.addEventListener('click',()=>{
            var taskID = _id
            console.log('clicked'+taskID)
           showTask(taskID)
        })
        cell6.append(editBtn)
        let deleteBtn = document.createElement('button')
        deleteBtn.className='btn btn-outline-secondary delete'
        deleteBtn.style.marginLeft=5
        deleteBtn.style.marginRight=0
        deleteBtn.style.marginTop=0;
        deleteBtn.style.marginBottom=0;
        deleteBtn.innerText="Delete"
        deleteBtn.setAttribute('data-id','edit')
        deleteBtn.addEventListener('click',()=>{
            var taskID = _id
            console.log('clicked'+taskID)
           deleteTask(taskID)
        })
        cell6.append(deleteBtn)
      })
       
}
showTasks()

const showTask = async (id) => {
    try {
      const {
        data: { task },
      } = await axios.get(`/api/v1/tasks/${id}`)
      const {_id, name, assignedTo, dueDate, status } = task
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

const addEditFunction=(id)=>{
    editForm.addEventListener('submit',async(e)=>{
        e.preventDefault()
        let taskName=document.getElementById('taskName').value
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
            setTimeout(()=>{
                taskEditStatus.textContent=' '
                $('#editask').modal('hide');
                $('#editask').on('hidden.bs.modal', function () {
                    $(this).find('form').trigger('reset');
                })
                showTasks()
    
            },4000)
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

