import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import CustomImage from "../components/CustomImage";
import fallbackImg from "../assets/pi.jpg"; 

interface SuggestionUser {
  id: string;
  userName: string;
  fullName: string;
  user_profile?: string;
  isFollowing?: boolean;
}

const BACKEND_URL = "http://localhost:4000";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState<SuggestionUser[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/user/suggestions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleFollowToggle = async (userId: string) => {
    try {
      const res = await api.post(
        `/user/${userId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuggestions((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: res.data.following } : u
        )
      );
    } catch (err) {
      console.error("Failed to follow/unfollow user", err);
    }
  };

  return (
    <div className="hidden lg:block w-[350px] sticky top-10 ml-10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 font-semibold text-sm">
          Suggestions for you
        </p>
        <button className="text-black text-xs font-semibold">See All</button>
      </div>

      <div className="flex flex-col gap-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${user.userName}`)}
            >
              <CustomImage
                imgSrc={
                  user.user_profile
                    ? `${BACKEND_URL}/uploads/${user.user_profile}?t=${Date.now()}`
                    : fallbackImg
                }
                fallBack={fallbackImg}
                className="w-10 h-10 rounded-full object-cover"
                alt={user.userName}
              />
              <div>
                <p className="font-semibold text-sm">{user.userName}</p>
                <p className="text-gray-500 text-xs">{user.fullName}</p>
              </div>
            </div>

            <button
              className={`text-sm font-semibold px-3 py-1 rounded-md ${
                user.isFollowing
                  ? "bg-gray-100 text-black"
                  : "bg-blue-600 text-white"
              }`}
              onClick={(e) => {
                e.stopPropagation(); 
                handleFollowToggle(user.id);
              }}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
