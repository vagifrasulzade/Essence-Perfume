"use client";
import { useEffect, useState } from "react";

const KEY = "shop_filters_v1";

export type FilterState = {
  searchQuery: string;
  selectedBrands: string[];
  selectedGenders: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
  currentPage: number;
  itemsPerPage: number;
};

export const DEFAULT: FilterState = {
  searchQuery: "",
  selectedBrands: [],
  selectedGenders: [],
  priceRange: [0, 350],
  minRating: 0,
  sortBy: "featured",
  currentPage: 1,
  itemsPerPage: 6,
};

export function usePersist(initial: FilterState = DEFAULT) {
  const [state, setState] = useState<FilterState>(initial);

  // 1) Hydrate: URL → localStorage → default
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const saved = localStorage.getItem(KEY);
    const fromLS = saved ? (JSON.parse(saved) as Partial<FilterState>) : {};

    const fromURL: Partial<FilterState> = {
      searchQuery: params.get("q") ?? undefined,
      sortBy: params.get("sort") ?? undefined,
      minRating: params.get("rating") ? Number(params.get("rating")) : undefined,
      currentPage: params.get("page") ? Number(params.get("page")) : undefined,
      itemsPerPage: params.get("pageSize") ? Number(params.get("pageSize")) : undefined,
      selectedBrands: params.get("brands")?.split(",").filter(Boolean),
      selectedGenders: params.get("genders")?.split(",").filter(Boolean),
      priceRange: params.get("price")
        ? (params
            .get("price")!
            .split("-")
            .map(Number) as [number, number])
        : undefined,
    };

    setState({
      ...initial,
      ...fromLS,
      ...Object.fromEntries(
        Object.entries(fromURL).filter(([, v]) => v !== undefined)
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Persist: localStorage + URL sync
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));

    const p = new URLSearchParams();
    if (state.searchQuery) p.set("q", state.searchQuery);
    if (state.selectedBrands.length) p.set("brands", state.selectedBrands.join(","));
    if (state.selectedGenders.length) p.set("genders", state.selectedGenders.join(","));
    if (state.priceRange) p.set("price", `${state.priceRange[0]}-${state.priceRange[1]}`);
    if (state.minRating) p.set("rating", String(state.minRating));
    if (state.sortBy && state.sortBy !== "featured") p.set("sort", state.sortBy);
    if (state.currentPage > 1) p.set("page", String(state.currentPage));
    if (state.itemsPerPage !== 6) p.set("pageSize", String(state.itemsPerPage));

    const url = `${window.location.pathname}${p.toString() ? "?" + p.toString() : ""}`;
    window.history.replaceState(null, "", url);
  }, [state]);

  return { state, setState };
}
