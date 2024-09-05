import React, { useState } from "react";
import { format } from "date-fns";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponentProps from "../schema/tabComponentProps.dto";

const TabStatusAndBlog: React.FC<ApiResponseSchema> = ({ tasks }) => {
  const [selectedTab, setSelectedTab] = useState("TODO");

  const handleTabChange = (index: number) => {
    const statuses = ["TODO", "DOING", "DONE"];
    setSelectedTab(statuses[index]);
  };

  const filteredTasks = () => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }

    if (selectedTab === "") {
      return tasks;
    }

    return tasks.filter((task) => task.status && task.status === selectedTab);
  };

  const groupBlogsByDateAfterGroupTasks = (filteredTask: Task[]) => {
    return filteredTask.reduce((groups, task) => {
      const date = format(new Date(task.createdAt), "MMMM dd, yyyy");

      if (!groups[date]) {
        groups[date] = [];
        console.log("First Date Groups", groups[date], date);
      }
      groups[date].push(task);
      console.log(task.status);

      return groups;
    }, {} as Record<string, Task[]>);
  };

  const groupedTasks = groupBlogsByDateAfterGroupTasks(filteredTasks());

  const TabComponent: React.FC<TabComponentProps> = ({
    selectedTab,
    targetTab,
    status,
  }) => {
    return (
      <Tab
        className={`rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none ${
          selectedTab === targetTab ? "bg-white/10" : "data-[hover]:bg-white/5"
        }`}
      >
        {status}
      </Tab>
    );
  };

  return (
    <div className="flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup onChange={handleTabChange}>
          <TabList className="flex gap-4">
            <TabComponent
              selectedTab={selectedTab}
              targetTab="TODO"
              status="TODO"
            />
            <TabComponent
              selectedTab={selectedTab}
              targetTab="DOING"
              status="DOING"
            />
            <TabComponent
              selectedTab={selectedTab}
              targetTab="DONE"
              status="DONE"
            />
          </TabList>
          <TabPanels className="mt-3">
            {Object.entries(groupedTasks).map(([date, tasksOnDate]) => (
              <TabPanel key={date}>
                <h1 className="text-white font-semibold mb-2">{date}</h1>
                <ul>
                  {tasksOnDate.map(({ id, title, description, createdAt }) => (
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
                        <li>{format(new Date(createdAt), "hh:mm a")}</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{description}</li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default TabStatusAndBlog;
