import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface TableActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button 
        onClick={(e) => { e.stopPropagation(); onView(); }}
        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors" 
        title="View Details"
      >
        <Eye size={16} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="p-1.5 rounded-lg text-primary hover:bg-blue-50 dark:hover:bg-blue-400/10 transition-colors" 
        title="Edit Record"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors" 
        title="Delete Record"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
