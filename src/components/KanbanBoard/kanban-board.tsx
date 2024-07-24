'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragStartEvent, DragOverEvent, DragEndEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './column';
import Task from './task';

interface TaskType {
  id: string;
  content: string;
  status: keyof Columns;
}

export interface Columns {
  todo: TaskType[];
  inProgress: TaskType[];
  done: TaskType[];
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Columns>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const saveTasks = useCallback(async (newColumns: Columns) => {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newColumns),
      });
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, []);

  const addTask = useCallback((columnId: keyof Columns, taskContent: string) => {
    const newTask: TaskType = {
      id: Date.now().toString(),
      content: taskContent,
      status: columnId,
    };
    setColumns(prevColumns => {
      const newColumns = {
        ...prevColumns,
        [columnId]: [...prevColumns[columnId], newTask],
      };
      saveTasks(newColumns);
      return newColumns;
    });
  }, [saveTasks]);

  const updateTask = useCallback((taskId: string, newContent: string) => {
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns };
      for (const columnId in updatedColumns) {
        const typedColumnId = columnId as keyof Columns;
        const taskIndex = updatedColumns[typedColumnId].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          updatedColumns[typedColumnId][taskIndex] = {
            ...updatedColumns[typedColumnId][taskIndex],
            content: newContent
          };
          break;
        }
      }
      saveTasks(updatedColumns);
      return updatedColumns;
    });
  }, [saveTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns };
      for (const columnId in updatedColumns) {
        const typedColumnId = columnId as keyof Columns;
        updatedColumns[typedColumnId] = updatedColumns[typedColumnId].filter(task => task.id !== taskId);
      }
      saveTasks(updatedColumns);
      return updatedColumns;
    });
  }, [saveTasks]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    if (task) {
      setActiveTask(task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (overId == null || active.id in columns) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    


    // if (activeContainer !== overContainer) {
    //   setColumns(prevColumns => {
    //     const activeIndex = active.data.current?.sortable.index;
    //     const overIndex = over.data.current?.sortable.index || 0;
    //   });
    // }
    // setColumns(prevColumns => {
    //   const activeTask = findTaskById(activeTaskId);
    //   if (!activeTask || activeTask.status === overColumnStatus) return prevColumns;

    //   const updatedColumns = { ...prevColumns };
    //   updatedColumns[activeTask.status] = updatedColumns[activeTask.status].filter(task => task.id !== activeTaskId);
    //   updatedColumns[overColumnStatus] = [...updatedColumns[overColumnStatus], { ...activeTask, status: overColumnStatus }];

    //   return updatedColumns;
    // });
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as keyof Columns;
    let overColumnStatus = over.data.current?.status as keyof Columns;

    if (activeTaskId !== over.id) return;

    setColumns(prevColumns => {
      const activeTask = findTaskById(activeTaskId);
      if (!activeTask) return prevColumns;

      const updatedColumns = { ...prevColumns };
      updatedColumns[activeTask.status] = updatedColumns[activeTask.status].filter(task => task.id !== activeTaskId);
      const updatedTask = { ...activeTask, status: overColumnStatus };
      updatedColumns[overColumnStatus] = [...updatedColumns[overColumnStatus], updatedTask];

      if (activeTask.status === overColumnStatus) {
        const newIndex = updatedColumns[overColumnStatus].findIndex(task => task.id === over.id);
        updatedColumns[overColumnStatus] = arrayMove(updatedColumns[overColumnStatus], updatedColumns[overColumnStatus].length - 1, newIndex);
      }

      saveTasks(updatedColumns);
      return updatedColumns;
    });

    setActiveTask(null);
  };

  const findTaskById = (taskId: string): TaskType | undefined => {
    for (const columnId in columns) {
      const typedColumnId = columnId as keyof Columns;
      const task = columns[typedColumnId].find(task => task.id === taskId);
      if (task) return task;
    }
  };


  const findContainer = (taskId: UniqueIdentifier) => {
    for (const columnId in columns) {
      const typedColumnId = columnId as keyof Columns;
      const task = columns[typedColumnId].find(task => task.id === taskId);
      if (task) return task;
    }
  };



  return (
    <DndContext
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex">
        {(Object.keys(columns) as Array<keyof Columns>).map(columnId => (
          <Column
            key={columnId}
            id={columnId}
            tasks={columns[columnId]}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <Task
            id={activeTask.id}
            content={activeTask.content}
            onUpdate={updateTask}
            onDelete={() => deleteTask(activeTask.id)}
            status={activeTask.status}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;