"use client";

import { ThreeDots } from "react-loader-spinner";
import { useInvoiceStore } from "../../../stores/invoice";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "next-auth";
import { createInvoice } from "./create";
import { useFormErrorStore } from "@/stores/form-error";

export default function OrderButton({ user }: { user: User }) {
  const lastPath = usePathname().split("/").pop();
  const [loading, setLoading] = useState(false);
  const {
    invoiceId,
    customer,
    vehicle,
    services,
    pricing,
    additional,
    status,
    sendMail,
    issueDate,
    payments,
    photo,
    reset,
  } = useInvoiceStore();
  const { showError } = useFormErrorStore();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      invoiceId,

      customer: {
        name: customer.name,
        email: customer.email,
        mobile: parseInt(customer.mobile),
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
      },

      vehicle: {
        make: vehicle.make,
        model: vehicle.model,
        year: parseInt(vehicle.year),
        vin: vehicle.vin,
        license: vehicle.license,
      },

      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        tax: pricing.tax,
        grandTotal: pricing.grand_total,
        deposit: pricing.deposit,
        due: pricing.due,
      },

      notes: additional.notes,
      terms: additional.terms,
      policy: additional.policy,

      services: services.map((service) => service.id),
      status,
      sendMail,
      payments,
      issueDate,
    };

    // check if any service is empty
    if (services.length === 0) {
      alert("Please add a service to the invoice");
      return;
    }

    if (lastPath === "create") {
      setLoading(true);
      const res = await createInvoice(data);

      // @ts-ignore
      if (res && res.field) {
        // @ts-ignore
        showError(res);
      } else {
        reset();
        router.push(`/invoice/view/${data.invoiceId}`);
      }
      setLoading(false);
    } else if (lastPath === "edit") {
      // TODO: edit invoice
    } else if (lastPath === "estimate") {
      // TODO: create estimate
    } else {
      console.error("Invalid route");
    }
  };

  return (
    <button
      type="submit"
      className="mx-auto mt-4 block rounded-md bg-blue-500 px-10 py-2 text-white"
      onClick={handleSubmit}
    >
      {loading ? (
        <ThreeDots color="#fff" height={20} width={40} />
      ) : lastPath === "edit" ? (
        "Update Invoice"
      ) : (
        "Create Invoice"
      )}{" "}
    </button>
  );
}