import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomImage from "../components/CustomImage";
import CommentsModal from "../components/CommentsModal";
import { FiGrid, FiTag, FiMessageCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import FollowersModal from "../components/FollowModal";
import api from "../utils/api";

interface Post {
  id: string;
  urls: string[];
  images: string[];
  likesCount?: number;
  likedByCurrentUser?: boolean;
  commentsCount?: number;
}

interface UserProfile {
  id: string;
  userName: string;
  fullName: string;
  user_profile?: string | null;
  posts: Post[];
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
  bio: string;
}

interface Me {
  id: string;
  userName: string;
}

const BACKEND_URL = "http://localhost:4000"; // replace with your backend URL

const Profile = () => {
  const { userName } = useParams();
  const navigate = useNavigate();

  const [me, setMe] = useState<Me | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"posts" | "tagged">("posts");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get(`/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(res.data);
      } catch {}
    };
    fetchMe();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/user/${userName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser({
        ...res.data,
        posts: res.data.posts.map((p: any) => ({
          ...p,
          images: p.urls.map((u: string) => `${BACKEND_URL}${u}`),
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userName]);

  const isOwnProfile = me?.id === user?.id;

  const handleFollowToggle = async () => {
    if (!user || !me) return;

    try {
      const res = await api.post(
        `/user/${user.id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: res.data.following,
              followersCount: res.data.following
                ? (prev.followersCount || 0) + 1
                : Math.max((prev.followersCount || 1) - 1, 0),
            }
          : prev
      );
    } catch {}
  };

  const openPostModal = async (idx: number) => {
    if (!user) return;
    setSelectedPostIndex(idx);
    setCarouselIndex(0);

    try {
      const postId = user.posts[idx].id;
      const res = await api.get(
        `/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const normalized = (res.data.comments || []).map((c: any) => ({
        ...c,
        likesCount: c.likesCount ?? c.likes?.length ?? 0,
        likedByCurrentUser: c.likedByCurrentUser ?? false,
        replies: (c.replies || []).map((r: any) => ({
          ...r,
          likesCount: r.likesCount ?? r.likes?.length ?? 0,
          likedByCurrentUser: r.likedByCurrentUser ?? false,
        })),
      }));

      setPostComments(normalized);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      setPostComments([]);
    }

    setModalOpen(true);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-10 items-center mb-6">
        <CustomImage
          imgSrc={
            user.user_profile
              ? `${BACKEND_URL}/uploads/${user.user_profile}?t=${Date.now()}`
              : "/avatar.png"
          }
          className="rounded-full w-16 h-16 object-cover"
        />

        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold">{user.userName}</p>
          <p className="text-sm">{user.fullName}</p>

          <div className="flex gap-4 text-sm">
            <p>{user.posts.length} posts</p>

            <button
              onClick={() => setShowFollowers(true)}
              className="hover:underline"
            >
              {user.followersCount || 0} followers
            </button>

            <button
              onClick={() => setShowFollowing(true)}
              className="hover:underline"
            >
              {user.followingCount || 0} following
            </button>
          </div>

          <p className="text-sm">{user.bio}</p>
        </div>

        {isOwnProfile ? (
          <button
            className="border-none px-4 py-1 rounded-md bg-gray-100 text-sm"
            onClick={() =>
              navigate("/edit-profile", {
                state: { fromProfile: true },
              })
            }
          >
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-1 rounded-md ${
                user.isFollowing
                  ? "bg-gray-100 text-gray-800 text-sm"
                  : "bg-blue-600 text-white text-sm"
              }`}
            >
              {user.isFollowing ? "Unfollow" : "Follow"}
            </button>

            {user.isFollowing && (
              <button
                className="px-4 py-1 rounded-md bg-green-500 text-white text-sm"
                onClick={() => navigate(`/messages/${user.id}`)}
              >
                Message
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-10 border-t pt-4 text-sm">
        <button
          onClick={() => setActiveTab("posts")}
          className="flex gap-2 text-sm"
        >
          <FiGrid className="text-xl" /> POSTS
        </button>
        <button onClick={() => setActiveTab("tagged")} className="flex gap-2">
          <FiTag className="text-xl" /> TAGGED
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 mt-6">
        {activeTab === "posts" &&
          user.posts.map((post, idx) => (
            <div
              key={post.id}
              className="relative cursor-pointer group"
              onClick={() => openPostModal(idx)}
            >
              <img src={post.images[0]} className="w-full h-80 object-cover" />
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

      {modalOpen && user && (
        <CommentsModal
          post={user.posts[selectedPostIndex]}
          comments={postComments}
          current={carouselIndex}
          setCurrent={setCarouselIndex}
          onClose={() => setModalOpen(false)}
        />
      )}

      {showFollowers && (
        <FollowersModal
          userId={user.id}
          type="followers"
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <FollowersModal
          userId={user.id}
          type="following"
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
};

export default Profile;
