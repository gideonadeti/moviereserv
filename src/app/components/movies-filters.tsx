"use client";

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface MoviesFiltersProps {
  title: string;
  onTitleChange: (value: string) => void;
}

const MoviesFilters = ({ title, onTitleChange }: MoviesFiltersProps) => {

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default MoviesFilters;

