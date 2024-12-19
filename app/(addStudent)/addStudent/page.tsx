"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
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
});

const addstudentPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="bg-[#0C0C0C] container  min-h-screen text-[#FFFAFA] flex items-center justify-center flex-col gap-10 ">
      <div className=" rounded-lg container  w-[100%] max-w-xl h-auto p-4 bg-[#17171a] mx-4 sm:mx-auto row-span-4 relative md:top-6">
        <h1 className="text-3xl font-bold text-center">Add a Student</h1>
        <br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 fit gap-4 ">
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
                          placeholder="Name of the Batch"
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
            <div className="grid grid-cols-2 fit gap-4 ">
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
                          placeholder="Name of the Batch"
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
            <div className="grid grid-cols-2 pt-2 fit gap-4 ">
              <div className="col-span-1">
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
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search framework..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
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
            <div className="grid grid-cols-2 fit gap-4 ">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Parent's Email"
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
            <div className="h-1"></div>
            <div className="container grid place-content-end">
              <Button
                type="submit"
                className="bg-[#0c0c0c] hover:bg-[#fff] hover:text-[#0c0c0c] font-[18px]"
              >
                <Link href={"/uploadImg"}>Next</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="stepper row-span-1 flex  h-auto w-full justify-center">
        <div className="progress relative  w-[18%] h-full flex justify-around">
          <div className=" relative z-10 grid w-10 h-10 font-bold text-white  bg-[#222225] rounded-full place-items-center -translate-x-[100%]">
            1
          </div>
          <div className="absolute w-full h-1 grid top-[40%]  bg-gray-300"></div>
          <div className="absolute w-[0%] h-1 grid top-[40%]  bg-[#222225]"></div>
          <div className="relative z-10 grid w-10 h-10 font-bold text-gray-900  bg-gray-300 rounded-full place-items-center translate-x-[100%]">
            2
          </div>
        </div>
      </div>
    </div>
  );
};

export default addstudentPage;
