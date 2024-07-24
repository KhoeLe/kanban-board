import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './task';
import { Columns } from './kanban-board';

interface ColumnProps {
  id: keyof Columns;
  tasks: { id: string; content: string; status: keyof Columns }[];
  addTask: (columnId: keyof Columns, task: string) => void;
  updateTask: (taskId: string, newContent: string) => void;
  deleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ id, tasks, addTask, updateTask, deleteTask }) => {
  const [newTask, setNewTask] = useState('');
  const { setNodeRef } = useDroppable({ id });

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(id, newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-md flex-1 m-2">
      <h2 className="text-lg font-semibold mb-4 capitalize">{id}</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            content={task.content}
            onUpdate={(newContent) => updateTask(task.id, newContent)}
            onDelete={() => deleteTask(task.id)}
            status={task.status}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;