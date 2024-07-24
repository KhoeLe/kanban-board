import React, { useState } from 'react'
import { WorkItemType } from './column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { parse } from 'date-fns';

interface WorkItemFormProps {
  item: WorkItemType | null;
  onSave: (item: WorkItemType) => void;
  onCancel: () => void;
}

function WorkItemForm({ item, onSave, onCancel }: WorkItemFormProps) {
  const [formData, setFormData] = useState<WorkItemType>(item || {
    id: 0,
    title: '',
    description: '',
    priority: 'Normal',
    type: 'Task',
    status: 'todo',
    case: 'WorkItem',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormData = { ...formData };

    // Extract date from description
    const dateMatch = formData.description.match(/\[([^\[\]]*?\d{4}-\d{2}-\d{2})\](?![^\[]*\])/);
    console.log("check",dateMatch)
    if (dateMatch) {
      const dateStr = dateMatch[1];
      const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (!isNaN(parsedDate.getTime())) {
        updatedFormData.upcomingDate = parsedDate;
      }
    }

    onSave(updatedFormData);
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="mb-2"
      />
      <div>
        <label>Priority</label>
        <Select name="priority" value={formData.priority} onValueChange={(value) => handleChange({ target: { name: 'priority', value } } as React.ChangeEvent<HTMLSelectElement>)}>
          <SelectTrigger className="min-w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Type</label>
        <Select name="type" value={formData.type} onValueChange={(value) => handleChange({ target: { name: 'type', value } } as React.ChangeEvent<HTMLSelectElement>)}>
          <SelectTrigger className="min-w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Task">Task</SelectItem>
            <SelectItem value="Bug">Bug</SelectItem>
            <SelectItem value="Feature">Feature</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Status</label>
        <Select name="status" value={formData.status} onValueChange={(value) => handleChange({ target: { name: 'status', value } } as React.ChangeEvent<HTMLSelectElement>)}>
          <SelectTrigger className="min-w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="inProgress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (Use # for tags and [YYYY-MM-DD] for upcoming date)"
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}

export default WorkItemForm