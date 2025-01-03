"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchData } from "@/utils/api";

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
  description: z.string().min(2, {
    message: "Batch Description must be at least 2 characters.",
  }),

});

const CreateBatchPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: "",
      description: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await fetchData("/batch/create", "POST", data);
      console.log("Batch created successfully:", response);
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };
  return (
    <div className="bg-[#0C0C0C] container-lg h-screen w-full text-[#FFFAFA] flex items-center justify-center">
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
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of the Batch"
                      rows = {6}
                      {...field}
                      className="flex-grow w-full min-h-12"
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
