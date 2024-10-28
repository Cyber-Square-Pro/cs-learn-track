"use client";

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
const SignInPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div className="contianer mx-auto grid grid-cols-7 grid-rows-1 grid-flow-row  h-screen">
      <div className="container bg-[#0a0a0a] LHS col-span-3 text-white font-poppins grid justify-center content-center">
        <div className="loginbox w-[400px]  grid place-content-center h-fit">
          <div className="text-left">
            <h1 className="text-[48px] text-white  font-poppins font-bold m-0 h-fit">
              Login
            </h1>
            <p className="m-0 pb-1 font-poppins opacity-70 text-[16px]">
              Enter your account details
            </p>
          </div>
          <br />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid place-content-center emailDiv w-[23rem] text-white">
              <Input
                placeholder="Email"
                type="email"
                className="w-[23rem] text-[16px]"
                {...form.register("email")}
              />
              <p></p>
            </div>
            <div className="h-3"></div>
            <div className="grid place-content-center passwordDiv w-[23rem] text-white">
              <Input
                placeholder="Password"
                type="password"
                className="w-[23rem] text-[16px]"
                {...form.register("password")}
              />
              <p></p>
            </div>
            <div>
              <div className="h-2"></div>
              <a href="#" className="text-[#925FE2]">
                Forget Password?
              </a>
            </div>
            <div className="grid  width-[100%]">
              <br />
              <br />
              <button
                type="submit"
                className="bg-[#925FE2] h-fit py-[10px] w-[23rem] rounded-md text-white font-poppins font-bold text-[16px]"
              >
                Login
              </button>
            </div>
          </form>
          <br />
          <br />
          <br />
          <br />
          <div className=" grid grid-cols-2 place-items-center w-[23rem] pl-8  max-h-full">
            <span className="font-poppins place-content-center align-middle text-[16px] col-span-1 opacity-50">
              Don't have an account?{" "}
            </span>
            <button
              type="submit"
              className="col-span-1 text-white bg-[#333437] h-fit py-[10px] w-[5rem] rounded-lg font-poppins text-[16px]"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
      <div className=" relative h-screen align-bottom col-span-4 bg-[#925FE2] RHS">
        <div className="title grid pt-12 pl-[8rem]">
          <h1 className="text-white leading-none text-[60px] sm:text-[50px]	md:text-[60px] lg:text-[80px] font-poppins font-bold m-0 h-fit">
            <span className="font-bold">Welcome to</span> <br />
            <span className="font-thin">student portal</span>
          </h1>
          <p className="m-0 pb-1 font-poppins opacity-70 text-[16px] text-white">
            Login to access your account
          </p>
        </div>
        <Image
          src={`/login/loginPic.png`}
          alt={`alt`}
          layout="responsive"
          width={800}
          height={800}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto max-w-[700px] max-h-[700px]"
        />
      </div>
    </div>
  );
};

export default SignInPage;
