import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LogoutModalProps {
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.removeItem("accessToken");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={!isLoading ? onCancel : undefined}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative w-[340px] bg-white rounded-2xl shadow-xl">
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold">Log out?</h2>
          <p className="text-gray-500 text-sm mt-2">
            Are you sure you want to log out of your account?
          </p>
        </div>

        <div className="flex m-2 gap-2">
          <button
            disabled={isLoading}
            onClick={onCancel}
            className="w-1/2 py-3 text-sm rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={handleLogout}
            className="w-1/2 py-3 text-sm rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-500 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              "Log out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
