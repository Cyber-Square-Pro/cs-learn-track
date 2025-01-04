"use client";
{
  `/* //TODO: Return the username of the teacher and the student data */`;
}

import React from "react";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchData } from "@/utils/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
// fonts
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

const TeacherSignInPage = () => {
  const navigate = useNavigate();
  const UserSchema = z.object({
    email: z.string().email().min(5),
    teacherPassword: z.string().min(6).max(100),
  });
  type formFields = z.infer<typeof UserSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formFields>({ resolver: zodResolver(UserSchema) });
  const onSubmit = async (data) => {
    // navigate("/addStudent");
    try {
      const response = await fetchData("/teacher/login/", "POST", data);
      console.log("Teacher logged in successfully:", response);
      const userData = {
        teacherName: response.teacherName,
        userType: "teacher",
        email: data.email,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };

  return (
    <div className={poppins.className}>
      <div className="grid h-screen grid-flow-row grid-cols-7 grid-rows-1 mx-auto contianer">
        <div className="container bg-[#0a0a0a] LHS col-span-3 text-[#fff] font-poppins grid justify-center content-center">
          <div className="loginbox w-[400px]  grid place-content-center h-fit">
            <div className="text-left">
              <h1 className="text-[48px]  text-white lg:text-[60px]  font-bold m-0 h-fit">
                Login
              </h1>
              <p className="m-0 pb-1 font-poppins opacity-70 text-[16px]">
                Enter your account details
              </p>
            </div>
            <br />

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid place-content-center emailDiv w-[23rem] text-white">
                <Input
                  placeholder="Email"
                  type="email"
                  className="w-[23rem] text-[16px]"
                  {...register("email", { required: true })}
                />
                <p className="text-red-500 emailError">
                  {errors.email?.message}
                </p>
              </div>
              <div className="h-3"></div>
              <div className="grid place-content-center passwordDiv w-[23rem] text-white">
                <Input
                  placeholder="Password"
                  type="password"
                  className="w-[23rem] text-[16px]"
                  {...register("teacherPassword", { required: true })}
                />
                <p className="text-red-500 passwordError">
                  {errors.teacherPassword?.message}
                </p>
              </div>
              <div>
                <div className="h-2"></div>
                <a
                  href="#"
                  className="text-[#925FE2] opacity-80 hover:opacity-100"
                >
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
          </div>
        </div>
        <div className="relative h-screen align-bottom col-span-4 bg-[#925FE2] RHS">
          <svg
            className="absolute top-0 left-0 z-0 w-1/2 h-auto opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <path
              fill="#9C6FE4"
              d="M40.5,-69.3C52.3,-60.3,60.9,-52.3,66.4,-41.8C71.9,-31.3,74.3,-18.3,75.1,-5.4C75.9,7.5,75.1,20.3,68.8,30.3C62.5,40.3,50.7,47.5,39.1,54.1C27.5,60.7,16.3,66.7,3.3,63.6C-9.7,60.5,-19.4,48.3,-29.1,39.1C-38.8,29.9,-48.5,23.7,-54.1,14.5C-59.7,5.3,-61.3,-7,-58.1,-17.5C-54.9,-28,-46.9,-36.7,-37.5,-45.4C-28.1,-54.1,-17.3,-62.8,-5.2,-65.3C6.9,-67.8,13.8,-64.3,40.5,-69.3Z"
              transform="translate(100 100)"
            />
          </svg>

          <svg
            className="absolute bottom-0 right-0 w-1/3 h-auto opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <path
              fill="#9C6FE4"
              d="M40.5,-69.3C52.3,-60.3,60.9,-52.3,66.4,-41.8C71.9,-31.3,74.3,-18.3,75.1,-5.4C75.9,7.5,75.1,20.3,68.8,30.3C62.5,40.3,50.7,47.5,39.1,54.1C27.5,60.7,16.3,66.7,3.3,63.6C-9.7,60.5,-19.4,48.3,-29.1,39.1C-38.8,29.9,-48.5,23.7,-54.1,14.5C-59.7,5.3,-61.3,-7,-58.1,-17.5C-54.9,-28,-46.9,-36.7,-37.5,-45.4C-28.1,-54.1,-17.3,-62.8,-5.2,-65.3C6.9,-67.8,13.8,-64.3,40.5,-69.3Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-3/4 h-auto opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <path
              fill="#9C6FE4"
              d="M36.1,-61.8C47.5,-54.7,56.8,-47.5,62.5,-37.8C68.2,-28.1,70.3,-15.9,70.3,-3.2C70.3,9.5,68.2,19,63.1,27.6C58,36.2,49.9,43.8,40.4,50.4C30.9,57,20,62.6,8.1,63.8C-3.8,65,-15.6,61.8,-25.1,56.3C-34.6,50.8,-41.8,43,-48.5,34.3C-55.2,25.6,-61.4,16,-63.1,5.3C-64.8,-5.4,-62.1,-16.1,-56.1,-25.4C-50.1,-34.7,-40.8,-42.6,-31.1,-50.1C-21.4,-57.6,-10.7,-64.7,1.1,-66.3C12.9,-67.9,25.8,-64.1,36.1,-61.8Z"
              transform="translate(100 100)"
            />
          </svg>

          {/* Existing Content */}
          <div className="title grid pt-12 pl-[5rem]">
            <h1 className="text-white leading-none z-10 text-[60px] sm:text-[50px] md:text-[60px] lg:text-[80px] font-poppins font-bold m-0 h-fit">
              <span className="font-bold">Welcome to</span> <br />
              <span className="font-[100]">teacher portal</span>
            </h1>
            <p className="m-0 pb-1 font-poppins opacity-70 text-[16px] text-white">
              Login to access your account
            </p>
          </div>
          <div className="flex justify-center w-full img-center">
            <Image
              src={`/login/loginPic.png`}
              alt={`alt`}
              // layout="responsive"
              width={800}
              height={800}
              className="absolute bottom-0 w-full h-auto mx-0 sm:w-1/2 md:w-1/3 lg:w-3/5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignInPage;
