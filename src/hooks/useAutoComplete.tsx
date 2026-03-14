import { useEffect, useState } from "react";

type FetchFn<T> = (query: string) => Promise<T[]>;

export function useAutocomplete<T>(fetchFn: FetchFn<T>, initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFn(query);
        if (!cancelled) setResults(data);
      } catch (e) {
        if (!cancelled) setError("Failed to fetch suggestions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const id = setTimeout(run, 300); // small debounce
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query, fetchFn]);

  return { query, setQuery, results, loading, error };
}
