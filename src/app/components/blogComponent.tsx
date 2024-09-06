import React from "react";
import Task from "../schema/taskSchema.dto";
import { format } from "date-fns";

const BlogComponent: React.FC<Omit<Task, "status">> = ({
  id,
  title,
  description,
  createdAt,
}) => {
  return (
    <div>
      <li
        key={id}
        className="font-mono relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
      >
        <a href="#" className="font-mono font-semibold text-white">
          <span className="font-mono absolute inset-0" />
          {title}
        </a>
        <ul className="font-mono flex gap-2 text-white/50" aria-hidden="true">
          <li>{format(new Date(createdAt), "hh:mm a")}</li>
          <li aria-hidden="true">&middot;</li>
          <li>{description}</li>
        </ul>
      </li>
    </div>
  );
};

export default BlogComponent;
