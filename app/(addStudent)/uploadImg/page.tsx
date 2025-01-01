"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {fetchData} from "@/utils/api";

const formSchema = z.object({
  image: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image size should be less than 5MB",
  }),
});

const UploadImagePage: React.FC = () => {
  const [studentData, setStudentData] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const data = localStorage.getItem("studentData");
    if (data) {
      setStudentData(JSON.parse(data));
    }
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (studentData) {
      const formData = new Map();
      formData.set("firstName", studentData.firstName);
      formData.set("secondName", studentData.secondName);
      formData.set("grade", studentData.grade);
      formData.set("section", studentData.section);
      formData.set("email", studentData.email);
      formData.set("phone", studentData.phone);
      formData.set("gender", studentData.gender);
      formData.set("image", values.image);
      console.log(formData);
      console.log(studentData.gender);
      console.log(formData.get("firstName"));
      sendToBackend(formData);
    }
  }

  async function sendToBackend(formData: Map<string, any>) {
    try {
      const response = await fetchData("student/register", "POST", formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", file);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="bg-[#0C0C0C] container-lg min-h-screen text-[#FFFAFA] flex tems-center justify-center">
      <div className="bg-[#0C0C0C] container min-h-screen w-full text-[#FFFAFA] flex flex-col gap-10 items-center justify-center">
        <div className="rounded-lg container w-full max-w-[26%] h-auto p-4 bg-[#17171a] mx-4 sm:mx-auto row-span-4 relative md:top-6">
          <h1 className="text-3xl font-bold text-center">Student Image</h1>
          <br />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-row gap-4">
                <div className="row-span-1 order-last grid justify-center align-middle">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="grid justify-self-center h-4">
                          Upload Image
                        </FormLabel>
                        <FormControl>
                          <label className="w-full flex flex-col items-center px-16 py-4  text-white rounded-xl shadow-lg tracking-wide uppercase  border-[1.5px] border-dashed  border-white  cursor-pointer hover:bg-gray-700 hover:text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="size-9"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                              />
                            </svg>
                            <span className="mt-2 text-base leading-normal">
                              Browse File
                            </span>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="row-span-2 flex items-center justify-self-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      width={500}
                      height={500}
                      alt="Image Preview"
                      className="w-32 h-32 object-cover rounded-full"
                    ></Image>
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full">
                      <span className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-14"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-1"></div>
              <div className="container grid place-content-center">
                <Button
                  type="submit"
                  className="bg-[#0c0c0c] hover:bg-[#fff] hover:text-[#0c0c0c] font-[18px]"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="stepper static row-span-1 flex h-auto w-full justify-center">
          <div className="progress relative w-[18%] h-full flex justify-around">
            <div className=" relative z-10 grid w-10 h-10 font-bold text-white  bg-[#222225] rounded-full place-items-center -translate-x-[100%]">
              1
            </div>
            <div className="absolute w-full h-1 grid top-[40%] lg:w-[90%]  bg-gray-300"></div>
            <div className="absolute w-[100%] h-1 grid top-[40%] lg:w-[90%] bg-[#222225]"></div>
            <div className=" relative z-10 grid w-10 h-10 font-bold text-white  bg-[#222225] rounded-full place-items-center translate-x-[100%]">
              2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImagePage;
