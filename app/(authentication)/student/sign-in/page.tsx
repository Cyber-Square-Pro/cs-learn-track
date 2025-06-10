"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { fetchData } from "@/utils/api";
import { X, Eye, Camera as CameraIcon } from "lucide-react";

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

// fonts
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

const SignInPage = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<"password" | "face">("password");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const UserSchema = z.object({
    admissionNo: z.string({ required_error: "" }).min(4),
    studentPassword: z.string({ required_error: "" }).min(6).max(100),
  });
  type formFields = z.infer<typeof UserSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formFields>({ resolver: zodResolver(UserSchema) });

  const FaceLoginSchema = z.object({
    admissionNo: z.string({ required_error: "" }).min(4),
  });
  type faceLoginFields = z.infer<typeof FaceLoginSchema>;
  const {
    register: registerFace,
    handleSubmit: handleSubmitFace,
    formState: { errors: faceErrors },
    getValues: getFaceValues,
  } = useForm<faceLoginFields>({ resolver: zodResolver(FaceLoginSchema) });

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const postData = {
        admissionNo: parseInt(data.admissionNo),
        studentPassword: data.studentPassword,
      };
      const response = await fetchData("/student/login/", "POST", postData);

      if (response.status === 200) {
        const userData = {
          userType: "student",
          accessToken: response.access,
        };
        setLoginError(null);

        // Store JWT token in cookie
        Cookies.set("accessToken", response.access, { expires: 7 }); // Expires in 7 days

        sessionStorage.setItem("userData", JSON.stringify(userData));

        // Redirect to student dashboard
        router.push("/student/dashboard");
      } else if (response.status === 400 || response.status === 401) {
        setLoginError(
          "Incorrect admission number or password. Please try again."
        );
      } else {
        setLoginError("Login failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);
      setLoginError(null);

      // Wait for the modal to render before setting video source
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);
      setLoginError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setShowCamera(false);
    setFaceDetected(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip the image horizontally to match the mirror effect
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

    // Convert canvas to base64
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Mock face detection - replace with actual face detection logic
  const checkFacePosition = () => {
    // This is a placeholder - in a real implementation, you would use
    // face detection libraries like MediaPipe or TensorFlow.js
    const isPositioned = Math.random() > 0.3; // 70% chance of good positioning
    setFaceDetected(isPositioned);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cameraReady && showCamera) {
      // Check face position every 500ms
      interval = setInterval(checkFacePosition, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cameraReady, showCamera]);

  const onFaceLoginSubmit = async () => {
    if (!capturedImage) {
      setLoginError("Please capture an image first.");
      return;
    }

    const admissionNo = getFaceValues("admissionNo");
    if (!admissionNo) {
      setLoginError("Please enter your admission number.");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      const base64Image = capturedImage.split(",")[1]; // Remove data:image/jpeg;base64, prefix

      const postData = {
        admissionNo: parseInt(admissionNo),
        login_image: base64Image,
      };

      const response = await fetchData(
        "/student/login_face/",
        "POST",
        postData
      );

      if (response.status === 200) {
        const userData = {
          userType: "student",
          accessToken: response.access,
        };
        setLoginError(null);

        // Store JWT token in cookie
        Cookies.set("accessToken", response.access, { expires: 7 });
        sessionStorage.setItem("userData", JSON.stringify(userData));

        // Redirect to student dashboard
        router.push("/student/dashboard");
      } else if (response.status === 400) {
        setLoginError(
          response.message || "Face recognition failed. Please try again."
        );
      } else {
        setLoginError("Login failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error with face login:", error);
      setLoginError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={poppins.className}>
      <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-7">
        <div className="bg-[#0a0a0a] lg:col-span-3 text-white font-poppins flex justify-center items-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-left">
              <h1 className="text-[48px] text-white lg:text-[60px] font-bold m-0 h-fit">
                Login
              </h1>
              <p className="m-0 pb-1 font-poppins opacity-70 text-[16px]">
                Enter your account details
              </p>
            </div>

            {/* Login Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("password");
                  setCapturedImage(null);
                  stopCamera();
                  setLoginError(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  loginMode === "password"
                    ? "bg-[#925FE2] text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode("face");
                  setLoginError(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  loginMode === "face"
                    ? "bg-[#925FE2] text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Face Recognition
              </button>
            </div>

            {loginMode === "password" ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full mb-3 text-white">
                  <Input
                    placeholder="Admission Number"
                    type="text"
                    className="w-full text-[16px]"
                    {...register("admissionNo", { required: true })}
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-red-500">
                    {errors.admissionNo?.message}
                  </p>
                </div>
                <div className="w-full mb-4 text-white">
                  <Input
                    placeholder="Password"
                    type="password"
                    className="w-full text-[16px]"
                    {...register("studentPassword", { required: true })}
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-red-500">
                    {errors.studentPassword?.message}
                  </p>
                </div>
                <div className="mb-4">
                  <a
                    href="#"
                    className="text-[#925FE2] opacity-80 hover:opacity-100 text-sm"
                  >
                    Forget Password?
                  </a>
                </div>
                {loginError && (
                  <div className="mb-4">
                    <p className="p-3 text-sm text-left text-red-500 bg-red-100 border border-red-500 rounded-md bg-opacity-10 border-opacity-30">
                      {loginError}
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#925FE2] py-3 rounded-md text-white font-poppins font-bold text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <div className="w-full">
                {/* Face Recognition Form */}
                <div className="w-full mb-4 text-white">
                  <Input
                    placeholder="Admission Number"
                    type="text"
                    className="w-full text-[16px]"
                    {...registerFace("admissionNo", { required: true })}
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-red-500">
                    {faceErrors.admissionNo?.message}
                  </p>
                </div>

                {/* Camera Section */}
                <div className="w-full">
                  {!showCamera && !capturedImage && (
                    <button
                      type="button"
                      onClick={startCamera}
                      disabled={isLoading}
                      className="w-full bg-[#925FE2] py-3 rounded-md text-white font-poppins font-bold text-[16px] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                    >
                      <CameraIcon size={20} />
                      Open Camera
                    </button>
                  )}

                  {capturedImage && (
                    <div className="w-full">
                      <div className="w-full mb-4 overflow-hidden bg-black rounded-lg">
                        <img
                          src={capturedImage}
                          alt="Captured"
                          className="w-full h-[300px] object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={onFaceLoginSubmit}
                          disabled={isLoading}
                          className="flex-1 bg-[#925FE2] py-3 rounded-md text-white font-medium disabled:opacity-50"
                        >
                          {isLoading ? "Verifying..." : "Login with Face"}
                        </button>
                        <button
                          type="button"
                          onClick={retakePhoto}
                          disabled={isLoading}
                          className="flex-1 py-3 font-medium text-white bg-gray-600 rounded-md disabled:opacity-50"
                        >
                          Retake
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {loginError && (
                  <div className="mt-4">
                    <p className="p-3 text-sm text-left text-red-500 bg-red-100 border border-red-500 rounded-md bg-opacity-10 border-opacity-30">
                      {loginError}
                    </p>
                  </div>
                )}

                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            )}
          </div>
        </div>
        <div className="relative h-screen lg:col-span-4 bg-[#925FE2]">
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
              <span className="font-[100]">student portal</span>
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

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md mx-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Capture for Face Login</h3>
              <button
                onClick={stopCamera}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Instructions */}
            <div className="p-3 mb-4 border rounded-lg bg-blue-950/30 border-blue-600/30">
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="mb-1 font-medium">Position your face:</p>
                  <ul className="space-y-1 text-xs text-blue-200">
                    <li>• Center your face in the oval guide</li>
                    <li>• Look directly at the camera</li>
                    <li>• Ensure good lighting on your face</li>
                    <li>• Remove glasses if possible</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Face position status */}
            {cameraReady && (
              <div
                className={`mb-4 p-2 rounded-lg text-center text-sm font-medium ${
                  faceDetected
                    ? "bg-green-950/30 border border-green-600/30 text-green-400"
                    : "bg-red-950/30 border border-red-600/30 text-red-400"
                }`}
              >
                {faceDetected
                  ? "✓ Face positioned correctly"
                  : "⚠ Adjust your position"}
              </div>
            )}

            <div className="relative mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="object-cover w-full h-64 bg-gray-800 rounded-lg"
                style={{ transform: "scaleX(-1)" }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error);
                  }
                }}
                onCanPlay={() => {
                  setCameraReady(true);
                }}
              />

              {/* Face Guide Overlay */}
              {cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {/* Oval face guide with dynamic color */}
                    <div
                      className={`border-2 rounded-full transition-colors duration-300 ${
                        faceDetected ? "border-green-400" : "border-red-400"
                      }`}
                      style={{
                        width: "160px",
                        height: "200px",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.3)",
                      }}
                    />

                    {/* Guide text with dynamic color */}
                    <div
                      className={`absolute px-2 py-1 text-xs transform -translate-x-1/2 rounded -bottom-8 left-1/2 bg-black/50 whitespace-nowrap transition-colors duration-300 ${
                        faceDetected ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {faceDetected
                        ? "Perfect! Ready to capture"
                        : "Align your face with the guide"}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading indicator while camera initializes */}
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-300">
                      Initializing camera...
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className={`flex-1 px-4 py-2 transition-colors rounded-lg disabled:cursor-not-allowed ${
                  cameraReady && faceDetected
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600 text-gray-300"
                } disabled:bg-gray-600`}
              >
                {!cameraReady
                  ? "Initializing..."
                  : faceDetected
                  ? "Capture Photo"
                  : "Position Face First"}
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
