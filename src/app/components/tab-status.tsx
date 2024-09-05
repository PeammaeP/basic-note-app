import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponent from "./tab-component";

const TabStatusAndBlog: React.FC<ApiResponseSchema> = ({ tasks }) => {
  const [selectedTab, setSelectedTab] = useState("DOING");

  // Function to handle tab change and update selectedTab correctly
  const handleTabChange = (index: number) => {
    const statuses = ["TODO", "DOING", "DONE"];
    setSelectedTab(statuses[index]);
  };

  // Filter tasks based on the selected tab (status)
  const filteredTasks = () => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks.filter((task) => task.status === selectedTab);
  };

  // Group the filtered tasks by their creation date
  const groupTasksByDate = (filteredTasks: Task[]) => {
    return filteredTasks.reduce((groups, task) => {
      const date = format(new Date(task.createdAt), "MMMM dd, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  const filteredAndGroupedTasks = groupTasksByDate(filteredTasks());

  // debugging response
  useEffect(() => {
    console.log("Selected tab is:", selectedTab);
    console.log("Filtered tasks:", filteredTasks());
  }, [selectedTab, tasks]);

  return (
    <div className="flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup onChange={handleTabChange}>
          <TabList className="flex gap-4">
            <TabComponent selectedTab={selectedTab} targetTab="TODO" />
            <TabComponent selectedTab={selectedTab} targetTab="DOING" />
            <TabComponent selectedTab={selectedTab} targetTab="DONE" />
          </TabList>
          <TabPanels className="mt-3">
            <TabPanel>
              {Object.entries(filteredAndGroupedTasks).length === 0 ? (
                <p className="text-white">
                  No tasks available for this status.
                </p>
              ) : (
                Object.entries(filteredAndGroupedTasks).map(
                  ([date, tasksOnDate]) => (
                    <div key={date}>
                      <h2 className="text-white font-semibold mb-2">{date}</h2>
                      <ul>
                        {tasksOnDate.map(
                          ({ id, title, description, createdAt }) => (
                            <li
                              key={id}
                              className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
                            >
                              <a href="#" className="font-semibold text-white">
                                <span className="absolute inset-0" />
                                {title}
                              </a>
                              <ul
                                className="flex gap-2 text-white/50"
                                aria-hidden="true"
                              >
                                <li>
                                  {format(new Date(createdAt), "hh:mm a")}
                                </li>
                                <li aria-hidden="true">&middot;</li>
                                <li>{description}</li>
                              </ul>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                )
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default TabStatusAndBlog;
