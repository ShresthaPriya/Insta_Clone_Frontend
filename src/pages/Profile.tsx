import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import CustomImage from "../components/CustomImage";
import FollowModal, { CancelRequestModal } from "../components/FollowModal";
import { FiSettings, FiLock } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { socket } from "../socket/socket";
import CommentsModal from "../components/CommentsModal";

interface Post {
  id: string;
  urls: string[];
  user_profile: string;
  username: string;
  images: string[];
  likesCount?: number;
  likedByCurrentUser?: boolean;
  commentsCount?: number;
  isDeleted?: boolean;
}

interface UserProfile {
  id: string;
  userName: string;
  fullName: string;
  user_profile?: string | null;
  bio?: string;
  posts: Post[];
  isPrivate: boolean;
  isFollowing: boolean;
  isRequested: boolean;
  followersCount: number;
  followingCount: number;
}

type FollowState = "FOLLOW" | "REQUESTED" | "FOLLOWING";

const BACKEND_URL = "http://localhost:4000";

const Profile = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [meId, setMeId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [followState, setFollowState] = useState<FollowState>("FOLLOW");
  const [loading, setLoading] = useState(true);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [postComments, setPostComments] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMeId(res.data.id));
  }, [token]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/${userName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredPosts = (res.data.posts || [])
        .filter((p: any) => !p.deletedAt)
        .map((p: any) => ({
          ...p,
          images: p.urls.map((u: string) => `${BACKEND_URL}${u}`),
          user_profile: p.user_profile
            ? `${BACKEND_URL}/uploads/${p.user_profile}`
            : "/avatar.png",
        }));

      setUser({ ...res.data, posts: filteredPosts });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userName, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!user) return;
    if (user.isFollowing) setFollowState("FOLLOWING");
    else if (user.isRequested) setFollowState("REQUESTED");
    else setFollowState("FOLLOW");
  }, [user]);

  useEffect(() => {
    if (!user || !meId) return;

    const handler = (data: any) => {
      if (data.type === "FOLLOW_ACCEPTED" && data.receiverId === meId) {
        setUser((prev) =>
          prev ? { ...prev, isFollowing: true, isRequested: false } : prev
        );
        setFollowState("FOLLOWING");
      }

      if (data.type === "UNFOLLOW" && data.receiverId === user.id) {
        setUser((prev) =>
          prev ? { ...prev, followersCount: prev.followersCount - 1 } : prev
        );
      }
    };

    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [user, meId]);

  const handleFollow = async () => {
    if (!user) return;

    if (followState === "REQUESTED") {
      setShowCancelModal(true);
      return;
    }

    if (followState === "FOLLOWING") {
      await api.post(
        `/follow/${user.id}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) =>
        prev
          ? { ...prev, isFollowing: false, followersCount: prev.followersCount - 1 }
          : prev
      );
      setFollowState("FOLLOW");
      return;
    }

    await api.post(
      `/follow/${user.id}/follow`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser((prev) =>
      prev
        ? {
          ...prev,
          isRequested: prev.isPrivate,
          isFollowing: !prev.isPrivate,
          followersCount: prev.isPrivate
            ? prev.followersCount
            : prev.followersCount + 1,
        }
        : prev
    );

    setFollowState(user.isPrivate ? "REQUESTED" : "FOLLOWING");
  };

  const confirmCancelRequest = async () => {
    if (!user) return;

    await api.delete(`/follow/${user.id}/follow-request/cancel`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser((prev) =>
      prev
        ? { ...prev, isRequested: false, followersCount: prev.followersCount - 1 }
        : prev
    );
    setFollowState("FOLLOW");
    setShowCancelModal(false);
  };

  const openPostModal = async (idx: number) => {
    if (!user) return;

    setSelectedPostIndex(idx);
    setCarouselIndex(0);

    try {
      const postId = user.posts[idx].id;
      const res = await api.get(`/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalized = (res.data.comments || []).map((c: any) => ({
        ...c,
        likesCount: c.likesCount ?? c.likes?.length ?? 0,
        likedByCurrentUser: c.likedByCurrentUser ?? false,
        user_profile: c.user?.user_profile
          ? `${BACKEND_URL}/uploads/${c.user.user_profile}`
          : "/avatar.png",
        username: c.user?.username ?? "unknown",
        replies: (c.replies || []).map((r: any) => ({
          ...r,
          likesCount: r.likesCount ?? r.likes?.length ?? 0,
          likedByCurrentUser: r.likedByCurrentUser ?? false,
          user_profile: r.user?.user_profile
            ? `${BACKEND_URL}/uploads/${r.user.user_profile}`
            : "/avatar.png",
          username: r.user?.username ?? "unknown",
        })),
      }));

      setPostComments(normalized);
    } catch {
      setPostComments([]);
    }

    setModalOpen(true);
  };

  const handlePostDeleted = () => {
    setUser((prev: any) => ({
      ...prev,
      posts: prev.posts.filter(
        (_: any, i: number) => i !== selectedPostIndex
      ),
    }));
    setModalOpen(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  const isOwnProfile = meId === user.id;
  const canViewPosts =
    !user.isPrivate || followState === "FOLLOWING" || isOwnProfile;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-10 items-center mb-6">
        <CustomImage
          imgSrc={
            user.user_profile
              ? `${BACKEND_URL}/uploads/${user.user_profile}`
              : "/avatar.png"
          }
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <p className="text-xl font-semibold">{user.userName}</p>
          <p>{user.fullName}</p>

          <div className="flex gap-4 text-sm">
            <span>{canViewPosts ? user.posts.length : 0} posts</span>
            <button onClick={() => setShowFollowers(true)}>
              {user.followersCount} followers
            </button>
            <button onClick={() => setShowFollowing(true)}>
              {user.followingCount} following
            </button>
          </div>

          <p>{user.bio}</p>
        </div>

        {isOwnProfile ? (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-4 py-1 bg-gray-100 rounded"
            >
              Edit profile
            </button>
            <button
              onClick={() => navigate("/account-settings")}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FiSettings />
            </button>
          </div>
        ) : (
          <button
            onClick={handleFollow}
            className={`px-4 py-1 rounded font-medium ${followState === "FOLLOW"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
              }`}
          >
            {followState === "FOLLOW"
              ? "Follow"
              : followState === "REQUESTED"
                ? "Requested"
                : "Following"}
          </button>
        )}
      </div>

      {!canViewPosts ? (
        <div className="flex flex-col items-center mt-20 text-gray-500">
          <FiLock />
          <p>This account is private</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 mt-6">
          {user.posts.map((post, idx) => (
            <div
              key={post.id}
              className="relative cursor-pointer group"
              onClick={() => openPostModal(idx)}
            >
              <img
                src={post.images[0]}
                className="w-full h-80 object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <div className="flex gap-6 text-white">
                  <span className="flex items-center gap-1">
                    <FaHeart /> {post.likesCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageCircle /> {post.commentsCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && user && (
        <CommentsModal
          post={{
            ...user.posts[selectedPostIndex],
            username:
              user.posts[selectedPostIndex].username ?? user.userName,
            user_profile:
              user.posts[selectedPostIndex].user_profile ?? "/avatar.png",
          }}
          comments={postComments}
          current={carouselIndex}
          setCurrent={setCarouselIndex}
          onClose={() => setModalOpen(false)}
          onPostDeleted={handlePostDeleted}
        // currentUserId={meId} 
        />
      )}


      {showFollowers && (
        <FollowModal
          userId={user.id}
          type="followers"
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <FollowModal
          userId={user.id}
          type="following"
          onClose={() => setShowFollowing(false)}
        />
      )}

      {showCancelModal && (
        <CancelRequestModal
          onConfirm={confirmCancelRequest}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
