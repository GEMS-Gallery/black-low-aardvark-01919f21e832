import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  description: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== '') {
      setLoading(true);
      try {
        await backend.addTask(newTask);
        setNewTask('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
        setLoading(false);
      }
    }
  };

  const completeTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.completeTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      setLoading(false);
    }
  };

  const deleteTask = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setLoading(false);
    }
  };

  return (
    <Box className="app-container">
      <img
        src="https://images.unsplash.com/photo-1625687107746-a7b4d60f2bc0?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ5NTE3MDR8&ixlib=rb-4.0.3"
        alt="Cute cat"
        className="header-image"
      />
      <Box component="a" href="https://unsplash.com/photos/silver-tabby-cat-on-brown-clay-pot-KZhhdz2Zgxw" target="_blank" rel="noopener noreferrer" sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
        Photo by Unsplash
      </Box>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new cat task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addTask}
          sx={{ ml: 1 }}
        >
          Add
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List className="task-list">
          {tasks.map((task) => (
            <ListItem key={task.id.toString()} className="task-card">
              <Box
                className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                onClick={() => completeTask(task.id)}
              />
              <ListItemText primary={task.description} sx={{ ml: 2 }} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default App;
