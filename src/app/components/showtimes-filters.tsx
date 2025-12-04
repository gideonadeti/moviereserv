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
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ShowtimesFiltersProps {
  title: string;
  startDate: string | null;
  endDate: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  effectiveMinPrice: number;
  effectiveMaxPrice: number;
  hasActiveFilters: boolean;
  onlyWithReservations: boolean;
  onTitleChange: (value: string) => void;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  onToggleOnlyWithReservations: () => void;
  onClearFilters: () => void;
}

const ShowtimesFilters = ({
  title,
  startDate,
  endDate,
  minPrice,
  maxPrice,
  effectiveMinPrice,
  effectiveMaxPrice,
  hasActiveFilters,
  onTitleChange,
  onStartDateChange,
  onEndDateChange,
  onPriceRangeChange,
  onlyWithReservations,
  onToggleOnlyWithReservations,
  onClearFilters,
}: ShowtimesFiltersProps) => {
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

  const sliderMin = effectiveMinPrice;
  const sliderMax = effectiveMaxPrice;

  const sliderValues =
    minPrice != null && maxPrice != null
      ? [minPrice, maxPrice]
      : [sliderMin, sliderMax];

  const hasPriceFilter = minPrice != null || maxPrice != null;

  return (
    <div className="space-y-4">
      {/* Title search */}
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Search by movie title..."
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </InputGroup>

      {/* Date range / price range / user reservations */}
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

        {/* Price range */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <span>
                  {hasPriceFilter
                    ? `Price: $${Math.round(sliderValues[0])} - $${Math.round(
                        sliderValues[1]
                      )}`
                    : "Filter by price"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Price range</span>
                  <span className="text-muted-foreground">
                    ${Math.round(sliderValues[0])} - $
                    {Math.round(sliderValues[1])}
                  </span>
                </div>
                <Slider
                  min={sliderMin}
                  max={sliderMax}
                  step={1}
                  value={sliderValues}
                  onValueChange={([nextMin, nextMax]) => {
                    const normalizedMin = Math.min(nextMin, nextMax);
                    const normalizedMax = Math.max(nextMin, nextMax);

                    if (
                      normalizedMin === sliderMin &&
                      normalizedMax === sliderMax
                    ) {
                      onPriceRangeChange(null, null);
                    } else {
                      onPriceRangeChange(normalizedMin, normalizedMax);
                    }
                  }}
                />
                {hasPriceFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => onPriceRangeChange(null, null)}
                  >
                    <X className="mr-2 size-4" />
                    Clear price filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Only showtimes I've reserved */}
        <div className="flex items-center gap-2 sm:w-[260px]">
          <Checkbox
            id="only-with-reservations"
            checked={onlyWithReservations}
            onCheckedChange={onToggleOnlyWithReservations}
          />
          <Label
            htmlFor="only-with-reservations"
            className="cursor-pointer text-sm font-normal"
          >
            Only showtimes I&apos;ve reserved
          </Label>
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

export default ShowtimesFilters;
