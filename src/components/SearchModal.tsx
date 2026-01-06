import { FiX } from "react-icons/fi";
import CustomImage from "../components/CustomImage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import fallbackImg from "../assets/pi.jpg";

interface SearchModalProps {
  onClose: () => void;
}

interface User {
  userName: string;
  fullName: string;
  user_profile?: string; 
}

const BACKEND_URL = "http://localhost:4000";

const getProfileImage = (avatar?: string) =>
  avatar && avatar.trim() !== ""
    ? `${BACKEND_URL}/uploads/${avatar}?t=${Date.now()}`
    : fallbackImg;

const SearchModal = ({ onClose }: SearchModalProps) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/user/search?search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalizedUsers: User[] = (res.data || []).map((u: any) => ({
          userName: u.userName,
          fullName: u.fullName,
          user_profile: u.user_profile
            ? typeof u.user_profile === "string"
              ? u.user_profile
              : u.user_profile.avatar || ""
            : "",
        }));

        setUsers(normalizedUsers);
      } catch (error) {
        console.error("Failed to search users", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, token]);

  return (
    <div className="fixed top-0 left-16 md:left-64 h-screen w-[400px] bg-white z-50 rounded-r-2xl shadow-2xl">
      <div className="px-6 py-5">
        <h2 className="text-xl font-semibold mb-4">Search</h2>

        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-400">
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {loading && <p className="text-sm text-gray-500 text-center">Searching...</p>}

        {!loading && search && users.length === 0 && (
          <p className="text-sm text-gray-500 text-center">No users found</p>
        )}

        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-lg"
              onClick={() => {
                navigate(`/profile/${user.userName}`, { state: { from: "search" } });
                onClose();
              }}
            >
              <CustomImage
                imgSrc={getProfileImage(user.user_profile)}
                fallBack={fallbackImg}
                alt={user.userName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{user.userName}</p>
                <p className="text-xs text-gray-500">{user.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
