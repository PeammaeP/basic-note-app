import React, { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponent from "./tabComponent";
import BlogComponent from "./blogComponent";

const TabStatusAndBlog: React.FC<ApiResponseSchema> = ({
  tasks,
  pageNumber,
  totalPages,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [taskList, setTaskList] = useState<Task[]>(tasks); // display all task
  const [currentOffset, setCurrentOffset] = useState(pageNumber); // Tracks current offset
  const [loading, setLoading] = useState(false); // loading State
  const statuses = ["TODO", "DOING", "DONE"];

  const currentPageRef = useRef(pageNumber);

  // implement feature loading more task
  const LoadMoreTasks = useCallback(async () => {
    if (loading || currentPageRef.current >= totalPages) return;

    setLoading(true);

    const nextOffset = currentOffset + 1;

    const API = `https://todo-list-api-mfchjooefq-as.a.run.app/todo-list?offset=${nextOffset}&limit=10&sortBy=createdAt&isAsc=true`;

    try {
      const response = await fetch(API).then((res) => res.json());

      if (
        !(currentOffset > totalPages) &&
        response.tasks &&
        response.tasks.length > 0
      ) {
        console.log(response.tasks);
        setTaskList((prevTasks) => [...prevTasks, ...response.tasks]);
        setCurrentOffset(nextOffset);
        // currentPageRef.current += 1;
      }
    } catch (error) {
      return (
        <div className="text-red-400 font-mono font-bold">
          {" "}
          Can't Fetch API !
        </div>
      );
    } finally {
      setLoading(false);
    }
    if (currentOffset > totalPages) {
      setLoading(false);
    }
  }, [loading, currentOffset, selectedTab, totalPages]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      currentPageRef.current <= totalPages
    ) {
      // Load more dat
      // setTimeout(LoadMoreTasks, 1000);
      LoadMoreTasks();
    }
  }, [loading, LoadMoreTasks, totalPages]);

  // Add scroll event listener
  useEffect(() => {
    if (currentOffset <= totalPages) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Handle tab change by index
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    const handleTab = () => {
      setCurrentOffset(0); // Reset offset for the new tab
      currentPageRef.current = 0; // Reset page ref for the new tab
    };
    handleTab();
  };

  // Filter tasks based on selected tab's status (TODO, DOING, DONE)
  const filteredTasks = (status: string) => {
    return taskList.filter((task) => task.status === status);
  };

  // Group tasks by created date
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
    <div className="flex h-screen w-full justify-center pt-24 px-4">
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
                    No tasks available for this status ❌.
                  </p>
                ) : (
                  Object.entries(groupTasksByDate(filteredTasks(status))).map(
                    ([date, tasksOnDate]) => (
                      <div key={date}>
                        <section className="text-white font-semibold mb-2 font-mono p-2">
                          {date}
                        </section>
                        <ul key={`${date}-${status}`}>
                          {tasksOnDate.map(
                            ({ id, title, description, createdAt }) => (
                              <BlogComponent
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
          <p className="font-light font-mono p-3">Loading more tasks... 🌟</p>
        )}
        {currentPageRef.current > totalPages && (
          <p className="font-bold text-red-300">No more tasks to load. 😱</p>
        )}
      </div>
    </div>
  );
};

export default TabStatusAndBlog;
