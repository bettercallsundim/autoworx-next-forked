"use client";

import { useEstimateCreateStore } from "@/stores/estimate-create";
import { create } from "mutative";
import { HiOutlinePlusCircle, HiXCircle } from "react-icons/hi2";

// TODO: Need more information.
export function TasksInput() {
  const tasks = useEstimateCreateStore((x) => x.tasks);
  return (
    <div className="space-y-2 rounded border border-solid border-slate-500 p-2">
      {tasks.map((task, i) => (
        <label key={i} className="relative block">
          <input
            value={task}
            onChange={(event) =>
              useEstimateCreateStore.setState((x) =>
                create(x, (x) => {
                  x.tasks[i] = event.currentTarget.value;
                }),
              )
            }
            className="block w-full rounded border border-solid border-slate-500 px-2 py-1"
            placeholder="Task Name: Task Description"
          />
          <button
            type="button"
            onClick={() => {
              useEstimateCreateStore.setState(({ tasks }) => ({
                tasks: tasks.toSpliced(i, 1),
              }));
            }}
            className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 text-[#6470FF]"
          >
            <HiXCircle />
          </button>
        </label>
      ))}
      <button
        type="button"
        onClick={() => {
          useEstimateCreateStore.setState(({ tasks }) => ({
            tasks: [...tasks, ""],
          }));
        }}
        className="flex items-center gap-1 text-[#6571FF]"
      >
        <HiOutlinePlusCircle size="1.2em" />
        Task
      </button>
    </div>
  );
}
