import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import CustomImage from "./CustomImage";
import fallbackImg from "../assets/pi.jpg";
import { socket } from "../socket/socket";

interface UserItem {
  id: string;
  userName: string;
  fullName: string;
  user_profile?: string | null;
  isFollowing?: boolean;
}

interface FollowModalProps {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

interface CancelRequestProps {
  onConfirm: () => void;
  onClose: () => void;
}

const BACKEND_URL = "http://localhost:4000";

export const CancelRequestModal = ({
  onConfirm,
  onClose,
}: CancelRequestProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-80 rounded-xl overflow-hidden">
        <div className="p-4 text-center">
          <p className="font-semibold text-lg mb-2">Unfollow this user?</p>
          <p className="text-sm text-gray-500">
            You’ll need to follow again if you change your mind.
          </p>
        </div>

        <div className="border-t">
          <button
            onClick={onConfirm}
            className="w-full py-3 text-red-600 font-semibold hover:bg-gray-100"
          >
            Unfollow
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 border-t hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const FollowModal = ({ userId, type, onClose }: FollowModalProps) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    api
      .get(`/follow/${userId}/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setUsers(
          type === "followers" ? res.data.followers : res.data.following
        )
      )
      .catch(() => {});
  }, [userId, type, token]);

  useEffect(() => {
    const handler = (data: any) => {
      if (data.type === "FOLLOW_REQUEST" && type === "followers") {
        setUsers((prev) => {
          if (prev.some((u) => u.id === data.sender.id)) return prev;

          return [
            {
              id: data.sender.id,
              userName: data.sender.userName,
              fullName: data.sender.fullName,
              user_profile: data.sender.user_profile,
              isFollowing: false,
            },
            ...prev,
          ];
        });
      }

      if (data.type === "FOLLOW_REQUEST" && type === "following") {
        setUsers((prev) => {
          if (prev.some((u) => u.id === data.receiver.id)) return prev;

          return [
            {
              id: data.receiver.id,
              userName: data.receiver.userName,
              fullName: data.receiver.fullName,
              user_profile: data.receiver.user_profile,
              isFollowing: false,
            },
            ...prev,
          ];
        });
      }

      if (data.type === "FOLLOW_ACCEPTED") {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === data.senderId ? { ...u, isFollowing: true } : u
          )
        );
      }

      if (data.type === "UNFOLLOW") {
        setUsers((prev) =>
          type === "following"
            ? prev.filter((u) => u.id !== data.senderId)
            : prev.map((u) =>
                u.id === data.senderId
                  ? { ...u, isFollowing: false }
                  : u
              )
        );
      }
    };

    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [type]);

  const followUser = async (targetId: string) => {
    await api.post(
      `/follow/${targetId}/follow`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetId ? { ...u, isFollowing: true } : u
      )
    );
  };

  const unfollowUser = async () => {
    if (!selectedUserId) return;

    await api.post(
      `/follow/${selectedUserId}/unfollow`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      type === "following"
        ? prev.filter((u) => u.id !== selectedUserId)
        : prev.map((u) =>
            u.id === selectedUserId
              ? { ...u, isFollowing: false }
              : u
          )
    );

    setShowCancel(false);
    setSelectedUserId(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
        <div className="bg-white w-[400px] max-h-[70vh] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <p className="font-semibold capitalize">{type}</p>
            <button onClick={onClose} className="text-xl">✕</button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {users.length === 0 ? (
              <p className="text-center p-4 text-gray-500">
                No {type} yet.
              </p>
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
                          ? `${BACKEND_URL}/uploads/${u.user_profile}`
                          : fallbackImg
                      }
                      fallBack={fallbackImg}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-sm">{u.userName}</p>
                      <p className="text-xs text-gray-500">{u.fullName}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (u.isFollowing) {
                        setSelectedUserId(u.id);
                        setShowCancel(true);
                      } else {
                        followUser(u.id);
                      }
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

      {showCancel && (
        <CancelRequestModal
          onConfirm={unfollowUser}
          onClose={() => {
            setShowCancel(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </>
  );
};

export default FollowModal;
