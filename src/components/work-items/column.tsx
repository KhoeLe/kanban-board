import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'
import WorkItem from './work-item';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface WorkItemType {
  id: number;
  title: string;
  priority: 'High' | 'Normal';
  type: 'Task' | 'Bug' | 'Feature';
  status: 'todo' | 'pending' | 'inProgress' | 'requestPendingApproval' | 'done' | 'approved' | 'rejected';
  case : 'Request' | 'WorkItem';
  description: string;
  upcomingDate?: Date;
  requestId?: string
}

interface ColumnProps {
  title: string;
  items: WorkItemType[];
  status: WorkItemType['status'];
  initialCollapsed?: boolean;
  onEdit: (item: WorkItemType) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, item: WorkItemType) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: WorkItemType['status']) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function Column({ title, items, status, onEdit, onDelete, onDragStart, onDragOver, onDrop,isCollapsed ,onToggleCollapse}: ColumnProps) {
  const getColumnColor = (status: WorkItemType['status']) => {
    switch (status) {
      case 'todo':
      case 'pending':
        return 'bg-gray-100';
      case 'inProgress':
      case 'requestPendingApproval':
        return 'bg-yellow-50';
      case 'done':
      case 'approved':
        return 'bg-green-50';
      case 'rejected':
        return 'bg-red-50';
      default:
        return 'bg-gray-100';
    }
  };

  return (
      <motion.div
      className={`w-full  p-4 rounded-lg lg:w-96 ${getColumnColor(status)}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      animate={{ 
        height: isCollapsed ? '80px' : 'auto',
        transition: { duration: 0.3 }
      }}
      layout
    >
        
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {title} <span className="ml-2 text-sm font-normal text-gray-500">{items.length}</span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1"
        >
          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </Button>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item) => (
              <WorkItem
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onDragStart={onDragStart}
              />
            ))}
            {items.length === 0 && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 py-4"
              >
                No items in this column
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Column