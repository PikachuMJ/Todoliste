import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [calendarDate, setCalendarDate] = useState('');

    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(savedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (newTodo.trim()) {
            const lines = [];
            for (let i = 0; i < newTodo.length; i += 40) {
                lines.push(newTodo.slice(i, i + 40));
            }
            setTodos([...todos, { text: lines, colors: {}, calendarDate: calendarDate || '' }]);
            setNewTodo('');
            setCalendarDate('');
        }
    };

    const changeColorForWord = (index, word) => {
        const updatedTodos = todos.map((todo, i) => {
            if (i === index) {
                const updatedColors = { ...todo.colors, [word]: selectedColor };
                return { ...todo, colors: updatedColors };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const deleteTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    const handleTodoChange = (event) => {
        setNewTodo(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    };

    const saveTodos = () => {
        const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const loadedTodos = JSON.parse(e.target.result);
                setTodos(loadedTodos);
            };
            reader.readAsText(file);
        }
    };

    const clearTodos = () => {
        setTodos([]);
        localStorage.removeItem('todos');
    };

    return (
        <div className="todo-container">
            <div className="button-container">
                <animated.button className="clear-button" onClick={clearTodos}>
                    Clear All
                </animated.button>
                <animated.button className="save-button" onClick={saveTodos}>
                    Save As
                </animated.button>
                <animated.label htmlFor="file-input" className="open-button">
                    Open
                </animated.label>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                    id="file-input"
                />
            </div>

            <div className="input-section">
                <input
                    type="text"
                    value={newTodo}
                    onChange={handleTodoChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Add Todo..."
                    className="todo-input"
                />
                <input
                    type="date"
                    value={calendarDate}
                    onChange={(e) => setCalendarDate(e.target.value)}
                    className="calendar-input"
                />
                <button className="add-button" onClick={addTodo}>Add</button>
            </div>

            <div className="color-buttons">
                <button className="color-button white" onClick={() => setSelectedColor('#ffffff')}></button>
                <button className="color-button red" onClick={() => setSelectedColor('#ff0000')}></button>
                <button className="color-button green" onClick={() => setSelectedColor('#00ff00')}></button>
                <button className="color-button blue" onClick={() => setSelectedColor('#97ffff')}></button>
                <button className="color-button navy" onClick={() => setSelectedColor('#001F3F')}></button>
                <button className="color-button purple" onClick={() => setSelectedColor('#b23aee')}></button>
            </div>

            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={index} className="todo-item">
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {todo.text.map((line, lineIndex) => (
                                <span key={lineIndex} style={{ display: 'block' }}>
                                    {line.split(' ').map((word, wordIndex) => (
                                        <span
                                            key={wordIndex}
                                            onClick={() => changeColorForWord(index, word)}
                                            style={{
                                                color: todo.colors[word] || 'inherit',
                                                cursor: 'pointer',
                                                marginRight: '4px',
                                            }}
                                        >
                                            {word}
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </div>
                        {todo.calendarDate && (
                            <span className="calendar-entry">In Calendar: {todo.calendarDate}</span>
                        )}
                        <button className="delete-button" onClick={() => deleteTodo(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
