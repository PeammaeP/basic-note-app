import React, { useState } from "react";
import { format } from "date-fns";
import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponent from "./tabComponent";
import BlogComponent from "./blogComponent";

const TabStatusAndBlog: React.FC<ApiResponseSchema> = ({ tasks }) => {
  const [selectedTab, setSelectedTab] = useState(0);

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
                        <ul>
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
      </div>
    </div>
  );
};

export default TabStatusAndBlog;
