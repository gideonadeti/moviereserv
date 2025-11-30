"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortField, SortOrder } from "../hooks/use-movies-filter";

interface MoviesSortProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
}

const MoviesSort = ({ sortBy, sortOrder, onSortChange }: MoviesSortProps) => {
  const handleValueChange = (value: string) => {
    const [field, order] = value.split("-") as [SortField, SortOrder];
    onSortChange(field, order);
  };

  const currentValue = `${sortBy}-${sortOrder}`;

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-select" className="text-sm">
        Sort by:
      </Label>
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger id="sort-select" className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          <SelectItem value="date-desc">Release Date (Newest)</SelectItem>
          <SelectItem value="date-asc">Release Date (Oldest)</SelectItem>
          <SelectItem value="rating-desc">Rating (Highest)</SelectItem>
          <SelectItem value="rating-asc">Rating (Lowest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MoviesSort;
