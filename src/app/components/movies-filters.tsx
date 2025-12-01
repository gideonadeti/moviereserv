"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MoviesFiltersProps {
  title: string;
  startDate: string | null;
  endDate: string | null;
  hasActiveFilters: boolean;
  onTitleChange: (value: string) => void;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
  onClearFilters: () => void;
}

const MoviesFilters = ({
  title,
  startDate,
  endDate,
  hasActiveFilters,
  onTitleChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: MoviesFiltersProps) => {
  const startDateObj = useMemo(() => {
    if (!startDate) return undefined;

    try {
      const parsed = parseISO(startDate);

      return isValid(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [startDate]);

  const endDateObj = useMemo(() => {
    if (!endDate) return undefined;

    try {
      const parsed = parseISO(endDate);

      return isValid(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [endDate]);

  return (
    <div className="space-y-4">
      {/* Title search */}
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Search by title..."
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </InputGroup>

      {/* Date range */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <DatePickerField
          label="Start date"
          date={startDateObj}
          onDateChange={(date) =>
            onStartDateChange(date ? format(date, "yyyy-MM-dd") : null)
          }
        />

        <DatePickerField
          label="End date"
          date={endDateObj}
          onDateChange={(date) =>
            onEndDateChange(date ? format(date, "yyyy-MM-dd") : null)
          }
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters}>
          <X className="size-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

interface DatePickerFieldProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DatePickerField = ({
  label,
  date,
  onDateChange,
}: DatePickerFieldProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[200px]",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "LLL dd, y") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};

export default MoviesFilters;
