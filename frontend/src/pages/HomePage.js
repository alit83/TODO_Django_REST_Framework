import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import '../assets/css/homepage.css';

const HomePage = () => {
    const { authTokens, logoutUser, loading } = useContext(AuthContext);
    let [tasks, setTasks] = useState([]);
    let [newTask, setNewTask] = useState('');
    let [postLoading, setPostLoading] = useState(false);
    let [error, setError] = useState('');
    const [currentTheme, setCurrentTheme] = useState('standard');
    const [currentTime, setCurrentTime] = useState('');

    

    useEffect(() => {
        gettodo();
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
     const clearCompleted = () => {
    const pendingTasks = tasks.filter(task => !task.done);
    setTasks(pendingTasks);

  };
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
          <div className="npm-badge">
            <i className="fab fa-npm"></i> npm install productivity
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
                    className="icon-btn check-btn"
                    onClick={(e) => DoneTodo(e, task.id)}
                    title={task.done ? 'Mark incomplete' : 'Mark done'}
                  >
                    <i className={task.done ? "fas fa-undo-alt" : "fas fa-check-circle"}></i>
                  </button>
                  
                  <button
                    className="icon-btn delete-btn"
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
          <button 
            className="clear-btn" 
            onClick={clearCompleted}
            disabled={!tasks.some(t => t.done)}
          >
            <i className="far fa-trash-alt"></i> Clear completed
          </button>
        </div>
      </div>

      {/* GitHub Corner */}
      <a 
        href="https://github.com/tusharnankani/ToDoList" 
        className="github-corner"
        target="_blank" 
        rel="noopener noreferrer"
      >
        <svg width="50" height="50" viewBox="0 0 250 250" style={{ fill: '#062e3f', color: '#fff', opacity: 0.85 }}>
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" className="octo-arm" />
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body" />
        </svg>
      </a>

      <div className="footer-note">
        <span>✨ npm-inspired Todo — local storage keeps your tasks safe</span>
      </div>
    </div>
  );
}

export default HomePage;