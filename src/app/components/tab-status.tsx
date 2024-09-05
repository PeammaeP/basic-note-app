import React, { useState } from "react";
import { format } from "date-fns";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponent from "./tab-component";

const TabStatusAndBlog: React.FC<ApiResponseSchema> = ({ tasks }) => {
  const [selectedTab, setSelectedTab] = useState(0); // Use index to track selected tab

  const statuses = ["TODO", "DOING", "DONE"];

  // Handle tab change by index
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  // Filter tasks based on selected tab's status (TODO, DOING, DONE)
  const filteredTasks = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  // Group tasks by created date
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

  return (
    <div className="flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup onChange={handleTabChange}>
          {/* TabList: Render tabs for TODO, DOING, DONE */}
          <TabList className="flex gap-4">
            {statuses.map((status, index) => (
              <TabComponent
                key={status}
                selectedTab={statuses[selectedTab]}
                targetTab={status}
              />
            ))}
          </TabList>

          {/* TabPanels: Render a separate panel for each status */}
          <TabPanels className="mt-3">
            {statuses.map((status, index) => (
              <TabPanel key={status}>
                {/* Filter and group tasks by date for each status */}
                {Object.entries(groupTasksByDate(filteredTasks(status)))
                  .length === 0 ? (
                  <p className="text-white">
                    No tasks available for this status.
                  </p>
                ) : (
                  Object.entries(groupTasksByDate(filteredTasks(status))).map(
                    ([date, tasksOnDate]) => (
                      <div key={date}>
                        <h2 className="text-white font-semibold mb-2">
                          {date}
                        </h2>
                        <ul>
                          {tasksOnDate.map(
                            ({ id, title, description, createdAt }) => (
                              <li
                                key={id}
                                className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
                              >
                                <a
                                  href="#"
                                  className="font-semibold text-white"
                                >
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
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default TabStatusAndBlog;
