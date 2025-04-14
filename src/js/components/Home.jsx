import React, { useEffect, useState } from "react";


const API_URL_BASE = "https://playground.4geeks.com/todo";
const Home = () => {
	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [showDeleteIcon, setShowDeleteIcon] = useState(false);


	const getTodos = async () => {
		try {
			const response = await fetch(API_URL_BASE + "/users/anym", {
				method: "GET"
			});

			if (!response.ok) {
				throw new Error("Sucedio un error al consultar el endpoint.");
			}

			const data = await response.json();
			console.log(data);

			setTodos(data.todos)
		} catch (error) {
			console.log(error)
		}

	};

	const createTodo = async () => {
		try {
			let task = {
				label: inputValue,
				"is_done": false
			};

			const response = await fetch(API_URL_BASE + "/todos/anym", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(task)
			});

			if (!response.ok) {
				throw new Error("Ocurrio un error al crear la tarea.");
			}

			//const data = response.json();
			getTodos();
			setInputValue("");
		} catch (error) {
			console.log(error);
		}
	};

	const deleteTodo = async (todo_id) => {
		try {
			const response = await fetch(API_URL_BASE + "/todos/" + todo_id, {
				method: "DELETE"
			});
			if (!response.ok) {
				throw new Error("Ocurrio un error eliminando la tarea con id:" + todo_id)
			}
			getTodos();
		} catch (error) {
			console.log(error)
		}
	}

	const updateTodo = async (todo_id, is_done) => {
		try {
			const response = await fetch(API_URL_BASE + "/todos/" + todo_id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ is_done }),
			});

			if (!response.ok) {
				throw new Error("Ocurrio un error actualizando la tarea.");
			}

			setTodos((prevTodos) =>
				prevTodos.map((todo) =>
					todo.id === todo_id ? { ...todo, is_done } : todo
				)
			);
		} catch (error) {
			console.log(error);
		}
	};


	useEffect(() => {
		getTodos();
	}, []);

	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<h2>Lista de tareas</h2>
					<input type="text" className="form-control" placeholder="Escribe tu tarea..."
						value={inputValue}
						onChange={(event) => {
							setInputValue(event.target.value);
						}}
						onKeyDown={(event) => {
							if (event.key == "Enter") {
								createTodo();
							}
						}}
					/>
				</div>

			</div>
			<div className="row">
				<div className="col">
					<ul>
						{todos.map((todo, index) => {
							return (
								<div key={todo.id} className="d-flex justify-content-between align-items-center" onMouseEnter={() => setShowDeleteIcon(true)}
								onMouseLeave={() => setShowDeleteIcon(false)}>
									<div>									
										<li> {todo.label} </li>
									</div>
									{showDeleteIcon && (
										<div className="d-flex align-items-center">
											<input class="form-check-input" type="checkbox" checked={todo.is_done} onChange={(e)=>updateTodo(todo.id, e.target.checked)} />
											<i className="fas fa-trash-alt" onClick={() => {
											deleteTodo(todo.id);
										}}>
											</i>
										</div>
									)}
								</div>
							)
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Home



// Mostrar icono de eliminar al hacer hover sobre la tarea.