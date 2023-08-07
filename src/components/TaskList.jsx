import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import axios from 'axios';
import { toast } from 'react-toastify';
import { URL } from '../App';
import loadingimg from "../assets/loader.gif"
import Task from './Task';

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [completed, setCompleted] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [taskID, setTaskID] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  })
  const {name} = formData

  const handleInputChange = (e)=>{
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const createTask = async(e)=>{
    e.preventDefault()
    if(name === ""){
      return toast.error("Input field cannot be empty")
    }
    try{
      await axios.post(`${URL}/api/tasks`, formData)
      setFormData({...formData, name: ""})
      getTask()
    }catch (error){
        console.log(error)
    }
  }

  const getTask = async()=>{
    setIsLoading(true)
    try{
      const {data} =await axios.get(`${URL}/api/tasks`)
      setIsLoading(false)
      setTasks(data)
    }catch(error){
      toast.error(error.message)
      setIsLoading(false)
    }
  }
  useEffect(()=>{
    getTask()
  },[])

  const deleteTask = async(id)=>{
    try{
      await axios.delete(`${URL}/api/tasks/${id}`)
      getTask()
    }catch(error){
      toast.error(error.message)
    }
  }

  const getSingleTask = async(task)=>{
    setFormData({name: task.name, completed:false})
    setTaskID(task._id)
    setIsEditing(true)
  }

  const updateTask = async()=>{
    if(name === ""){
      return toast.error("Input field cannot be empty")
    }
    try{
      await axios.put(`${URL}/api/tasks/${taskID}`, formData)
      setFormData({...formData, name: ""})
      setIsEditing(false)
      getTask()
    }catch(error){
      toast.error(error.message)
    }
  }

  const setToComplete = async(task)=>{
    const newFormData = {
      name: task.name,
      completed: true
    }
    try{
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      getTask()
    }catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    const cTask = tasks.filter((task)=>{
      return task.completed === true
    })
    setCompleted(cTask)
  },[tasks])

  return (
      <div>
        <h2>Task Manager</h2>       
        <TaskForm 
          handleInputChange={handleInputChange}
           name={name} createTask={createTask}
           isEditing={isEditing}
           updateTask={updateTask}
        />

        {tasks.length > 0 && (
          <div className="--flex-between --pb">
            <p>
              <b>Total Tasks:</b> {tasks.length}
            </p>
            <p>
              <b>Completed Tasks:</b> {completed.length}
            </p>
          </div>
        )}

        <hr/>
        {
          isLoading && (
            <div className="-flex-center">
              <img src={loadingimg} alt="loading" />
            </div>
          )
        }

        {
          !isLoading && tasks.length === 0 ? (
            <p className='--py'>No Task Added</p>
          ): (
            <>
              {tasks?.map((task, index)=>{
                return (
                  <Task key={task.id}
                   task={task}
                    index={index}
                    deleteTask={deleteTask}
                    getSingleTask={getSingleTask}
                       setToComplete={setToComplete}
                  />
                )
              })}
            </>
          )
        }
     </div>
  )
}

export default TaskList