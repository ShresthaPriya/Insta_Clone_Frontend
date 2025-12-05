import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import InputForm from "../components/FormInput";
import { FormMessage } from "../components/FormMessage";
import { FormButton } from "../components/Button";
import { type profileInput, profileSchema } from "../validator/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import profile from "../assets/padlock_5796702.png";
import SelectForm from "../components/SelectForm";

export const EditProfile = () => {
  const {
    // handleSubmit,
    control,
    formState: { errors },
  } = useForm<profileInput>({
    resolver: zodResolver(profileSchema),
  });
//   const onSubmit = () => {};

  return (
    <div className="border-l-2 flex flex-col items-center justify-center gap-4 p-3 mt-5">
      <div className="flex flex-row gap-3">
        <img src={profile} alt="" className="rounded w-9 h-9" />
        <div className="flex flex-col flex-start text-start">
          <p className="text-md">Username</p>
          <Link to="/" className="text-[#0095F6]">
            Change profile photo
          </Link>
        </div>
      </div>
      <form className="flex flex-col items-center gap-3">
        <Controller
          name="fullname"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return (
              <>
                <InputForm
                  label="Name"
                  type="text"
                  placeholder="Full Name"
                  {...field}
                  className=""
                  InputBorder="thick"
                />
                {errors.fullname && (
                  <FormMessage
                    variant="error"
                    message={errors.fullname.message}
                  />
                )}
              </>
            );
          }}
        />

        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return (
              <>
                <InputForm
                  label="Username"
                  type="text"
                  placeholder="Username"
                  {...field}
                  InputBorder="thick"
                  className="flex"
                />
                {errors.username && (
                  <FormMessage
                    variant="error"
                    message={errors.username.message}
                  />
                )}
              </>
            );
          }}
        />

        <Controller
          name="bio"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return (
              <>
                <InputForm
                  label="Bio"
                  type="text"
                  placeholder=""
                  InputBorder="thick"
                  {...field}
                  className="flex"
                />
                {errors.bio && (
                  <FormMessage variant="error" message={errors.bio.message} />
                )}
              </>
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return (
              <>
                <InputForm
                  label="Email"
                  type="email"
                  placeholder=""
                  {...field}
                  InputBorder="thick"
                  className="flex"
                />
                {errors.email && (
                  <FormMessage variant="error" message={errors.email.message} />
                )}
              </>
            );
          }}
        />
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return (
              <>
                <InputForm
                  label="Phone Number"
                  type="text"
                  placeholder=""
                  {...field}
                  InputBorder="thick"
                  className="flex"
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
          name="gender"
          control={control}
          defaultValue="Prefer not to say"
          render={({ field }) => {
            return (
              <>
                <SelectForm
                  label="Gender"
                  options={["Male", "Female", "Prefer not to say"]}
                  {...field}
                  className=""
                />
                {errors.gender && (
                  <FormMessage
                    variant="error"
                    message={errors.gender.message}
                  />
                )}
              </>
            );
          }}
        />
        <FormButton
          type="submit"
          text="Submit"
          color="secondary"
          size="md"
          rounded="none"
          isHovered={true}
        />
      </form>
    </div>
  );
};
