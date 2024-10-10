import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Particle from './Particle';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [calendarDate, setCalendarDate] = useState('');
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(savedTodos);
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (newTodo.trim()) {
            const words = newTodo.split(' ').map(word => ({ text: word, color: selectedColor }));
            setTodos([...todos, { text: words, color: selectedColor, calendarDate: calendarDate || '' }]);
            setNewTodo('');
            setCalendarDate('');
        }
    };

    const changeColorForWord = (index, wordIndex) => {
        const updatedTodos = todos.map((todo, i) => {
            if (i === index) {
                const updatedWords = [...todo.text];
                updatedWords[wordIndex].color = selectedColor;
                return { ...todo, text: updatedWords };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const handleTodoChange = (event) => {
        setNewTodo(event.target.value);
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
        triggerParticles();
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
        triggerParticles();
    };

    const triggerParticles = () => {
        const radius = 50;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;

        setParticles([...particles, { distance, angle }]);
        setTimeout(() => setParticles(particles => particles.filter(p => p.distance !== distance || p.angle !== angle)), 500);
    };

    return (
        <div className="todo-container">
            <div className="button-container">
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
                    style={{ display: 'none' }}
                    id="file-input"
                />
            </div>

            <div className="input-section">
                <input
                    type="text"
                    value={newTodo}
                    onChange={handleTodoChange}
                    placeholder="Add Todo..."
                    style={{ color: selectedColor }}
                    className="todo-input"
                />
                <input
                    type="date"
                    value={calendarDate}
                    onChange={(e) => setCalendarDate(e.target.value)}
                    className="calendar-input"
                    placeholder="Kalenderdatum"
                />
                <button className="add-button" onClick={addTodo}>Hinzufügen</button>
            </div>

            <div className="color-buttons">
                <button className="color-button red" onClick={() => setSelectedColor('red')}></button>
                <button className="color-button green" onClick={() => setSelectedColor('green')}></button>
                <button className="color-button blue" onClick={() => setSelectedColor('#007bff')}></button>
                <button className="color-button navy" onClick={() => setSelectedColor('#001F3F')}></button>
            </div>

            {particles.map((particle, index) => (
                <Particle
                    key={index}
                    distance={particle.distance}
                    angle={particle.angle}
                    xOffset={200}
                    yOffset={50}
                />
            ))}

            <ul className="todo-list">
                {todos.map((todo, index) => (
                    <li key={index} className="todo-item">
                        {todo.text.map((wordObj, wordIndex) => (
                            <span
                                key={wordIndex}
                                style={{ color: wordObj.color }}
                                onClick={() => changeColorForWord(index, wordIndex)}
                            >
                                {wordObj.text}{' '}
                            </span>
                        ))}
                        {todo.calendarDate && (
                            <span className="calendar-entry">In Kalender: {todo.calendarDate}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
