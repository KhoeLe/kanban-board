import React from 'react'
import { WorkItemType } from './column';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface WorkItemProps {
  item: WorkItemType;
  onEdit: (item: WorkItemType) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, item: WorkItemType) => void;
}

function WorkItem({ item, onEdit, onDelete, onDragStart }: WorkItemProps) {
  const formatDescription = (description: string) => {
    const parts = description.split(/(#\w+)/g);
    return parts.map((part, index) =>
      part.startsWith('#') ? <span key={index} className="bg-blue-100 text-blue-800 px-1 rounded">{part}</span> : part
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
      case 'pending':
        return 'bg-gray-200 text-gray-800';
      case 'inProgress':
      case 'request pending approval':
        return 'bg-yellow-200 text-yellow-800';
      case 'done':
      case 'approved':
        return 'bg-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  console.log('item', item)
  return (
    <motion.div
      layout
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className={`mb-2 ${item.case === 'WorkItem' ? 'cursor-grab' : 'cursor-default'}`}
        draggable={item.case === 'WorkItem'}
        onDragStart={(e) => item.case === 'WorkItem' && onDragStart(e, item)}
      >
        <CardContent className="p-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">{item.title}</div>
            <div>
              {item.case === 'WorkItem' && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </>
              )}
              {item.case === 'Request' && (
                <span className='flex text-sm items-center text-blue-600'>
                <AlertCircle className="w-4 h-4 mx-2 text-blue-600"  />
                {item?.requestId}
                </span>
                
              )}
            </div>
          </div>

          <div className="text-sm md:text-xs mt-1">{formatDescription(item.description)}</div>
          <div className="flex flex-wrap mt-2 gap-2">
            <span className={`px-2 py-1 text-sm md:text-xs rounded-full ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
            <span className={`px-2 py-1 text-sm md:text-xs rounded-full ${item.priority === 'High' ? 'bg-red-200 text-red-600' : 'bg-yellow-200 text-yellow-600'}`}>
              {item.priority}
            </span>
            <span className="px-2 py-1 text-sm md:text-xs rounded-full bg-blue-200 text-blue-600">
              {item.type}
            </span>
            {item.upcomingDate && (
              <span className="px-2 py-1 text-sm md:text-xs rounded-full bg-green-200 text-green-600">
                <Calendar className="w-3 h-3 inline-block mr-1" />
                {format(item.upcomingDate, 'MMM dd, yyyy')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default WorkItem