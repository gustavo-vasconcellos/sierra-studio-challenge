"use client";

import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface FileActionsProps {
  fileId: string;
  onDelete?: () => void;
}

export function FileActions({ fileId, onDelete }: FileActionsProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete?.();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button size="sm" variant="destructive" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
}
