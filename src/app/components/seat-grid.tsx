"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Seat } from "../types/auditorium";

interface SeatGridProps {
  seats: Seat[];
  reservedSeatIds: Set<string>;
  selectedSeatIds: string[];
  onSeatToggle: (seatId: string) => void;
}

const SeatGrid = ({
  seats,
  reservedSeatIds,
  selectedSeatIds,
  onSeatToggle,
}: SeatGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter seats based on search query
  const filteredSeats = useMemo(() => {
    if (!searchQuery.trim()) {
      return seats;
    }
    const query = searchQuery.toLowerCase().trim();
    return seats.filter((seat) => seat.label.toLowerCase().includes(query));
  }, [seats, searchQuery]);

  // Group seats by row (assuming labels like "A1", "A2", "B1", etc.)
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};

    filteredSeats.forEach((seat) => {
      // Extract row letter (e.g., "A" from "A1" or "A10")
      const rowMatch = seat.label.match(/^([A-Z]+)/);
      const row = rowMatch ? rowMatch[1] : "Other";

      if (!grouped[row]) {
        grouped[row] = [];
      }
      grouped[row].push(seat);
    });

    // Sort rows alphabetically
    const sortedRows = Object.keys(grouped).sort();

    // Sort seats within each row by number
    sortedRows.forEach((row) => {
      grouped[row].sort((a, b) => {
        const numA = parseInt(a.label.replace(/^[A-Z]+/, "")) || 0;
        const numB = parseInt(b.label.replace(/^[A-Z]+/, "")) || 0;
        return numA - numB;
      });
    });

    return sortedRows.map((row) => ({
      row,
      seats: grouped[row],
    }));
  }, [filteredSeats]);

  const getSeatState = (seatId: string) => {
    if (reservedSeatIds.has(seatId)) {
      return "reserved";
    }
    if (selectedSeatIds.includes(seatId)) {
      return "selected";
    }
    return "available";
  };

  const handleSeatClick = (seatId: string) => {
    if (!reservedSeatIds.has(seatId)) {
      onSeatToggle(seatId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search seats (e.g., A1, B5)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Seat Grid */}
      <div className="space-y-3 pb-2 max-h-[200px] overflow-y-auto">
        {seatsByRow.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No seats found matching "{searchQuery}"
          </div>
        ) : (
          seatsByRow.map(({ row, seats: rowSeats }) => (
            <div key={row} className="space-y-1">
              {/* Row Label */}
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Row {row}
              </div>
              {/* Seats in Row */}
              <div className="flex flex-wrap gap-2">
                {rowSeats.map((seat) => {
                  const state = getSeatState(seat.id);
                  return (
                    <Button
                      key={seat.id}
                      type="button"
                      variant={
                        state === "selected"
                          ? "default"
                          : state === "reserved"
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                      disabled={state === "reserved"}
                      onClick={() => handleSeatClick(seat.id)}
                      className={`h-8 min-w-12 ${
                        state === "reserved"
                          ? "opacity-50 cursor-not-allowed"
                          : state === "selected"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary/10"
                      }`}
                      title={
                        state === "reserved"
                          ? `${seat.label} - Reserved`
                          : state === "selected"
                          ? `${seat.label} - Selected`
                          : `${seat.label} - Available`
                      }
                    >
                      {seat.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t text-xs">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded border border-border bg-background" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-secondary opacity-50" />
          <span className="text-muted-foreground">Reserved</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
