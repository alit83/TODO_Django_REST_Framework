import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import '../assets/css/homepage.css';
import '../assets/vendor/bootstrap-icons/font/bootstrap-icons.css';

const HomePage = () => {
    const { authTokens, logoutUser, loading } = useContext(AuthContext);
    let [tasks, setTasks] = useState([]);
    let [newTask, setNewTask] = useState('');
    let [postLoading, setPostLoading] = useState(false);
    let [error, setError] = useState('');
    const [currentTheme, setCurrentTheme] = useState('standard');
    const [currentTime, setCurrentTime] = useState('');

    // Check on every app initialization




    useEffect(() => {
      
        gettodo();
    }, []);
    useEffect(() => {
    const savedTheme = localStorage.getItem('npm_todo_theme');

    if (savedTheme) {
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
    }
}, []);
    const gettodo = async() => {
        try {
            let response = await fetch('http://127.0.0.1:8000/tasks/api/v1/tasks/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });
            let data = await response.json();

            
            if(response.status === 200){
                setTasks(data.TASKS);
            } else if (response.status === 401) {
                logoutUser();
            } else if(response.statusText === 'Unauthorized'){
                logoutUser();
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const createTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) {
            setError('Task cannot be empty');
            return;
        }

        setPostLoading(true);
        setError('');

        try {
            let response = await fetch('http://127.0.0.1:8000/tasks/api/v1/tasks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({
                    todo: newTask,
                    done: false
                })
            });

            if (response.status === 201) {
                let newTaskData = await response.json();
                // look
                await gettodo();
                setNewTask(''); 
                console.log('Task added to state:', newTaskData);
            } else if (response.status === 401) {
                logoutUser();
            } else {
                let errorData = await response.json();
                setError(errorData.message || 'Failed to create task');
            }
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Network error. Please try again.');
        } finally {
            setPostLoading(false);
        }
    };

     const DoneTodo = async (e,taskId) => {
        e.preventDefault();
        setPostLoading(true);
        setError('');

        try {
            let response = await  fetch(`http://127.0.0.1:8000/tasks/api/v1/done/${taskId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({
                    done: true
                })
            });

            if (response.status === 200) {
                await gettodo();
            } else if (response.status === 401) {
                logoutUser();
            } else {
                let errorData = await response.json();
                setError(errorData.message || 'Failed to mark a task as done');
            }
           } catch (error) {
        setError('Network error: ' + error.message);
        } finally {
            setPostLoading(false);
        }
    };
    const DeleteTodo = async (e,taskId) => {
        e.preventDefault();
        setPostLoading(true);
        setError('');

        try {
            let response = await  fetch(`http://127.0.0.1:8000/tasks/api/v1/delete/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
            });

            if (response.status === 204) {
                await gettodo();
            } else if (response.status === 401) {
                logoutUser();
            } else {
                let errorData = await response.json();
                setError(errorData.message || 'Failed to delete the task');
            }
           } catch (error) {
        setError('Network error: ' + error.message);
        } finally {
            setPostLoading(false);
        }
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    
    const applyTheme = (theme) => {
    const body = document.body;
    body.classList.remove('darker-theme-active', 'light-theme-active');
    
    if (theme === 'darker') {
      body.classList.add('darker-theme-active');
    } else if (theme === 'light') {
      body.classList.add('light-theme-active');
    }
    localStorage.setItem('npm_todo_theme', theme);
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };
  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => !t.done).length;
    return { total, pending };
  };
   const { total, pending } = getTaskStats();

    return (
    <div className="todo-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="theme-badge-row">
          <div 
            className="theme-selector standard-theme" 
            onClick={() => changeTheme('standard')}
          />
          <div 
            className="theme-selector light-theme" 
            onClick={() => changeTheme('light')}
          />
          <div 
            className="theme-selector darker-theme" 
            onClick={() => changeTheme('darker')}
          />
        </div>
        
        <div className="title-wrapper">
          <div>
            <h1 className="main-title">Just do it.</h1>
            <div className="title-border" />
          </div>

        </div>
      </div>

      {/* Add Task Form */}
      <div className="form-section">
        <form onSubmit={createTodo}>
          <div className="todo-input-group">
            <input
              type="text"
              className="todo-input"
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
                if (error) setError('');
              }}
              placeholder="Add a task. e.g., build something awesome"
              disabled={postLoading}
            />
            <button 
              type="submit" 
              className="todo-btn"
              disabled={postLoading}
            >
              <i className="fas fa-plus-circle"></i>
              {postLoading ? 'Creating...' : 'I Got This!'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <span className="task-counter">
          📋 {total} task{total !== 1 ? 's' : ''} · {pending} pending
        </span>
        <span className="datetime">
          <i className="far fa-clock"></i> {currentTime}
        </span>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        {tasks.length === 0 ? (
          <div className="empty-message">
            <i className="fas fa-check-circle"></i>
            No tasks yet. Add your first task above!
          </div>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task, index) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <span className="task-number">#{index + 1}</span>
                  <span className={`task-text ${task.done ? 'completed' : ''}`}>
                    {task.todo}
                  </span>
                  <span className={`status-badge ${task.done ? 'status-completed' : 'status-pending'}`}>
                    {task.done ? '✅ Completed' : '⏳ Pending'}
                  </span>
                </div>
                
                <div className="action-buttons">
                  <button
                    className=" bi-check-lg icon-btn"
                    onClick={(e) => DoneTodo(e, task.id)}
                    title={task.done ? 'Mark incomplete' : 'Mark done'}
                  >
                    <i className={task.done ? "fas fa-undo-alt" : "fas fa-check-circle"}></i>
                  </button>
                  
                  <button
                    className="bi-trash"
                    onClick={(e) => DeleteTodo(e, task.id)}
                    title="Delete task"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Actions */}
      <div className="footer-actions">
        <hr className="divider" />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

        </div>
      </div>



    </div>
  );
}

export default HomePage;