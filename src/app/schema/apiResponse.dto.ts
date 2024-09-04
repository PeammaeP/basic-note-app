import Task from "./taskSchema.dto";

interface ApiResponseSchema {
  tasks: Task[];
  pageNumber: number; // determine the offset in query parameters
  totalPages: number;
}

export default ApiResponseSchema;
