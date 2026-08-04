"use client";

import { useEffect, useState } from "react";
import SearchAsideInput from "../_components/SearchAsideInput";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

const ExplorePage = () => {
  const [input, setInput] = useState("");
  const debouncedSearchTerm = useDebounce(input, 400);

  const fetchSearchResults = async (query: string, signal: AbortSignal) => {
    if (query.length <= 2) return;

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token required");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/search?q=${encodeURIComponent(query)}`,
      {
        signal,
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) throw new Error("Search failed");

    const result = await response.json();
    return result;
  };

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: ({ signal }) => fetchSearchResults(debouncedSearchTerm, signal),
  });

  console.log("Query: ", result);

  return (
    <div className="max-w-2xl flex flex-col">
      <div className="self-start justify-start mt-2">
        <SearchAsideInput
          value={input}
          onChange={setInput}
          loading={isLoading}
          users={result?.data ? result.data : []}
          error={isError}
        />
      </div>
    </div>
  );
};

export default ExplorePage;
