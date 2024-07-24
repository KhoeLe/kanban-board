import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Columns } from './kanban-board';

interface TaskProps {
  id: string;
  content: string;
  onUpdate: (taskId: string, newContent: string) => void;
  onDelete: () => void;
  status: keyof Columns;
}

const Task: React.FC<TaskProps> = ({ id, content, onUpdate, onDelete, status }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, data: { status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    onUpdate(id, editedContent);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 mb-2 rounded shadow cursor-grab"
    >
      {isEditing ? (
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleEdit}
          autoFocus
          className="w-full mb-2 p-1 border rounded"
        />
      ) : (
        <p onClick={() => setIsEditing(true)}>{content}</p>
      )}
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-2 py-1 rounded mt-2"
      >
        Delete
      </button>
    </div>
  );
};

export default Task;