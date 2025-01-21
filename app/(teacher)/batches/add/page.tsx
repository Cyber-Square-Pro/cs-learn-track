"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/lib/withAuth";
import { useNavigate } from "react-router-dom";
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
import { fetchData } from "@/utils/api";
import { time } from "console";
const formSchema = z.object({
  batchName: z.string().min(2, {
    message: "Batch Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Batch Description must be at least 2 characters.",
  }),
});

const CreateBatchPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: "",
      description: "",
    },
  });
  const { toast } = useToast();
  const OnSubmit = async (data) => {
    const userDataString = sessionStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    try {
      const response = await fetchData(
        "/batch/create/",
        "POST",
        data,
        false,
        userData.accessToken
      );
      // console.log("Batch created successfully:", response);
      if (response.status === 201) {
        toast({
          variant: "default",
          title: "Batch Created",
          className: "bg-green-500 text-white border border-green-700",
          description: `${data.batchName} has been created successfully.`,
        });
        form.reset();
        navigate("/teacher/dashboard");
      } else if (response.status !== 201) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "This Batch already exists or an error occurred while creating the batch.",
        });
      }
    } catch (error) {
      // console.error("Error creating batch:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the batch.",
      });
    }
  };
  return (
    <div className="bg-[#0C0C0C] container-lg h-screen w-full text-[#FFFAFA] flex items-center justify-center">
      <div className="container rounded-lg w-full max-w-md h-auto p-4 bg-[#17171a] mx-4 sm:mx-auto">
        <h1 className="text-4xl font-bold text-left">Create a Batch</h1>
        <br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-3">
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
                      rows={6}
                      {...field}
                      className="flex-grow w-full min-h-12"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="h-1"></div>
            <div className="container flex w-full place-content-between ">
              <Button
                type="button"
                className="dark bg-transparent border-[1.5px] font-[18px] "
                onClick={() => navigate("/teacher/dashboard")}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0c0c0c] hover:bg-[#0c0c0c6c] font-[18px] "
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

export default withAuth(CreateBatchPage, ["Teacher"]);
