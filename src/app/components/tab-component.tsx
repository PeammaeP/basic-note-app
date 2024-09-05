import { Tab } from "@headlessui/react";
import TabComponentProps from "../schema/tabComponentProps.dto";

const TabComponent: React.FC<TabComponentProps> = ({
  selectedTab,
  targetTab,
}) => {
  return (
    <Tab
      className={`rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none ${
        selectedTab === targetTab ? "font-mono bg-white/10" : "font-mono data-[hover]:bg-white/5"
      }`}
    >
      {targetTab}
    </Tab>
  );
};

export default TabComponent;
