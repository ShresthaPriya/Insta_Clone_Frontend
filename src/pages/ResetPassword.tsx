import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import InputForm from "../components/FormInput";
import { FormMessage } from "../components/FormMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../validator/formValidation";
import type { ResetFormInputs } from "../validator/formValidation";
import { FormButton } from "../components/Button";
import { Link } from "react-router-dom";
import { MdOutlineLockReset } from "react-icons/md"

// import profile from "../assets/Vector.png";

// type ResetFormInputs = {
//     email: string;
// }

const ResetPassword = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetFormInputs> = async (
    data: ResetFormInputs
  ) => {};
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-8 h-screen">
      {/* <img src={profile} alt="Insta Logo" className="object-contain" /> */}
      <MdOutlineLockReset className="text-8xl text-black-500"/>
      <h1 className="text-2xl text-grey-200">Trouble Logging In?</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-sm"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => {
            return (
              <>
                <InputForm
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  className=""
                />
                {errors.email && (
                  <FormMessage
                    variant="error"
                    message={errors.email.message}
                  />
                )}
              </>
            );
          }}
        />
      </form>

      <FormButton
        type="submit"
        text="Sent Reset Link"
        color="primary"
        size="md"
        rounded="none"
        isHovered={true}
        className="w-sm "
      />
      <div className="flex flex-col gap-8 items-center">
        <span className="text-gray-600">OR</span>
        <Link to="/login" className="text-blue-500">
            Create New Account?
          </Link>
        <div className="flex justify-around gap-3 w-sm">
          
          <Link to="/login" className="text-blue-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
