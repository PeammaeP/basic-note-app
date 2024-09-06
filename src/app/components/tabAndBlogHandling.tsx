import React, { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponent from "./tabComponent";
import BlogComponent from "./blogComponent";
import { v5 as uuidv5 } from "uuid";

const TabStatusAndBlog: React.FC<ApiResponseSchema> = ({
  tasks,
  pageNumber,
  totalPages,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const statuses = ["TODO", "DOING", "DONE"];

  const currentPageRef = useRef(pageNumber);
  const NAMESPACE = "c62d3bcf-02ae-446f-a24d-b2fee34c983a";

  const fetchTasksForTab = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const API = `https://todo-list-api-mfchjooefq-as.a.run.app/todo-list?status=${status}&offset=0&limit=10&sortBy=createdAt&isAsc=true`;
      const response = await fetch(API);
      const data = await response.json();
      if (data.tasks) {
        setTaskList(data.tasks);
        setCurrentOffset(0);
        currentPageRef.current = 0;
      }
    } catch (error) {
      console.error("Error fetching tasks for selected tab:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const LoadMoreTasks = useCallback(async () => {
    if (loading || currentPageRef.current >= totalPages) return;

    setLoading(true);

    const nextOffset = currentOffset + 1;

    const API = `https://todo-list-api-mfchjooefq-as.a.run.app/todo-list?status=${statuses[selectedTab]}&offset=${nextOffset}&limit=10&sortBy=createdAt&isAsc=true`;

    try {
      const response = await fetch(API);
      const data = await response.json();
      if (data.tasks && data.tasks.length > 0) {
        setTaskList((prevTask) => [...prevTask, ...data.tasks]);
        setCurrentOffset(nextOffset);
      }
    } catch (error) {
      console.error("Can't Fetch API!", error);
    } finally {
      setLoading(false);
    }
  }, [loading, currentOffset, selectedTab, statuses, totalPages]);

  const handleTabChange = async (index: number) => {
    setSelectedTab(index);
    setCurrentOffset(0);
    fetchTasksForTab(statuses[index]);
  };

  const handleScroll = useCallback(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.scrollHeight;
    const isNearBottom = bottomPosition - scrollPosition <= 500;

    if (isNearBottom && !loading && currentPageRef.current < totalPages) {
      LoadMoreTasks();
    }
  }, [loading, LoadMoreTasks, totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredTasks = (status: string) => {
    return taskList.filter((task) => task.status === status);
  };

  const groupTasksByDate = (filteredTasks: Task[]) => {
    return filteredTasks.reduce((groups, task) => {
      const date = format(task.createdAt, "MMMM dd, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  return (
    <div className="min-h-[4000px] flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup onChange={handleTabChange}>
          <TabList className="flex gap-4">
            {statuses.map((status) => (
              <TabComponent
                key={status}
                selectedTab={statuses[selectedTab]}
                targetTab={status}
              />
            ))}
          </TabList>

          <TabPanels className="mt-3">
            {statuses.map((status) => (
              <TabPanel key={status}>
                {Object.entries(groupTasksByDate(filteredTasks(status)))
                  .length === 0 ? (
                  <p className="text-yellow-50 font-thin font-mono">
                    Loading State ...
                  </p>
                ) : (
                  Object.entries(groupTasksByDate(filteredTasks(status))).map(
                    ([date, tasksOnDate], dateIndex) => (
                      <div key={`${uuidv5(date, NAMESPACE)}-${dateIndex}`}>
                        <section className="text-white font-semibold mb-2 font-mono p-2">
                          {date}
                        </section>
                        <ul
                          key={`${uuidv5(
                            `${date}-tasks`,
                            NAMESPACE
                          )}-${dateIndex}`}
                        >
                          {tasksOnDate.map(
                            (
                              { id, title, description, createdAt },
                              taskIndex
                            ) => (
                              <BlogComponent
                                key={`${uuidv5(id, NAMESPACE)}-${taskIndex}`}
                                id={id}
                                title={title}
                                description={description}
                                createdAt={createdAt}
                              />
                            )
                          )}
                        </ul>
                      </div>
                    )
                  )
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
        {loading && (
          <p className="font-thin font-mono p-3">Loading more tasks...</p>
        )}
        {currentPageRef.current > totalPages && (
          <p className="font-bold text-red-300">No more tasks to load. 😱</p>
        )}
      </div>
    </div>
  );
};

export default TabStatusAndBlog;
