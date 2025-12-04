"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ShowtimesSortField,
  ShowtimesSortOrder,
} from "../hooks/use-showtimes-filter";

interface ShowtimesSortProps {
  sortBy: ShowtimesSortField;
  sortOrder: ShowtimesSortOrder;
  onSortChange: (
    sortBy: ShowtimesSortField,
    sortOrder: ShowtimesSortOrder
  ) => void;
}

const ShowtimesSort = ({
  sortBy,
  sortOrder,
  onSortChange,
}: ShowtimesSortProps) => {
  const handleValueChange = (value: string) => {
    const [field, order] = value.split("-") as [
      ShowtimesSortField,
      ShowtimesSortOrder
    ];
    onSortChange(field, order);
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="showtimes-sort-select" className="text-sm">
        Sort by
      </Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger id="showtimes-sort-select" className="w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="startTime-asc">Time (Earliest)</SelectItem>
          <SelectItem value="startTime-desc">Time (Latest)</SelectItem>
          <SelectItem value="price-asc">Price (Lowest)</SelectItem>
          <SelectItem value="price-desc">Price (Highest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShowtimesSort;
