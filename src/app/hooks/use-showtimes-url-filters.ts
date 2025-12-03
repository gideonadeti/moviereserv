"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  defaultShowtimesFilters,
  type ShowtimesFilterState,
  type ShowtimesSortField,
  type ShowtimesSortOrder,
} from "./use-showtimes-filter";

const parseNumberOrNull = (value: string | null) => {
  if (value == null) return null;
  const parsed = Number.parseFloat(value);

  return Number.isNaN(parsed) ? null : parsed;
};

const buildFiltersFromSearchParams = (
  params: URLSearchParams
): ShowtimesFilterState => {
  const title = params.get("title") ?? defaultShowtimesFilters.title;
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  const minPrice = parseNumberOrNull(params.get("minPrice"));
  const maxPrice = parseNumberOrNull(params.get("maxPrice"));

  const sortBy =
    (params.get("sortBy") as ShowtimesSortField | null) ??
    defaultShowtimesFilters.sortBy;

  const sortOrder =
    (params.get("sortOrder") as ShowtimesSortOrder | null) ??
    defaultShowtimesFilters.sortOrder;

  return {
    ...defaultShowtimesFilters,
    title,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  };
};

const buildSearchParamsFromFilters = (
  filters: ShowtimesFilterState,
  baseSearchParamsString: string
): URLSearchParams => {
  const params = new URLSearchParams(baseSearchParamsString);
  const trimmedTitle = filters.title.trim();

  if (trimmedTitle) {
    params.set("title", trimmedTitle);
  } else {
    params.delete("title");
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  } else {
    params.delete("startDate");
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  } else {
    params.delete("endDate");
  }

  if (filters.minPrice != null) {
    params.set("minPrice", String(filters.minPrice));
  } else {
    params.delete("minPrice");
  }

  if (filters.maxPrice != null) {
    params.set("maxPrice", String(filters.maxPrice));
  } else {
    params.delete("maxPrice");
  }

  if (filters.sortBy !== defaultShowtimesFilters.sortBy) {
    params.set("sortBy", filters.sortBy);
  } else {
    params.delete("sortBy");
  }

  if (filters.sortOrder !== defaultShowtimesFilters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  } else {
    params.delete("sortOrder");
  }

  return params;
};

const replaceUrlIfChanged = (
  router: ReturnType<typeof useRouter>,
  pathname: string,
  currentSearchParamsString: string,
  nextParams: URLSearchParams
) => {
  const nextSearch = nextParams.toString();
  const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
  const currentSearch = currentSearchParamsString;
  const currentUrl = currentSearch ? `${pathname}?${currentSearch}` : pathname;

  if (nextUrl !== currentUrl) {
    router.replace(nextUrl, { scroll: false });
  }
};

export const useShowtimesUrlFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [titleInput, setTitleInput] = useState<string>(() => {
    return searchParams.get("title") ?? "";
  });

  const searchParamsString = searchParams.toString();
  const filters = useMemo(
    () => buildFiltersFromSearchParams(new URLSearchParams(searchParamsString)),
    [searchParamsString]
  );

  // Sync input from URL when filters change
  useEffect(() => {
    setTitleInput(filters.title ?? "");
  }, [filters.title]);

  // Debounce input changes into the URL (single source of truth)
  useEffect(() => {
    const handle = setTimeout(() => {
      const nextFilters: ShowtimesFilterState = {
        ...filters,
        title: titleInput,
      };

      const nextParams = buildSearchParamsFromFilters(
        nextFilters,
        searchParamsString
      );

      replaceUrlIfChanged(router, pathname, searchParamsString, nextParams);
    }, 300);

    return () => clearTimeout(handle);
  }, [titleInput, filters, pathname, router, searchParamsString]);

  const replaceFiltersInUrl = (nextFilters: ShowtimesFilterState) => {
    const nextParams = buildSearchParamsFromFilters(
      nextFilters,
      searchParamsString
    );

    replaceUrlIfChanged(router, pathname, searchParamsString, nextParams);
  };

  return {
    filters,
    titleInput,
    setTitleInput,
    replaceFiltersInUrl,
  };
};
