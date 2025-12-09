import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import InputForm from "../components/FormInput";
import { FormMessage } from "../components/FormMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../validator/formValidation";
// import type { RegisterFormInput } from "../validator/formValidation";
import { FormButton } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import profile from "../assets/Vector.png";
import loginLogo from "../assets/landing-3x.png";

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

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const result = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          phoneNumber: data.phoneNumber,
          password: data.password,
        }
      );

      if (result.data.result?.success) {
        localStorage.setItem("accessToken", result.data.result.accessToken);
        toast.success(result.data.result.message || "Logged in successfully!");
        navigate("/");
      } else {
        setError("password", {
          message: result.data.result.message || "Invalid credentials",
        });
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err);
      setError("password", {
      message: err.response?.data?.message || "Invalid credentials",
    });
    if (err.response?.status === 409) {
    toast.error(err.response.data.message || "Account not verified or conflict!");
  } else {
    toast.error(err.response?.data?.message || "Something went wrong!");
  }
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
        <img src={profile} alt="Insta Logo" className="object-contain" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-sm"
        >
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <InputForm
                    type="text"
                    placeholder="Phone Number"
                    {...field}
                    className=""
                  />
                  {errors.phoneNumber && (
                    <FormMessage
                      variant="error"
                      message={errors.phoneNumber.message}
                    />
                  )}
                </>
              );
            }}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <>
                  <InputForm
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className=""
                  />
                  {errors.password && (
                    <FormMessage
                      variant="error"
                      message={errors.password.message}
                    />
                  )}
                </>
              );
            }}
          />
          <FormButton
            type="submit"
            text="Login"
            color="primary"
            size="md"
            rounded="none"
            isHovered={true}
            className="w-sm "
          />
        </form>

        <div className="flex flex-col gap-8 items-center">
          <span className="text-gray-600">OR</span>
          <Link to="/resetPassword" className="text-blue-500">
            Forgot Password?
          </Link>
          <div className="flex justify-around gap-3 w-sm">
            <p className="">Don't have an account?</p>
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
