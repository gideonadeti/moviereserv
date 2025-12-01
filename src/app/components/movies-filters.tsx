"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Genre } from "../types/movie";

interface MoviesFiltersProps {
  title: string;
  startDate: string | null;
  endDate: string | null;
  selectedGenreIds: number[];
  genres: Genre[];
  availableGenreIds: Set<number>;
  hasActiveFilters: boolean;
  onTitleChange: (value: string) => void;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
  onToggleGenre: (genreId: number) => void;
  onClearFilters: () => void;
}

const MoviesFilters = ({
  title,
  startDate,
  endDate,
  selectedGenreIds,
  genres,
  availableGenreIds,
  hasActiveFilters,
  onTitleChange,
  onStartDateChange,
  onEndDateChange,
  onToggleGenre,
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

  const availableGenres = useMemo(
    () => genres.filter((genre) => availableGenreIds.has(genre.id)),
    [genres, availableGenreIds]
  );

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
        {/* Genres */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <span>
                  {selectedGenreIds.length > 0
                    ? `${selectedGenreIds.length} genre${
                        selectedGenreIds.length > 1 ? "s" : ""
                      } selected`
                    : "Filter by genre"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="start">
              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                  {availableGenres.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No genres available
                    </p>
                  ) : (
                    availableGenres.map((genre) => (
                      <div
                        key={genre.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`genre-${genre.id}`}
                          checked={selectedGenreIds.includes(genre.id)}
                          onCheckedChange={() => onToggleGenre(genre.id)}
                        />
                        <Label
                          htmlFor={`genre-${genre.id}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {genre.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
