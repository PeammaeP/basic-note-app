"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabStatusAndBlog from "../components/tabAndBlogHandling";

const fetcher = (url: string): Promise<ApiResponseSchema> =>
  fetch(url).then((res) => res.json());

export default function ApiHandling() {
  const searchParams = useSearchParams();

  // Parse query parameters and handle defaults
  const noteStatus = searchParams.get("status") || "";
  const offsetNumber = Number(searchParams.get("offset")) || 0;
  const limitNumber = Number(searchParams.get("limit")) || 10;
  const sortingByCondition = searchParams.get("sortBy") || "createdAt";
  const isAscending = searchParams.get("isAsc") === "true"; // Handle boolean conversion
  const API = noteStatus
    ? `https://todo-list-api-mfchjooefq-as.a.run.app/todo-list?status=${noteStatus}&offset=${offsetNumber}&limit=${limitNumber}&sortBy=${sortingByCondition}&isAsc=${isAscending}`
    : `https://todo-list-api-mfchjooefq-as.a.run.app/todo-list?offset=${offsetNumber}&limit=${limitNumber}&sortBy=${sortingByCondition}&isAsc=${isAscending}`;

  const { data, error, isLoading } = useSWR<ApiResponseSchema>(API, fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <div className="text-red-500 font-mono font-bold">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-yellow-50 font-mono font-thin">Loading... 📢</div>
    );
  }

  if (!data || !data.tasks) {
    return (
      <div className="text-red-500 font-mono font-bold">
        Error: No Data Available
      </div>
    );
  }

  return (
    <div>
      <TabStatusAndBlog
        tasks={data.tasks}
        pageNumber={data.pageNumber}
        totalPages={data.totalPages}
      />
    </div>
  );
}
