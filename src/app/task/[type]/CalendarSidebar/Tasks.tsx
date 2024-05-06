import { usePopupStore } from "../../../../stores/popup";
import { FaPlus } from "react-icons/fa";
import { Task, User } from "@prisma/client";
import TaskComponent from "./Task";
import TagComponent from "./Tag";
import { useCalendarSidebarStore } from "@/stores/calendarSidebar";
import { MinimizeButton } from "./MinimiseButton";
import { cn } from "@/lib/cn";
import NewTask from "./NewTask";

export default function Tasks({
  tasks,
  users,
  tags,
}: {
  tasks: Task[];
  users: User[];
  tags: string[];
}) {
  const { open } = usePopupStore();
  const minimized = useCalendarSidebarStore((x) => x.minimized);

  return (
    <div
      className={cn(
        "app-shadow relative mt-5 flex flex-grow flex-col gap-2 overflow-hidden rounded-[12px] bg-white",
        minimized || "p-3",
      )}
    >
      <h2 className="flex items-center justify-between">
        {!minimized && <div className="text-[19px] text-black">Task List</div>}
        <MinimizeButton />
      </h2>

      {!minimized && (
        <div className="space-y-2 overflow-y-auto">
          {tasks.map((task) => (
            <TaskComponent key={task.id} task={task} />
          ))}
          {tags.map((tag, index) => (
            <TagComponent key={index} tag={tag} />
          ))}

          <NewTask companyUsers={users} />
        </div>
      )}
    </div>
  );
}
