import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// API Routes
// Get all todos
app.get('/api/todos', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM todos ORDER BY created_at DESC'
  ).all();
  
  return c.json({ success: true, todos: results });
})

// Create a new todo
app.post('/api/todos', async (c) => {
  const { title } = await c.req.json();
  
  if (!title) {
    return c.json({ success: false, error: 'Title is required' }, 400);
  }
  
  const result = await c.env.DB.prepare(
    'INSERT INTO todos (title, completed) VALUES (?, 0)'
  ).bind(title).run();
  
  return c.json({ 
    success: true, 
    todo: { 
      id: result.meta.last_row_id, 
      title, 
      completed: 0 
    } 
  });
})

// Update todo (toggle completed)
app.put('/api/todos/:id', async (c) => {
  const id = c.req.param('id');
  const { completed } = await c.req.json();
  
  await c.env.DB.prepare(
    'UPDATE todos SET completed = ? WHERE id = ?'
  ).bind(completed ? 1 : 0, id).run();
  
  return c.json({ success: true });
})

// Delete todo
app.delete('/api/todos/:id', async (c) => {
  const id = c.req.param('id');
  
  await c.env.DB.prepare(
    'DELETE FROM todos WHERE id = ?'
  ).bind(id).run();
  
  return c.json({ success: true });
})

// Home page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>할 일 관리 - iqherb</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div class="max-w-3xl mx-auto p-8">
            <div class="bg-white rounded-2xl shadow-2xl p-8">
                <h1 class="text-4xl font-bold text-indigo-600 mb-2 flex items-center gap-3">
                    <i class="fas fa-tasks"></i>
                    할 일 관리
                </h1>
                <p class="text-gray-500 mb-8">Cloudflare D1 + Hono로 만든 할 일 앱</p>
                
                <!-- Add Todo Form -->
                <div class="mb-8">
                    <div class="flex gap-3">
                        <input 
                            type="text" 
                            id="todoInput" 
                            placeholder="새로운 할 일을 입력하세요..."
                            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            onkeypress="if(event.key==='Enter') addTodo()"
                        />
                        <button 
                            onclick="addTodo()"
                            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center gap-2"
                        >
                            <i class="fas fa-plus"></i>
                            추가
                        </button>
                    </div>
                </div>
                
                <!-- Loading State -->
                <div id="loading" class="text-center py-8 text-gray-500">
                    <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                    <p>로딩 중...</p>
                </div>
                
                <!-- Todos List -->
                <div id="todoList" class="space-y-3 hidden"></div>
                
                <!-- Empty State -->
                <div id="emptyState" class="text-center py-12 text-gray-400 hidden">
                    <i class="fas fa-clipboard-list text-6xl mb-4"></i>
                    <p class="text-xl">할 일이 없습니다</p>
                    <p class="text-sm mt-2">위에서 새로운 할 일을 추가해보세요!</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="mt-8 text-center text-gray-600">
                <p class="flex items-center justify-center gap-2">
                    <i class="fas fa-cloud"></i>
                    Powered by Cloudflare Pages + D1 + Hono
                </p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            let todos = [];
            
            // Load todos on page load
            async function loadTodos() {
                try {
                    document.getElementById('loading').classList.remove('hidden');
                    const response = await axios.get('/api/todos');
                    todos = response.data.todos || [];
                    renderTodos();
                } catch (error) {
                    console.error('Failed to load todos:', error);
                    alert('할 일 목록을 불러오는데 실패했습니다.');
                } finally {
                    document.getElementById('loading').classList.add('hidden');
                }
            }
            
            // Render todos
            function renderTodos() {
                const todoList = document.getElementById('todoList');
                const emptyState = document.getElementById('emptyState');
                
                if (todos.length === 0) {
                    todoList.classList.add('hidden');
                    emptyState.classList.remove('hidden');
                    return;
                }
                
                todoList.classList.remove('hidden');
                emptyState.classList.add('hidden');
                
                todoList.innerHTML = todos.map(todo => \`
                    <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                        <input 
                            type="checkbox" 
                            \${todo.completed ? 'checked' : ''}
                            onchange="toggleTodo(\${todo.id}, this.checked)"
                            class="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span class="flex-1 \${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'} text-lg">
                            \${escapeHtml(todo.title)}
                        </span>
                        <button 
                            onclick="deleteTodo(\${todo.id})"
                            class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                \`).join('');
            }
            
            // Add todo
            async function addTodo() {
                const input = document.getElementById('todoInput');
                const title = input.value.trim();
                
                if (!title) {
                    alert('할 일을 입력해주세요!');
                    return;
                }
                
                try {
                    const response = await axios.post('/api/todos', { title });
                    todos.unshift(response.data.todo);
                    input.value = '';
                    renderTodos();
                } catch (error) {
                    console.error('Failed to add todo:', error);
                    alert('할 일 추가에 실패했습니다.');
                }
            }
            
            // Toggle todo
            async function toggleTodo(id, completed) {
                try {
                    await axios.put(\`/api/todos/\${id}\`, { completed });
                    const todo = todos.find(t => t.id === id);
                    if (todo) {
                        todo.completed = completed ? 1 : 0;
                        renderTodos();
                    }
                } catch (error) {
                    console.error('Failed to update todo:', error);
                    alert('할 일 업데이트에 실패했습니다.');
                    loadTodos(); // Reload to sync
                }
            }
            
            // Delete todo
            async function deleteTodo(id) {
                if (!confirm('이 할 일을 삭제하시겠습니까?')) {
                    return;
                }
                
                try {
                    await axios.delete(\`/api/todos/\${id}\`);
                    todos = todos.filter(t => t.id !== id);
                    renderTodos();
                } catch (error) {
                    console.error('Failed to delete todo:', error);
                    alert('할 일 삭제에 실패했습니다.');
                }
            }
            
            // Escape HTML to prevent XSS
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
            
            // Initialize
            loadTodos();
        </script>
    </body>
    </html>
  `)
})

export default app
