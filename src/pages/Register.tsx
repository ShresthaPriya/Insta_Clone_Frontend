import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import InputForm from "../components/FormInput";
import { FormMessage } from "../components/FormMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "../validator/formValidation";
import type { RegisterFormInput } from "../validator/formValidation";
import { FormButton } from "../components/Button";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import profile from "../assets/Vector.png";
import { useState} from "react";
import OtpModal from "./OtpModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [otpPhone, setOtpPhone] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate()
  const [userData, setUserData] = useState<RegisterFormInput | null>(null);
const [viewPassword, setViewPassword] = useState(false);

  const { handleSubmit, control, formState: { errors } } = useForm<RegisterFormInput>({
    resolver: zodResolver(registrationSchema),
  });

 const onSubmit: SubmitHandler<RegisterFormInput> = async (data) => {
  try {
    const result = await axios.post("http://localhost:4000/api/v1/otp/generate-otp", {
      phoneNumber: data.phoneNumber,
      userInfo: {
        fullName: data.fullname,
        userName: data.username,
        phoneNumber: data.phoneNumber,
        password: data.password,
      },
    });

    if (!result.data.success) {
      toast.error(result.data.message || "Cannot send OTP");
      return; 
    }

    setOtpPhone(data.phoneNumber);
    setUserData(data);
    setShowOtpModal(true);
    setWaitTime(result.data.waitSeconds);
    setGeneratedOtp(result.data.otp);
    toast.success("OTP sent successfully!");

  } catch (err: any) {
    // Handle server errors
    if (err.response?.status === 409 || err.response?.data?.message?.includes("already registered")) {
      toast.error("User already exists. Please login.");
      navigate("/login");
      return;
    }

    toast.error(err.response?.data?.message || "Error sending OTP");
  }
};


  const handleVerifyOtp = async (enteredOtp: string) => {
    if (!userData) return;
    try {
      const res = await axios.post("http://localhost:4000/api/v1/otp/verify-otp", {
        phoneNumber: otpPhone,
        otp: enteredOtp
      });
      if (res.data.success) {
        toast.success("OTP verified! Registration complete.");
        setShowOtpModal(false);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

const handleResendOtp = async () => {
  if (!userData) return "";

  try {
    const res = await axios.post("http://localhost:4000/api/v1/otp/generate-otp", {
      phoneNumber: otpPhone,
      userInfo: {
        fullName: userData.fullname,
        userName: userData.username,
        phoneNumber: otpPhone,
        password: userData.password
      }
    });

    if (!res.data.success) {
      toast.error(res.data.message || "Cannot resend OTP yet");
      return "";
    }

    setGeneratedOtp(res.data.otp);
    setWaitTime(res.data.waitSeconds);
    return res.data.otp;

  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to resend OTP");
    return "";
  }
};


  return (
    <>
      {showOtpModal && otpPhone && (
        <OtpModal
          otpPhone={otpPhone}
          otp={generatedOtp}
          onClose={() => setShowOtpModal(false)}
          onResendOtp={handleResendOtp}
          onVerify={handleVerifyOtp}
          waitSeconds={waitTime}
        />
      )}

      <div className="flex flex-col justify-center items-center p-4 gap-8 h-screen ">
        <img src={profile} alt="Logo" className="object-contain" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-sm">
          <Controller
            name="fullname"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <InputForm placeholder="Full Name" {...field} />
                {errors.fullname && <FormMessage variant="error" message={errors.fullname.message} />}
              </>
            )}
          />

          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <InputForm placeholder="Username" {...field} />
                {errors.username && <FormMessage variant="error" message={errors.username.message} />}
              </>
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <>
                <InputForm placeholder="Phone Number" {...field} />
                {errors.phoneNumber && <FormMessage variant="error" message={errors.phoneNumber.message} />}
              </>
            )}
          />

            <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <InputForm
                  type={viewPassword ? "text" : "password"}
                  placeholder="Password"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setViewPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {viewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && <FormMessage variant="error" message={errors.password.message} />}
              </div>
            )}
          />

          <FormButton type="submit" text="Register" color="primary" size="md" />
        </form>

        <div className="flex justify-around gap-3 w-sm">
          <p>Already have an account?</p>
          <Link to="/login" className="text-blue-500">Login</Link>
        </div>
      </div>
    </>
  );
};

export default Register;
