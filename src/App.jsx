import { useState, useEffect } from "react";

const API_URL = "https://todobackend-2-hnrg.onrender.com/api/todos";


function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Fetch todos on page load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  };

  const addTask = async () => {
    if (!task.trim()) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTask("");
  };

  const toggleTask = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "PUT" });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 To-Do List (With Backend)</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="What do you need to do?"
        />
        <button style={styles.addBtn} onClick={addTask}>Add</button>
      </div>

      <ul style={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} style={styles.listItem}>
            <span
              onClick={() => toggleTask(todo.id)}
              style={{
                ...styles.taskText,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "#000",
              }}
            >
              {todo.text}
            </span>
            <button style={styles.delBtn} onClick={() => deleteTask(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Styles (same as before)
const styles = {
  container: {
    maxWidth: 500,
    margin: "50px auto",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  inputRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  addBtn: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  taskText: {
    cursor: "pointer",
    flex: 1,
  },
  delBtn: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#e63946",
  },
};

export default App;
