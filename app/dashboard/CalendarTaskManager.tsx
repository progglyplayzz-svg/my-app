'use client';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from '@/lib/supabaseClient';

interface Task {
  id: number;
  title: string;
  date: string; // ISO string
  completed: boolean;
}

interface Props {
  userId: string;
}

export default function CalendarTaskManager({ userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch tasks for this user
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      if (error) console.error(error);
      else setTasks(data || []);
    };
    fetchTasks();
  }, [userId]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          title: newTaskTitle,
          date: selectedDate.toISOString(),
          completed: false,
        },
      ])
      .select();
    if (error) return console.error(error);
    setTasks([...tasks, data![0]]);
    setNewTaskTitle('');
  };

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id)
      .select();
    if (error) return console.error(error);
    setTasks(tasks.map(t => (t.id === id ? data![0] : t)));
  };

  const tasksForSelectedDate = tasks.filter(
    task => new Date(task.date).toDateString() === selectedDate.toDateString()
  );

  const handleDateChange = (value: any) => {
    if (!value) return;
    const date = Array.isArray(value) ? value[0] : value;
    setSelectedDate(date as Date);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Calendar</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} />

      <div style={{ marginTop: '1rem' }}>
        <h3>Tasks for {selectedDate.toDateString()}</h3>
        <ul>
          {tasksForSelectedDate.map(task => (
            <li key={task.id} style={{ marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ marginRight: '0.5rem' }}
              />
              {task.title}
            </li>
          ))}
        </ul>

        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task..."
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}
