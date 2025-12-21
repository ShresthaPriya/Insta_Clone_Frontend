import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import CustomImage from "./CustomImage";
import fallbackImg from "../assets/pi.jpg";

interface UserItem {
  id: string;
  userName: string;
  fullName: string;
  user_profile?: string | null;
  isFollowing?: boolean;
}

interface Props {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

const BACKEND_URL = "http://localhost:4000";

const FollowModal = ({ userId, type, onClose }: Props) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/user/${userId}/${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(type === "followers" ? res.data.followers : res.data.following);
      } catch (err) {
        console.error("Failed to fetch list", err);
      }
    };

    fetchUsers();
  }, [userId, type]);

  const toggleFollow = async (targetId: string) => {
    try {
      const res = await api.post(
        `/user/${targetId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetId
            ? { ...u, isFollowing: res.data.following }
            : u
        )
      );
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] max-h-[70vh] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-semibold capitalize">{type}</p>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {users.length === 0 ? (
            <p className="text-center p-4 text-gray-500">No {type} yet.</p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    navigate(`/profile/${u.userName}`);
                    onClose();
                  }}
                >
                  <CustomImage
                    imgSrc={
                      u.user_profile
                        ? `${BACKEND_URL}/uploads/${u.user_profile}?t=${Date.now()}`
                        : fallbackImg
                    }
                    fallBack={fallbackImg}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={u.userName}
                  />
                  <div>
                    <p className="font-semibold text-sm">{u.userName}</p>
                    <p className="text-xs text-gray-500">{u.fullName}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(u.id);
                  }}
                  className={`text-sm px-3 py-1 rounded-md font-semibold ${
                    u.isFollowing
                      ? "bg-gray-100 text-black"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {u.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
