
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import InputForm from "../components/FormInput";
import { FormMessage } from "../components/FormMessage";
import { FormButton } from "../components/Button";
import { type profileInput, profileSchema } from "../validator/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import profilePlaceholder from "../assets/padlock_5796702.png";
import SelectForm from "../components/SelectForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";

export const EditProfile = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<profileInput>({
    resolver: zodResolver(profileSchema),
  });

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const BACKEND_URL = "http://localhost:4000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data) {
          reset({
            fullname: res.data.fullName || "",
            username: res.data.userName || "",
            email: res.data.email || "",
            phoneNumber: res.data.phoneNumber || "",
            bio: res.data.bio || "",
            gender: res.data.gender || "Prefer not to say",
          });

          setUsername(res.data.userName || "");

          if (res.data.user_profile) {
            setProfileUrl(`${BACKEND_URL}/uploads/${res.data.user_profile}?t=${Date.now()}`);
          } else {
            setProfileUrl("");
          }
        }
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setProfileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit: SubmitHandler<profileInput> = async (data) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("You must be logged in");

      const formData = new FormData();
      formData.append("fullName", data.fullname);
      formData.append("userName", data.username);
      formData.append("bio", data.bio || "");
      formData.append("email", data.email || "");
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("gender", data.gender || "");
      if (profilePic) formData.append("user_profile", profilePic);

      const res = await api.put("/user/edit-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");

      reset({
        fullname: res.data.user.fullName,
        username: res.data.user.userName,
        email: res.data.user.email || "",
        phoneNumber: res.data.user.phoneNumber || "",
        bio: res.data.user.bio || "",
        gender: res.data.user.gender || "Prefer not to say",
      });
      setUsername(res.data.user.userName || "");

      if (res.data.user.user_profile) {
        setProfileUrl(`${BACKEND_URL}/uploads/${res.data.user.user_profile}?t=${Date.now()}`);
        
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-3 mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-row gap-3 justify-start">
        <img
          src={profileUrl || profilePlaceholder}
          alt="Profile"
          className="rounded-full w-16 h-16 object-cover"
          onError={(e) => { e.currentTarget.src = profilePlaceholder; }}
        />

        <div className="flex flex-col flex-start text-start">
          <p className="text-md font-semibold">{username || "Username"}</p>
          <label className="text-[#0095F6] cursor-pointer">
            Change profile photo
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-3 w-full max-w-md"
      >
        <Controller name="fullname" control={control} render={({ field }) => (
          <>
            <InputForm label="Name" type="text" placeholder="Full Name" {...field} InputBorder="thick" />
            {errors.fullname && <FormMessage variant="error" message={errors.fullname.message} />}
          </>
        )} />
        <Controller name="username" control={control} render={({ field }) => (
          <>
            <InputForm label="Username" type="text" placeholder="Username" {...field} InputBorder="thick" />
            {errors.username && <FormMessage variant="error" message={errors.username.message} />}
          </>
        )} />
        <Controller name="bio" control={control} render={({ field }) => (
          <>
            <InputForm label="Bio" type="text" placeholder="" {...field} InputBorder="thick" />
            {errors.bio && <FormMessage variant="error" message={errors.bio.message} />}
          </>
        )} />
        <Controller name="email" control={control} render={({ field }) => (
          <>
            <InputForm label="Email" type="email" placeholder="" {...field} InputBorder="thick" />
            {errors.email && <FormMessage variant="error" message={errors.email.message} />}
          </>
        )} />
        <Controller name="phoneNumber" control={control} render={({ field }) => (
          <>
            <InputForm label="Phone Number" type="text" placeholder="" {...field} InputBorder="thick" />
            {errors.phoneNumber && <FormMessage variant="error" message={errors.phoneNumber.message} />}
          </>
        )} />
        <Controller name="gender" control={control} defaultValue="Prefer not to say" render={({ field }) => (
          <>
            <SelectForm label="Gender" options={["Male", "Female", "Prefer not to say"]} {...field} />
            {errors.gender && <FormMessage variant="error" message={errors.gender.message} />}
          </>
        )} />

        <FormButton type="submit" text="Submit" color="primary" size="md" rounded="md" isHovered />
      </form>
    </div>
  );
};
