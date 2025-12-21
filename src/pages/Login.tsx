import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import InputForm from "../components/FormInput";
import { FormMessage } from "../components/FormMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../validator/formValidation";
import { FormButton } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import profile from "../assets/Vector.png";
import loginLogo from "../assets/landing-3x.png";
import api from "../utils/api";
import { setTokens } from "../utils/auth";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [viewPassword, setViewPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const res = await api.post("/user/login", {
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      if (res.data.success) {
        const { accessToken, refreshToken, message } = res.data;
        setTokens(accessToken, refreshToken);
        toast.success(message || "Logged in successfully!");
        navigate("/");
      } else {
        setError("password", {
          message: res.data.message || "Invalid credentials",
        });
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err);
      setError("password", {
        message: err.response?.data?.message || "Invalid credentials",
      });
      toast.error(
        err.response?.data?.message || "Something went wrong during login!"
      );
    }
  };

  return (
    <div className="flex flex-row justify-around items-center">
      <img
        src={loginLogo}
        alt="Login Image"
        className="hidden w-90 h-90 md:block object-contain"
      />
      <div className="flex flex-col justify-center items-center p-4 gap-8 h-screen">
        <img src={profile} alt="Logo" className="object-contain" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-sm">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <>
                <InputForm type="text" placeholder="Phone Number" {...field} />
                {errors.phoneNumber && (
                  <FormMessage variant="error" message={errors.phoneNumber.message} />
                )}
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
                {errors.password && (
                  <FormMessage variant="error" message={errors.password.message} />
                )}
              </div>
            )}
          />

          <FormButton
            type="submit"
            text="Login"
            color="primary"
            size="md"
            rounded="none"
            isHovered
            className="w-sm"
          />
        </form>

        <div className="flex flex-col gap-8 items-center">
          <span className="text-gray-600">OR</span>
          <Link to="/resetPassword" className="text-blue-500">
            Forgot Password?
          </Link>
          <div className="flex justify-around gap-3 w-sm">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
