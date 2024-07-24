'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Clock, User, Activity, Tag, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { compareAsc } from 'date-fns';
import Column, { WorkItemType } from '@/components/work-items/column';
import WorkItemForm from '@/components/work-items/work-item-form';
import useDebounce from '@/lib/use-debounce';

interface WorkItemBoardProps {
  workItemData: WorkItemType[];
  requestData: WorkItemType[];
}

function WorkItemsBoard({ workItemData, requestData }: WorkItemBoardProps) {
  const [items, setItems] = useState<WorkItemType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItemType | null>(null);
  const [draggedItem, setDraggedItem] = useState<WorkItemType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({
    todo: false,
    inProgress: false,
    done: false,
    rejected: false
  });

  const [visibleItems, setVisibleItems] = useState<Record<string, number>>({
    todo: 10,
    inProgress: 10,
    done: 10,
    rejected: 10
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.upcomingDate && b.upcomingDate) {
        return compareAsc(a.upcomingDate, b.upcomingDate);
      }
      return a.upcomingDate ? -1 : b.upcomingDate ? 1 : 0;
    });
  }, [items]);

  const toggleColumnCollapse = (status: string) => {
    setCollapsedColumns(prev => ({ ...prev, [status]: !prev[status] }));
  };
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: WorkItemType) => {
    setDraggedItem(item);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: WorkItemType['status']) => {
    e.preventDefault();
    if (draggedItem && draggedItem.case === 'WorkItem') {
      setItems(prevItems => prevItems.map(item =>
        item.id === draggedItem.id ? { ...item, status: newStatus } : item
      ));
    }
    setDraggedItem(null);
  };

  const handleAddOrUpdate = (itemData: WorkItemType) => {
    if (editingItem) {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItem.id ? { ...item, ...itemData } : item
        )
      );
    } else {
      const newItem: WorkItemType = {
        ...itemData,
        id: Math.max(...items.map(i => i.id), 0) + 1,
        case: 'WorkItem'
      };
      setItems(prevItems => [...prevItems, newItem]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: WorkItemType) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const filteredItems = useMemo(() => {
    return sortedItems.filter(item =>
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [sortedItems, debouncedSearchTerm]);

  useEffect(() => {
    setItems([...workItemData, ...requestData]);
  }, [workItemData, requestData]);

  const getColumnItems = useCallback((status: WorkItemType['status']) => {
    const statusMapping: { [key: string]: string[] } = {
      todo: ['todo', 'pending'],
      inProgress: ['inProgress', 'requestPendingApproval'],
      done: ['done', 'approved'],
      rejected: ['rejected'],
    };

    return filteredItems.filter(item => 
      statusMapping[status].includes(item.status)
    ).slice(0, visibleItems[status]);
  }, [filteredItems, visibleItems]);

  const loadMore = (status: string) => {
    setVisibleItems(prev => ({
      ...prev,
      [status]: prev[status] + 10
    }));
  };

  const hasMoreItems = useCallback(
    (status: string) => {
      const statusMapping: { [key: string]: string[] } = {
        todo: ['todo', 'pending'],
        inProgress: ['inProgress', 'requestPendingApproval'],
        done: ['done', 'approved'],
        rejected: ['rejected'],
      };
  
      const totalItems = filteredItems.filter(item => 
        statusMapping[status].includes(item.status)
      ).length;
  
      return totalItems > visibleItems[status];
    }
  ,[filteredItems, visibleItems]);

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Items</h2>
        <Button onClick={openAddDialog}><Plus className="w-4 h-4 mr-2" />Add work item</Button>
      </div>
      <div className="flex items-center mb-6">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="mr-2">
          <Clock className="w-4 h-4 mr-2" />
          Assignee
        </Button>
        <Button variant="outline" className="mr-2">
          <User className="w-4 h-4 mr-2" />
          Status
        </Button>
        <Button variant="outline" className="mr-2">
          <Activity className="w-4 h-4 mr-2" />
          Priority
        </Button>
        <Button variant="outline">
          <Tag className="w-4 h-4 mr-2" />
          Type
        </Button>
      </div>
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row md:space-x-4">
        {['todo', 'inProgress', 'done', 'rejected'].map((status) => (
          <div key={status} className="flex flex-col">
            <h3 className={`text-lg font-semibold mb-2 w-full  p-2 rounded-lg lg:w-96 ${getColumnColor(status as WorkItemType['status'])}`} >
              {status === 'todo' ? 'To Do' : status === 'inProgress' ? 'In Progress' : status === 'done' ? 'Done' : 'Rejected'}
            </h3>
          <Column
            title=""
            items={getColumnItems(status as WorkItemType['status'])}
            status={status as WorkItemType['status']}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            isCollapsed={collapsedColumns[status]}
            onToggleCollapse={() => toggleColumnCollapse(status)}
          />
          {hasMoreItems(status) && (
            <Button 
              variant="ghost" 
              className="mt-2" 
              onClick={() => loadMore(status)}
            >
              Load More <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Work Item' : 'Add New Work Item'}</DialogTitle>
          </DialogHeader>
          <WorkItemForm
            item={editingItem}
            onSave={handleAddOrUpdate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WorkItemsBoard;