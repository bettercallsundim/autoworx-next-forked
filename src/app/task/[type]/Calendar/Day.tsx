"use client";

import { cn } from "../../../../lib/cn";
import { TASK_COLOR } from "@/lib/consts";
import { usePopupStore } from "../../../../stores/popup";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { HiCalendar, HiClock } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { Task, User } from "@prisma/client";
import Image from "next/image";
import { deleteTask } from "../../delete";

export default function Day({
  tasks,
  companyUsers,
}: {
  // tasks with assigned users
  tasks: (Task & { assignedUsers: User[] })[];
  companyUsers: User[];
}) {
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const { open } = usePopupStore();
  const is1300 = useMediaQuery({ query: "(max-width: 1300px)" });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(scrollableDivRef.current!.scrollTop);
    };

    scrollableDivRef.current &&
      scrollableDivRef.current.addEventListener("scroll", handleScroll);

    return () => {
      scrollableDivRef.current &&
        scrollableDivRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteTask(id);
    setLoading(false);
  };

  const rows = [
    "All Day",
    // 1am to 12pm
    ...Array.from(
      { length: 24 },
      (_, i) =>
        `${i + 1 > 12 ? i + 1 - 12 : i + 1} ${i + 1 >= 12 ? "PM" : "AM"}`,
    ),
  ];

  const dayTasks = tasks
    .filter((task) => {
      // return today's tasks
      // also filter by month and year
      const taskDate = moment(task.date);
      const today = moment();
      return (
        taskDate.date() === today.date() &&
        taskDate.month() === today.month() &&
        taskDate.year() === today.year()
      );
    })
    .map((task) => {
      const taskStartTime = moment(task.startTime, "HH:mm").format("h A");
      const taskEndTime = moment(task.endTime, "HH:mm").format("h A");

      // Find the rowStartIndex and rowEndIndex by looping through the rows array
      const rowStartIndex = rows.findIndex((row) => row === taskStartTime);
      const rowEndIndex = rows.findIndex((row) => row === taskEndTime);

      // Return the task with the rowStartIndex and rowEndIndex
      return { ...task, rowStartIndex, rowEndIndex };
    });

  function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
  }

  function formatTime(row: string) {
    const [hour, period] = row.split(" ");
    const time = `${hour.padStart(2, "0")}:00 ${period}`;
    return moment(time, "hh:mm A").format("HH:mm");
  }

  return (
    <>
      <div
        className="relative mt-3 h-[90%] overflow-auto border border-[#797979]"
        ref={scrollableDivRef}
      >
        {rows.map((row, i) => (
          <button
            key={i}
            className={cn(
              "block h-[45px] w-full border-[#797979]",
              i !== rows.length - 1 && "border-b",
              i !== 0 && "cursor-pointer",
            )}
            onClick={() => {
              const date = formatDate(new Date());
              const startTime = formatTime(row);
              open("ADD_TASK", { date, startTime, companyUsers });
            }}
            disabled={i === 0}
          >
            {/* Row heading */}
            <div
              className={cn(
                "flex h-full w-[100px] items-center justify-center border-r border-[#797979] text-[19px] text-[#797979]",
                i === 0 && "font-bold",
              )}
            >
              {row}
            </div>
          </button>
        ))}

        {/* Tasks */}
        {dayTasks.map((task, index) => {
          const left = "130px";
          let top = `${task.rowStartIndex * 45}px`;
          // if the previous task starts at the same time as this task
          // then move this task down
          if (
            index > 0 &&
            task.rowStartIndex === dayTasks[index - 1].rowStartIndex
          ) {
            top = `${task.rowStartIndex * 45 + 20}px`;
          }
          const height = `${
            (task.rowEndIndex - task.rowStartIndex + 1) * 45
          }px`;
          const width = is1300 ? "300px" : "500px";
          const backgroundColor = TASK_COLOR[task.type];

          // Define a function to truncate the task title based on the height
          const truncateTitle = (title: string, maxLength: number) => {
            return title.length > maxLength
              ? title.slice(0, maxLength) + "..."
              : title;
          };

          // Define the maximum title length based on the height
          const maxTitleLength =
            height === "45px"
              ? 60
              : height === "90px"
                ? 120
                : task.title.length;

          return (
            <div
              key={task.id}
              className="absolute top-0 z-10 rounded-lg border px-2 py-1 text-[17px] text-white"
              style={{
                left,
                top,
                height,
                backgroundColor,
                maxWidth: width,
                minWidth: width,
              }}
              onMouseEnter={() => setHoveredTask(index)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              {truncateTitle(task.title, maxTitleLength)}
            </div>
          );
        })}
      </div>

      {dayTasks.map((task, index) => {
        const rowIndex = task.rowStartIndex;
        const MOVE_FROM_TOP =
          rowIndex === 0
            ? 260
            : rowIndex === 1
              ? 220
              : rowIndex === 2
                ? 180
                : rowIndex === 3
                  ? 140
                  : rowIndex === 4
                    ? 100
                    : 25;
        const height = 300;
        const left = "130px";
        const top = `${
          45 * task.rowStartIndex + 45 - scrollPosition + MOVE_FROM_TOP - height
        }px`;

        return (
          <div
            className={cn(
              "absolute w-[400px] rounded-md border border-slate-400 bg-white p-3 transition-all duration-300",
            )}
            style={{
              left,
              top,
              height,
              opacity: hoveredTask === index ? 1 : 0,
              zIndex: hoveredTask === index ? 40 : -10,
            }}
            key={index}
            onMouseEnter={() => setHoveredTask(index)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <p className="text-[19px] font-bold text-slate-600">{task.title}</p>
            <hr />

            <div className="mt-2 flex items-center justify-between">
              <p className="flex items-center text-[17px] text-slate-600">
                <HiCalendar />
                {moment(task.date).format("MMM DD, YYYY")}
              </p>

              <p className="flex items-center text-[17px] text-slate-600">
                <HiClock />
                {moment(task.startTime, "HH:mm").format("hh:mm A")}
                <span className="mx-1">-</span>
                <HiClock />
                {moment(task.endTime, "HH:mm").format("hh:mm A")}
              </p>
            </div>

            {/* Options */}
            <div className="flex justify-end text-[14px]">
              <button
                className="mt-2 flex items-center rounded-md bg-[#24a0ff] px-2 py-1 text-white"
                onClick={() => {
                  setHoveredTask(null);
                  open("EDIT_TASK", { ...task });
                }}
              >
                <MdModeEdit />
                Edit
              </button>
              <button
                className="ml-2 mt-2 flex items-center rounded-md bg-[#ff4d4f] px-2 py-1 text-white"
                onClick={() => handleDelete(task.id)}
              >
                {loading ? (
                  <ThreeDots color="#fff" height={10} width={30} />
                ) : (
                  <>
                    <MdDelete />
                    Delete
                  </>
                )}
              </button>
            </div>

            {/* Show users */}
            <div className="mt-3 h-[10rem] overflow-auto">
              {task.assignedUsers.map((user) => {
                return (
                  <div
                    className="mt-2 flex items-center bg-[#F8F9FA] px-1 py-3"
                    key={user.id}
                  >
                    <Image
                      src={user.image}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <p className="ml-2 text-[18px] font-bold text-slate-600">
                      {user.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}