import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const AccountSettings = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchMe = async () => {
      const res = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsPrivate(res.data.isPrivate);
    };
    fetchMe();
  }, []);

  const togglePrivacy = async () => {
    try {
      const res = await api.put(
        "/user/account-privacy",
        { isPrivate: !isPrivate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsPrivate(res.data.isPrivate);
      toast.success("Privacy updated");
    } catch {
      toast.error("Failed to update privacy");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">Account Settings</h1>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Private Account</p>
          <p className="text-sm text-gray-500">
            Only approved followers can see your posts
          </p>
        </div>

        <button
          onClick={togglePrivacy}
          className={`w-12 h-6 rounded-full transition ${
            isPrivate ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`block w-5 h-5 bg-white rounded-full transform transition ${
              isPrivate ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
