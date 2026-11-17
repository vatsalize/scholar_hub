import apiClient, { USE_MOCK_STORAGE } from './api';
import { initialTasks } from '../data/dummyData';

const TASKS_KEY = 'scholarhub_tasks';

const getStoredTasks = () => {
  const data = localStorage.getItem(TASKS_KEY);
  if (!data) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
  return JSON.parse(data);
};

export const taskService = {
  // Get all tasks
  async getTasks(userId = null) {
    if (!USE_MOCK_STORAGE) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('scholarhub_current_user') || '{}');
        const activeUserId = userId || currentUser.id || '11111111-1111-1111-1111-111111111111';
        const response = await apiClient.get(`/todo/task/getAll/${activeUserId}`);
        if (response.data && response.data.length > 0) {
          return response.data;
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local storage tasks');
      }
    }
    return getStoredTasks();
  },

  // Create a new task
  async createTask(taskData) {
    if (!USE_MOCK_STORAGE) {
      try {
        const response = await apiClient.post('/todo/task/add', taskData);
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, creating task locally');
      }
    }
    const tasks = getStoredTasks();
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'General Academic',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      completed: taskData.status === 'Completed',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newTask, ...tasks];
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return newTask;
  },

  // Update existing task
  async updateTask(taskId, updates) {
    const tasks = getStoredTasks();
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const isCompleted = updates.status === 'Completed' || (updates.completed !== undefined ? updates.completed : t.completed);
        const status = updates.status || (isCompleted ? 'Completed' : t.status === 'Completed' ? 'To Do' : t.status);
        return {
          ...t,
          ...updates,
          status,
          completed: isCompleted
        };
      }
      return t;
    });
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated.find(t => t.id === taskId);
  },

  // Toggle complete
  async toggleComplete(taskId) {
    const tasks = getStoredTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    const newCompleted = !task.completed;
    const newStatus = newCompleted ? 'Completed' : 'To Do';
    return this.updateTask(taskId, { completed: newCompleted, status: newStatus });
  },

  // Delete a task
  async deleteTask(taskId) {
    if (!USE_MOCK_STORAGE) {
      try {
        await apiClient.delete(`/todo/task/delete/${taskId}`);
      } catch (err) {
        console.warn('Backend unavailable, deleting task locally');
      }
    }
    const tasks = getStoredTasks().filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  }
};

export default taskService;
