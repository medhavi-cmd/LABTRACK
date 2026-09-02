import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Debounces a value. Used so typing in a search box doesn't fire a request
 * per keystroke.
 */
export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Drives a server-filtered list.
 *
 * Owns the search / filter / sort state, debounces the search term, and
 * refetches whenever any of them change. Filtering and sorting happen in SQL,
 * so the rows returned here are rendered as-is.
 *
 * @param {(params: object, signal: AbortSignal) => Promise<any>} fetcher
 *        receives { search, sortField, sortDir, ...filters } and an AbortSignal
 * @param {object} [options]
 * @param {object} [options.initialFilters] extra filter values, e.g. { status: "all" }
 * @param {string} [options.initialSortField]
 * @param {"asc"|"desc"} [options.initialSortDir]
 */
export function useListQuery(fetcher, options = {}) {
  const {
    initialFilters = {},
    initialSortField = "",
    initialSortDir = "asc",
  } = options;

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDir, setSortDir] = useState(initialSortDir);

  const [data, setData] = useState([]);
  const [extra, setExtra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  // Keep the latest fetcher without making it a re-fetch trigger, so callers
  // don't have to memoize it.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const result = await fetcherRef.current(
          {
            search: debouncedSearch.trim(),
            sortField,
            sortDir,
            ...JSON.parse(filterKey),
          },
          controller.signal
        );

        if (!active) return;

        // Accept either a bare array or { data, ...rest }.
        if (Array.isArray(result)) {
          setData(result);
          setExtra(null);
        } else {
          const { data: rows, ...rest } = result ?? {};
          setData(Array.isArray(rows) ? rows : []);
          setExtra(rest);
        }
      } catch (err) {
        if (!active || err.name === "AbortError") return;
        setError(err.message || "Failed to load data.");
        setData([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedSearch, sortField, sortDir, filterKey, reloadToken]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSort = useCallback((field) => {
    setSortField((currentField) => {
      if (currentField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return currentField;
      }
      setSortDir("asc");
      return field;
    });
  }, []);

  return useMemo(
    () => ({
      data,
      extra,
      loading,
      error,
      search,
      setSearch,
      filters,
      setFilter,
      sortField,
      sortDir,
      handleSort,
      setSortField,
      setSortDir,
      reload,
    }),
    [data, extra, loading, error, search, filters, setFilter, sortField, sortDir, handleSort, reload]
  );
}

/** Serializes params into a query string, dropping empty/"all" values. */
export function toQueryString(params = {}) {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const str = String(value).trim();
    if (!str || str.toLowerCase() === "all") return;
    qs.append(key, str);
  });

  const s = qs.toString();
  return s ? `?${s}` : "";
}
