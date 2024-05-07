"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { SlimInput, slimInputClassName } from "@/components/SlimInput";
import Submit from "@/components/Submit";
import { useEffect, useState } from "react";
// import { addTemplate } from "./addTemplate";
import FormError from "@/components/FormError";
import { useFormErrorStore } from "@/stores/form-error";
import type { EmailTemplate } from "@/types/email-template";
import { useEmailTemplateStore } from "@/stores/email-template";
import { addTemplate } from "./addTemplate";
import { EmailTemplateType } from "@prisma/client";

export default function NewTemplate({
  type,
  clientName,
  vehicleModel,
}: {
  type: EmailTemplateType;
  clientName: string;
  vehicleModel: string;
}) {
  const [open, setOpen] = useState(false);
  const { showError } = useFormErrorStore();
  const { templates, setTemplates } = useEmailTemplateStore();
  const [subject, setSubject] = useState(
    "Appointment Confirmation at TC CUSTOMS ATLANTA",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(
      `Hi ${clientName},
    
This is a friendly reminder that you have an upcoming appointment on Wednesday, May 8 at 12:30 PM EDT.
  
Location
TC CUSTOMS ATLANTA
6350 MCDONOUGH DRIVE NORTHWEST
NORCROSS GA 30093
  
Vehicle
${vehicleModel}`,
    );
  }, [clientName, vehicleModel]);

  async function handleSubmit(data: FormData) {
    const res = (await addTemplate({ subject, message, type })) as any;

    if (res.error) {
      showError({
        field: res.field || "subject",
        message: res.message,
      });
    } else {
      setTemplates([...templates, { id: res.id, subject, message, type }]);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="text-xs text-[#6571FF]">
          + Add New Template
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-full max-w-xl grid-rows-[auto,1fr,auto]"
        form
      >
        <DialogHeader>
          <DialogTitle>Custom Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <FormError />
          <input type="hidden" name="type" value={type} />
          <SlimInput
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <label className="block">
            <div className="mb-1 px-2 font-medium">Message</div>
            <textarea
              name="message"
              rows={10}
              className={slimInputClassName}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </div>

        <DialogFooter>
          <DialogClose className="rounded-lg border-2 border-slate-400 p-2">
            Cancel
          </DialogClose>
          <Submit
            className="rounded-lg border bg-[#6571FF] px-5 py-2 text-white"
            formAction={handleSubmit}
          >
            Save
          </Submit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
