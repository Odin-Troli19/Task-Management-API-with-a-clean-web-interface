const API_URL = '/api/tasks';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const taskCount = document.getElementById('taskCount');

// State
let tasks = [];
let currentFilter = 'all';
let currentSearch = '';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    searchInput.addEventListener('input', handleSearch);
    statusFilter.addEventListener('change', handleFilter);
}

// API Functions
async function loadTasks() {
    try {
        const params = new URLSearchParams();
        
        if (currentFilter !== 'all') {
            params.append('status', currentFilter);
        }
        
        if (currentSearch) {
            params.append('search', currentSearch);
        }
        
        const url = `${API_URL}${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            tasks = data.data;
            renderTasks();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks');
    }
}

async function handleAddTask(e) {
    e.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    if (!title) {
        showError('Please enter a task title');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        const data = await response.json();
        
        if (data.success) {
            taskTitle.value = '';
            taskDescription.value = '';
            loadTasks();
            showSuccess('Task added successfully!');
        } else {
            showError(data.error || 'Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showError('Failed to add task');
    }
}

async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !completed })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadTasks();
            showSuccess(completed ? 'Task marked as pending' : 'Task completed!');
        } else {
            showError(data.error || 'Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showError('Failed to update task');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadTasks();
            showSuccess('Task deleted successfully');
        } else {
            showError(data.error || 'Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
    }
}

// Filter and Search
function handleSearch(e) {
    currentSearch = e.target.value.trim();
    loadTasks();
}

function handleFilter(e) {
    currentFilter = e.target.value;
    loadTasks();
}

// Rendering
function renderTasks() {
    taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="empty-state">No tasks found. Try adjusting your filters or add a new task!</p>';
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => createTaskHTML(task)).join('');
    
    // Attach event listeners to buttons
    tasks.forEach(task => {
        const completeBtn = document.querySelector(`[data-complete="${task.id}"]`);
        const deleteBtn = document.querySelector(`[data-delete="${task.id}"]`);
        
        if (completeBtn) {
            completeBtn.addEventListener('click', () => toggleTask(task.id, task.completed));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        }
    });
}

function createTaskHTML(task) {
    const createdDate = new Date(task.created_at).toLocaleDateString();
    const completedClass = task.completed ? 'completed' : '';
    const completeButtonText = task.completed ? 'Undo' : 'Complete';
    
    return `
        <div class="task-item ${completedClass}">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button class="btn btn-small btn-complete" data-complete="${task.id}">
                        ${completeButtonText}
                    </button>
                    <button class="btn btn-small btn-delete" data-delete="${task.id}">
                        Delete
                    </button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                Created: ${createdDate}
                ${task.completed ? ' • Status: Completed ✓' : ' • Status: Pending'}
            </div>
        </div>
    `;
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    // Simple console log - you can enhance this with a toast notification
    console.log('Success:', message);
}

function showError(message) {
    console.error('Error:', message);
    alert(message);
}