import { Switch } from "@/components/Switch";
import type { Customer } from "@prisma/client";
import { useState, type Key } from "react";
import { TbUserX } from "react-icons/tb";
import NewTemplate from "./NewTemplate";
import Selector from "./Selector";
import { useEmailTemplateStore } from "@/stores/email-template";
import { EmailTemplate } from "@/types/email-template";
import { FaTimes } from "react-icons/fa";
import moment from "moment";

export function Reminder({
  client,
  endTime,
  date,
  times,
  setTimes,
  confirmationTemplate,
  setConfirmationTemplate,
  reminderTemplate,
  setReminderTemplate,
  confirmationTemplateStatus,
  setConfirmationTemplateStatus,
  reminderTemplateStatus,
  setReminderTemplateStatus,
}: {
  client: Customer | null;
  endTime: string;
  date: string;
  times: { time: string; date: string }[];
  setTimes: (times: { time: string; date: string }[]) => void;
  confirmationTemplate: EmailTemplate | null;
  setConfirmationTemplate: (template: EmailTemplate) => void;
  reminderTemplate: EmailTemplate | null;
  setReminderTemplate: (template: EmailTemplate | null) => void;
  confirmationTemplateStatus: boolean;
  setConfirmationTemplateStatus: (status: boolean) => void;
  reminderTemplateStatus: boolean;
  setReminderTemplateStatus: (status: boolean) => void;
}) {
  const [time, setTime] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");

  const { templates } = useEmailTemplateStore();

  return client === null ? (
    <div className="grid h-full place-content-center place-items-center gap-2 border-[1.5rem] border-solid border-white bg-neutral-300 text-center text-slate-500">
      <TbUserX size={64} />
      <span>No Client Selected</span>
    </div>
  ) : (
    <>
      <div className="space-y-4 p-2">
        <label className="flex items-center">
          <h2>Confirmation</h2>
          <Switch
            name="confirmation"
            className="ml-auto scale-75"
            checked={confirmationTemplateStatus}
            setChecked={setConfirmationTemplateStatus}
          />
        </label>
        <Selector
          label={
            confirmationTemplate ? confirmationTemplate.subject : "Template"
          }
          newButton={<NewTemplate type="Confirmation" />}
        >
          <div>
            {templates
              .filter(
                (template: EmailTemplate) => template.type === "Confirmation",
              )
              .map((template: EmailTemplate, index: number) => (
                <button
                  type="button"
                  key={index}
                  className="mx-auto mt-2 flex w-[95%] cursor-pointer items-center justify-between rounded-md border-2 p-1 px-3 hover:bg-gray-100"
                  onClick={() => setConfirmationTemplate(template)}
                >
                  <p className="text-sm font-bold">{template.subject}</p>
                  <div className="flex items-center gap-2">
                    <button type="button" className="text-[#6571FF]">
                      Edit
                    </button>
                    <button type="button">
                      <FaTimes />
                    </button>
                  </div>
                </button>
              ))}
          </div>
        </Selector>
      </div>
      <div className="space-y-4 p-2">
        <label className="flex items-center">
          <h2>Reminder</h2>
          <Switch
            name="reminder"
            className="ml-auto scale-75"
            checked={reminderTemplateStatus}
            setChecked={setReminderTemplateStatus}
          />
        </label>
        <Selector
          label={reminderTemplate ? reminderTemplate.subject : "Template"}
          newButton={<NewTemplate type="Reminder" />}
        >
          <div className="">
            {templates
              .filter((template: EmailTemplate) => template.type === "Reminder")
              .map((template: EmailTemplate, index: number) => (
                <button
                  type="button"
                  key={index}
                  className="mx-auto flex w-[95%] cursor-pointer items-center justify-between gap-4 rounded-md border-2 p-2 hover:bg-gray-100"
                  onClick={() => setReminderTemplate(template)}
                >
                  <p className="text-sm font-bold">{template.subject}</p>

                  <div className="flex items-center gap-2">
                    <button type="button" className="text-[#6571FF]">
                      Edit
                    </button>
                    <button type="button">
                      <FaTimes />
                    </button>
                  </div>
                </button>
              ))}
          </div>
        </Selector>
      </div>

      <div className="mx-auto my-2 h-[300px] w-[95%] rounded-md border-2 border-slate-400">
        <div className="flex items-center justify-evenly border-b p-3">
          {/* input time */}
          <input
            type="time"
            className="rounded-lg border-2 border-slate-400 p-1 text-lg "
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="date"
            className="rounded-lg border-2 border-slate-400 p-1"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button
            type="button"
            className="rounded-lg bg-[#6571FF] p-2 px-4 text-white"
            onClick={() => setTimes([...times, { time, date: dateInput }])}
          >
            Add
          </button>
        </div>

        <div className="h-[200px] overflow-scroll p-2">
          {/* Calculate current time and dateInput with endTime and date */}
          {/* Like:  6 days 7 hours before appointment */}
          {/* also format date and times to use with moment */}

          {times.map((timeObj, index) => {
            // Convert the date and time to a moment object
            const appointmentTime = moment(`${date} ${endTime}`);
            // Convert the timeObj date and time to a moment object
            const timeObjMoment = moment(`${timeObj.date} ${timeObj.time}`);
            // Calculate the difference in time
            const diff = moment.duration(appointmentTime.diff(timeObjMoment));

            // Format the difference
            const days = diff.days();
            const hours = diff.hours();

            return (
              <p key={index}>
                <span className="text-[#6571FF]">
                  {days} days {hours}
                  hours
                </span>{" "}
                before appointment
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}