import React, { useContext , useEffect , useState} from 'react'
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    const { authTokens,logoutUser } = useContext(AuthContext);
    let [tasks, setTasks] = useState([])

     useEffect(() => {
        gettodo()
    },[])

    const gettodo = async() => {
        
        let response = await fetch('http://127.0.0.1:8000/tasks/api/v1/tasks/', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json()
        console.log(data)
        if(response.status === 200){
            setTasks(data.TASKS)
        } else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }


     return (
        <div>
            <p>You are logged in to the homepage!</p>
            
            {/* Map through tasks array to display each task */}
            {tasks.map((task, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
                    <p><strong>Task {index + 1}:</strong> {task.todo}</p>
                    <p>Status: {task.done ? '✅ Completed' : '⏳ Pending'}</p>
                    <p>Delete URL: {task.delete_url}</p>
                    <p>Done URL: {task.done_url}</p>
                </div>
            ))}
        </div>
    );
}

export default HomePage