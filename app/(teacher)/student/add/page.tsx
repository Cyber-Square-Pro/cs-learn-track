"use client";
import React, { useState, useEffect } from "react";
// import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import cn from "classnames";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/utils/api";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
] as const;

let batch: { label: string; value: string }[] = [
  { label: "Batch 1", value: "batch1" },
];

const formSchema = z.object({
  firstName: z.string({ required_error: "" }),
  secondName: z.string({ required_error: "" }),
  grade: z.string({ required_error: "" }),
  section: z.string({ required_error: "" }),
  email: z
    .string({ required_error: "" })
    .email({ message: "Invalid Email id" }),
  phone: z.string({ required_error: "" }).regex(/^05\d{8}$/, {
    message: "Invalid UAE phone number.",
  }),
  gender: z.string({
    required_error: "",
  }),
  batch: z.number({ required_error: "" }),
  password: z.string({ required_error: "" }).min(6, {
    message: "Password must be atleast 6 characters long",
  }),
  joinedDate: z.date({ required_error: "" }),
});

const AddStudentPage = () => {
  const [date, setDate] = React.useState<Date>();
  const [batches, setBatches] = useState<{ name: string }[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().slice(0, 10); // Format to yyyy-mm-dd
      setDate(formattedDate);
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    values.joinedDate = date;
    localStorage.setItem("studentData", JSON.stringify(values));
    navigate("/uploadImg");
  }
  const fetchBatches = async () => {
    const userData = JSON.parse(localStorage.userData);
    const response = await fetchData(
      "/batch/list/",
      "POST",
      null,
      false,
      userData.accessToken
    );
    setBatches(response.batches);
    const responseBatches = response.batches;
  };
  useEffect(() => {
    fetchBatches();
  }, []);
  batch = batches.map((batch) => ({
    label: batch.name,
    value: batch.id,
  }));

  return (
    <div className="bg-[#0C0C0C] container-lg w-full min-h-screen text-[#FFFAFA] flex tems-center justify-center ">
      <div className="bg-[#0C0C0C] container p-5 sm:p-0 w-full min-h-screen text-[#FFFAFA] flex items-center justify-center flex-col gap-10 ">
        <div className=" rounded-lg container  w-[100%] max-w-xl h-auto p-4 bg-[#17171a] mx-4 sm:mx-auto row-span-4 relative md:top-6 dark">
          <h1 className="text-3xl font-bold text-center">Add a Student</h1>
          <br />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 fit ">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="secondName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Second Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Second Name"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative col-span-1 top-[0.6rem]">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Gender</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between text-white bg-transparent hover:bg-transparent hover:text-gray-500",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? gender.find(
                                      (gender) => gender.value === field.value
                                    )?.label
                                  : "Select the Gender"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 dark">
                            <Command>
                              <CommandInput
                                placeholder="Select gender"
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No Gender found.</CommandEmpty>
                                <CommandGroup>
                                  {gender.map((gender) => (
                                    <CommandItem
                                      value={gender.label}
                                      key={gender.value}
                                      onSelect={() => {
                                        form.setValue("gender", gender.value);
                                      }}
                                    >
                                      {gender.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          gender.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 fit ">
                <div className="col-span-2 relative sm:top-[0.6rem]">
                  <FormField
                    control={form.control}
                    name="joinedDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Joined Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full  pl-3 text-left font-normal bg-transparent",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 dark"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(selectedDate) => {
                                field.onChange(selectedDate);
                                handleDateChange(selectedDate);
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Grade"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Section"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-2 fit ">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Student's Email"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Parent's Phone Number"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 fit ">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Set password for student"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative col-span-1 top-[0.6rem]">
                  <FormField
                    control={form.control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Batch</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between text-white bg-transparent hover:bg-transparent hover:text-gray-500",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? batch.find(
                                      (batch) => batch.value === field.value
                                    )?.label
                                  : "Select the Batch"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 dark">
                            <Command>
                              <CommandInput
                                placeholder="Search batches"
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No batch found.</CommandEmpty>
                                <CommandGroup>
                                  {batch.map((batch) => (
                                    <CommandItem
                                      value={batch.label}
                                      key={batch.value}
                                      onSelect={() => {
                                        form.setValue("batch", batch.value);
                                      }}
                                    >
                                      {batch.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          batch.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="h-1"></div>
              <div className="container grid place-content-end">
                <Button
                  type="submit"
                  className="bg-white text-[#0c0c0c] hover:bg-[#0c0c0c] hover:text-white font-[18px]"
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="flex justify-center w-full h-auto row-span-1 stepper">
          <div className="progress relative  w-[18%] h-full flex justify-around">
            <div className=" relative z-10 grid w-10 h-10 font-bold text-white  bg-[#222225] rounded-full place-items-center -translate-x-[100%]">
              1
            </div>
            <div className="absolute w-full h-1 grid top-[40%] lg:w-[90%] bg-gray-300"></div>
            <div className="absolute w-[0%] h-1 grid top-[40%]   bg-[#222225]"></div>
            <div className="relative z-10 grid w-10 h-10 font-bold text-gray-900  bg-gray-300 rounded-full place-items-center translate-x-[100%]">
              2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage;
