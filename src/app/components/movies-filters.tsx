"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
import type { FilterState } from "../hooks/use-movies-filter";
import type { Genre } from "../types/movie";

interface MoviesFiltersProps {
  genres: Genre[];
  availableGenreIds: Set<number>; // Only genres that exist in current movie list
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const MoviesFilters = ({
  genres,
  availableGenreIds,
  filters,
  onFiltersChange,
}: MoviesFiltersProps) => {
  const [titleInput, setTitleInput] = useState(filters.title);
  const filtersRef = useRef(filters);

  // Keep ref in sync with filters
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Debounce title search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filtersRef.current, title: titleInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [titleInput, onFiltersChange]);

  // Filter genres to only show those available in movies
  const availableGenres = useMemo(
    () => genres.filter((genre) => availableGenreIds.has(genre.id)),
    [genres, availableGenreIds]
  );

  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      startDate: date ? format(date, "yyyy-MM-dd") : null,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      endDate: date ? format(date, "yyyy-MM-dd") : null,
    });
  };

  const handleGenreToggle = (genreId: number) => {
    const newGenreIds = filters.genreIds.includes(genreId)
      ? filters.genreIds.filter((id) => id !== genreId)
      : [...filters.genreIds, genreId];

    onFiltersChange({ ...filters, genreIds: newGenreIds });
  };

  const clearFilters = () => {
    setTitleInput("");
    onFiltersChange({
      ...filters,
      title: "",
      startDate: null,
      endDate: null,
      genreIds: [],
    });
  };

  const startDate = useMemo(() => {
    return filters.startDate ? parseISO(filters.startDate) : undefined;
  }, [filters.startDate]);

  const endDate = useMemo(() => {
    return filters.endDate ? parseISO(filters.endDate) : undefined;
  }, [filters.endDate]);

  const hasActiveFilters =
    filters.title.trim() !== "" ||
    filters.startDate !== null ||
    filters.endDate !== null ||
    filters.genreIds.length > 0;

  return (
    <div className="space-y-4">
      {/* Title Search */}
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Search by title..."
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </InputGroup>

      {/* Date Range and Genre Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Start Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[200px]",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {startDate ? (
                format(startDate, "LLL dd, y")
              ) : (
                <span>Start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>

        {/* End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal sm:w-[200px]",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {endDate ? format(endDate, "LLL dd, y") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateChange}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>

        {/* Genre Filter */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <span>
                  {filters.genreIds.length > 0
                    ? `${filters.genreIds.length} genre${
                        filters.genreIds.length > 1 ? "s" : ""
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
                          checked={filters.genreIds.includes(genre.id)}
                          onCheckedChange={() => handleGenreToggle(genre.id)}
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

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          <X />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default MoviesFilters;
