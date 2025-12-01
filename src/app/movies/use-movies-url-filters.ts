"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { defaultFilters, type FilterState } from "../hooks/use-movies-filter";

const buildFiltersFromSearchParams = (params: URLSearchParams): FilterState => {
  const title = params.get("title") ?? defaultFilters.title;
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const genreIdsParam = params.get("genreIds");
  const genreIds =
    genreIdsParam && genreIdsParam.length > 0
      ? genreIdsParam
          .split(",")
          .map((value) => Number.parseInt(value, 10))
          .filter((value) => !Number.isNaN(value))
      : defaultFilters.genreIds;

  const sortBy =
    (params.get("sortBy") as FilterState["sortBy"]) ?? defaultFilters.sortBy;

  const sortOrder =
    (params.get("sortOrder") as FilterState["sortOrder"]) ??
    defaultFilters.sortOrder;

  return {
    ...defaultFilters,
    title,
    startDate,
    endDate,
    genreIds,
    sortBy,
    sortOrder,
  };
};

const buildSearchParamsFromFilters = (
  filters: FilterState,
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

  if (filters.genreIds.length > 0) {
    params.set("genreIds", filters.genreIds.join(","));
  } else {
    params.delete("genreIds");
  }

  if (filters.sortBy !== defaultFilters.sortBy) {
    params.set("sortBy", filters.sortBy);
  } else {
    params.delete("sortBy");
  }

  if (filters.sortOrder !== defaultFilters.sortOrder) {
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

export const useMoviesUrlFilters = () => {
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
      const nextFilters: FilterState = {
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

  const replaceFiltersInUrl = (nextFilters: FilterState) => {
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
