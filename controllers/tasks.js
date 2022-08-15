const Tasks= require('../models/task')

const getAllTasks= async(req,res)=>{
    try{
        const tasks=await Tasks.find()
        res.status(200).json({tasks})
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:err})
    }
}

const createTask = async(req,res)=>{
    try{
        const task = await Tasks.create(req.body)
        res.status(201).json(task)
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:err})
    }
}

const getTask = async(req,res)=>{
    try{
        const task = await Tasks.findOne({_id:req.params.id})
        if(!task){
            res.status(404).json('No task found')
        }
        res.status(200).json({task})
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:err})
    }
}

const updateTask = async(req,res)=>{
        const task= await Tasks.findOneAndUpdate({_id:req.params.id},req.body,{
            new:true,runValidators:true
        })
        res.status(200).json({task})
}

const deleteTask = async(req,res)=>{
 
    const task= await Tasks.findOneAndDelete({_id:req.params.id})
        if(!task){
            console.log("here")
            res.status(404).json("No task with id",404)
        }
        res.status(200).json({task}) 

}

module.exports={
    getAllTasks,createTask, getTask, updateTask, deleteTask
}