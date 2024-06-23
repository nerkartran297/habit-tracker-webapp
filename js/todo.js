const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');

// --- Hàm fetch API ---
const fetchApi = async (url, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Rethrow error to handle it in the caller function
    }
};

// --- Event listener ---
todoInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter' && todoInput.value.trim() !== '') {
        const newTodo = { content: todoInput.value };

        try {
            await fetchApi('/api/todos', 'POST', newTodo);
            todoInput.value = '';
            loadTodos();
        } catch (error) {
            alert('Lỗi khi tạo todo: ' + error.message);
        }
    }
});

// --- Load todos ---
async function loadTodos() {
    try {
        const userTodos = await fetchApi('/api/todos');

        todoList.innerHTML = '';
        doneList.innerHTML = '';

        userTodos.forEach(todo => {
            const todoText = todo.content.length > 24 ? todo.content.slice(0, 24) + "..." : todo.content;
            const todoItem = createTodoItem(todo, todoText);
            (todo.isDone ? doneList : todoList).appendChild(todoItem);
        });
    } catch (error) {
        alert('Lỗi khi tải danh sách todo: ' + error.message);
    }
}

loadTodos();

function createTodoItem(todo, todoText) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todoItem');
    todoDiv.style.cssText = `display: flex; justify-content: space-between; margin: 10px; flex-direction: row; min-width: 260px;`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.isDone;
    checkbox.classList.add('todoCheck');

    checkbox.addEventListener('change', async () => {
        try {
            const updatedTodo = await fetchApi(`/api/todos/${todo._id}`, 'PUT', { isDone: checkbox.checked });
            if (updatedTodo && updatedTodo.message === 'Todo updated successfully') {
                loadTodos();
            } else {
                checkbox.checked = !checkbox.checked;
                alert('Lỗi khi cập nhật todo. Vui lòng thử lại.');
            }
        } catch (error) {
            checkbox.checked = !checkbox.checked;
            alert('Lỗi khi cập nhật todo: ' + error.message);
        }
    });

    const todoName = document.createElement('p');
    todoName.classList.add('todoName');
    todoName.textContent = todoText;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('todoDelete');
    deleteButton.textContent = 'X';

    deleteButton.addEventListener('click', async () => {
        try {
            await fetchApi(`/api/todos/${todo._id}`, 'DELETE');
            loadTodos();
        } catch (error) {
            alert('Lỗi khi xóa todo: ' + error.message);
        }
    });

    todoDiv.appendChild(checkbox);
    todoDiv.appendChild(todoName);
    todoDiv.appendChild(deleteButton);

    todoDiv.draggable = true;

    todoDiv.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', todo._id);
    });

    todoDiv.addEventListener('dragover', (event) => {
        event.preventDefault(); // Cho phép thả vào vùng này
    });

    todoDiv.addEventListener('drop', async (event) => {
        event.preventDefault();
        const todoId = event.dataTransfer.getData('text/plain');
        const targetList = event.target.closest('.listTD');

        if (targetList.id === 'todoList') {
            checkbox.checked = false;
        } else if (targetList.id === 'doneList') {
            checkbox.checked = true;
        }

        try {
            const updatedTodo = await fetchApi(`/api/todos/${todoId}`, 'PUT', { isDone: checkbox.checked });
            if (updatedTodo && updatedTodo.message === 'Todo updated successfully') {
                loadTodos();
            } else {
                alert('Lỗi khi cập nhật todo. Vui lòng thử lại.');
            }
        } catch (error) {
            alert('Lỗi khi cập nhật todo: ' + error.message);
        }
    });

    return todoDiv;
}
