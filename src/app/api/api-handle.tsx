"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabStatus from "../components/tab";

const fetcher = (url: string): Promise<ApiResponseSchema> =>
  fetch(url).then((res) => res.json());

export default function ApiHandling() {
  const searchParams = useSearchParams();

  const noteStatus = searchParams.get("status") || "TODO";
  const offsetNumber = searchParams.get("offset") || 1;
  const limitNumber = searchParams.get("limit") || 10;
  const sortingByCondition = searchParams.get("sortBy") || "createdAt";
  const isAscending = searchParams.get("isAsc") || true;

  const { data, error, isLoading } = useSWR<ApiResponseSchema>(
    `https://todo-list-api-mfchjooefq-as.a.run.app/todo-list?status=${noteStatus}&offset=${offsetNumber}&limit=${limitNumber}&sortBy=${sortingByCondition}&isAsc=${isAscending}`,
    fetcher
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data === undefined || data == null) {
    console.log("Data is undefined");
    return <div>Error To Fetch Data, No Data</div>;
  }

  return (
    <div>
      <TabStatus
        tasks={data.tasks}
        pageNumber={data.pageNumber}
        totalPages={data.totalPages}
      />
      Hello World
    </div>
  );
}
