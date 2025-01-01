"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchData } from "../../../utils/api";

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
const formSchema = z.object({
  batchName: z.string().min(2, {
    message: "Batch Name must be at least 2 characters.",
  }),
  batchDescription: z.string().min(2, {
    message: "Batch Description must be at least 2 characters.",
  }),
  grade: z.string().min(1, {
    message: "Grade must be at least 1 characters.",
  }),
  section: z.string().min(1, {
    message: "Section must be at least 1 characters.",
  }),
});

const CreateBatchPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: "",
      batchDescription: "",
      section: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await fetchData("/batches", "POST", data);
      console.log("Batch created successfully:", response);

    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };
  return (
    <div className="bg-[#0C0C0C] container h-screen w-full text-[#FFFAFA] flex items-center justify-center">
      <div className="container rounded-lg w-full max-w-md h-auto p-4 bg-[#17171a] mx-4 sm:mx-auto">
        <h1 className="text-4xl font-bold text-left">Create a Batch</h1>
        <br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="batchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name of the Batch"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="batchDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of the Batch"
                      {...field}
                      className="w-full min-h-12 flex-grow"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="h-1"></div>
            <div className="container grid place-content-end">
              <Button
                type="submit"
                className="bg-[#0c0c0c] hover:bg-[#0c0c0c6c] font-[18px]"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateBatchPage;
