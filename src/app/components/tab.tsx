import React, { useState } from "react";
import { format } from "date-fns";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Task from "../schema/taskSchema.dto";
import ApiResponseSchema from "../schema/apiResponse.dto";
import TabComponentProps from "../schema/tabComponentProps.dto";

const TabStatus: React.FC<ApiResponseSchema> = ({ tasks }) => {
  type TaskOnlyStatus = Omit<
    Task,
    "id" | "title" | "description" | "createdAt"
  >;

  const [selectedTab, setSelectedTab] = useState("");

  const handleTabChange = (index: number) => {
    const statuses = ["TODO", "DOING", "DONE"];
    setSelectedTab(statuses[index]);
  };

  const filterTasks = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

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

  const FilterTabDisplayBlog: React.FC<TaskOnlyStatus> = ({ status }) => {
    return (
      <TabPanel>
        <ul>
          {filterTasks(status).map(({ id, title, description, createdAt }) => {
            const date = new Date(createdAt); // Ensure createdAt is parsed as a Date object
            const formattedDate = format(date, "MMMM dd, yyyy"); // Format the date

            return (
              <li
                key={id}
                className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
              >
                <a href="#" className="font-semibold text-white">
                  <span className="absolute inset-0" />
                  {title}
                </a>
                <ul className="flex gap-2 text-white/50" aria-hidden="true">
                  <li>{formattedDate}</li>
                  <li aria-hidden="true">&middot;</li>
                  <li>{description}</li>
                </ul>
              </li>
            );
          })}
        </ul>
      </TabPanel>
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
            <FilterTabDisplayBlog status={selectedTab} />
            <FilterTabDisplayBlog status={selectedTab} />
            <FilterTabDisplayBlog status={selectedTab} />
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default TabStatus;
