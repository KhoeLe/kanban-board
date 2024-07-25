import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'
import WorkItem from './work-item';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export interface WorkItemType {
  id: number;
  title: string;
  priority: 'High' | 'Normal';
  type: 'Task' | 'Bug' | 'Feature';
  status: 'todo' | 'pending' | 'inProgress' | 'requestPendingApproval' | 'done' | 'approved' | 'rejected';
  case: 'Request' | 'WorkItem';
  description: string;
  upcomingDate?: Date;
  requestId?: string
}

interface ColumnProps {
  items: WorkItemType[];
  status: WorkItemType['status'];
  initialCollapsed?: boolean;
  onEdit: (item: WorkItemType) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, item: WorkItemType) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: WorkItemType['status']) => void;
  isCollapsed: boolean;
}

function Column({  items, status, onEdit, onDelete, onDragStart, onDragOver, onDrop, isCollapsed }: ColumnProps) {
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
      layout
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full  p-4 rounded-b-xl lg:w-96 ${getColumnColor(status)}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <WorkItem
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={onDragStart}
                />
              ))}
            </AnimatePresence>
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