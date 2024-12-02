"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

const ERROR_MESSAGE: string = "Something went wrong. Please try again later.";

const formSchema = z.object({
  name: z.string().min(2).max(255),
  phone: z.string(),
  email: z.string().email(),
  traveling_from: z.string(),
  destination: z.string(),
  departure_date: z.string().optional(),
  return_date: z.string(),
  adults: z.coerce.number().int().min(1),
  children: z.coerce.number().int().min(0).optional(),
  infants: z.coerce.number().int().min(0).optional(),
});

interface ReservationFormProps {
  onSubmissionSuccess: (success: boolean) => void;
}

export default function ReservationForm({
  onSubmissionSuccess,
}: ReservationFormProps) {
  const [errorMessage, setErrorMessage] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departure_date: format(new Date(), "yyyy-MM-dd"),
      return_date: format(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd",
      ),
      adults: 1,
      children: 0,
      infants: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let csrfToken: string = "";
    fetch("http://localhost:8000/csrf-token/", {})
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server reponse not ok");
        }
        return response.json();
      })
      .then((_data) => {
        const cookies = document.cookie.split("; ");
        csrfToken =
          cookies
            .find((cookie) => cookie.startsWith("csrftoken="))
            ?.split("=")[1] ?? "";
        if (!csrfToken) {
          throw new Error("CSRF token not found");
        }

        fetch("http://localhost:8000/reservation/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(values),
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Server reponse not ok");
            }
            return response.json();
          })
          .then((_data) => {
            onSubmissionSuccess(true);
            form.reset();
          })
          .catch((error) => {
            throw new Error(error);
          });
      })
      .catch((error) => {
        console.error("Network error:", error);
        setErrorMessage(csrfToken ? "" : ERROR_MESSAGE);
      });
  }

  // const [date, setDate] = React.useState<Date>();

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="" autoComplete="name" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="phone"
        control={form.control}
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder=""
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <hr className="my-4"></hr>

      <FormField
        control={form.control}
        name="traveling_from"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Traveling From</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="none"
                autoComplete="off"
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Destination</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="none"
                autoComplete="off"
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Departure Date</FormLabel>
            <FormControl>
              <Input type="date" inputMode="none" placeholder="" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="return_date"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Return Date</FormLabel>
            <FormControl>
              <Input type="date" inputMode="none" placeholder="" {...field} />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <hr className="my-4"></hr>

      <FormField
        control={form.control}
        name="adults"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Number of Adults</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder=""
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="children"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Number of Children</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder=""
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="infants"
        render={({ field }) => (
          <FormItem className="py-2">
            <FormLabel>Number of Infants</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                placeholder=""
                {...field}
              />
            </FormControl>
            {/* <FormDescription></FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="py-2">
        <p className="text-sm font-medium leading-none text-destructive">
          {errorMessage}
        </p>
      </div>

      <div className="pt-6">
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          Submit
        </Button>
      </div>
    </Form>
  );
}
