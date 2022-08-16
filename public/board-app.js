const buttons = document.getElementsByClassName("display")
const addForm = document.getElementById('addForm')
const editForm = document.getElementById('editForm')
const taskAddStatus = document.getElementById('taskAddStatus')
const taskEditStatus = document.getElementById('taskEditStatus')
const taskStatus =document.getElementById('taskStatus')
const modalBtn = document.getElementById('addNewTask')
const modal = document.getElementById('addTask')
const toDo=document.getElementById("to-do")
const inProgress=document.getElementById("in-progress")
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
        const {
            data: { tasks },
          } = await axios.get('/api/v1/tasks')
        console.log(tasks)
        const allTasks = tasks
      .map((task,index) => {
        let content=""
        const {_id, name, assignedTo, dueDate, status } = task
       
        if(status=='to-do'){
            content+= `<div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
           <div class="card-header">Task ${index+1}</div>
           <div class="card-body">
           <h5 class="card-title">${name}</h5>
    <p class="card-text">Assigned To: ${assignedTo}</p>
    <p class="card-text">Due Date: ${new Date(dueDate).toLocaleDateString('en-GB')}</p>
    </div>
    </div> `
    toDo.innerHTML+=content
        }     
        
        if(status=='In Progress'){
            content+= `<div class="card text-white bg-secondary mb-3" style="max-width: 18rem;">
           <div class="card-header">Task ${index+1}</div>
           <div class="card-body">
           <h5 class="card-title">${name}</h5>
    <p class="card-text">Assigned To: ${assignedTo}</p>
    <p class="card-text">Due Date: ${new Date(dueDate).toLocaleDateString('en-GB')}</p>
    </div>
    </div> `
    inProgress.innerHTML+=content
        } 
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
        if(status=="completed"){
            $('#taskStatus').prop("checked", true)
        }
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
                dueDate: dueDate.split("/").reverse().join("-")
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

