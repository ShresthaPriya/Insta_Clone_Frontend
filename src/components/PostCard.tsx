import {
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "./FeedPosts";
import axios from "axios";
import CustomImage from "./CustomImage";
import CommentsModal from "./CommentsModal";
import fallbackImg from "../assets/pi.jpg";

interface Reply {
  id: string;
  text: string;
  createdAt: string;
  user: {
    userName: string;
    user_profile?: string | null;
  };
  likesCount?: number;
  likedByCurrentUser?: boolean;
}

interface CommentShape {
  id: string;
  text: string;
  createdAt: string;
  user: {
    userName: string;
    user_profile?: string | null;
  };
  replies: Reply[];
  likesCount?: number;
  likedByCurrentUser?: boolean;
}

interface PostCardProps {
  data: Post;
  currentUserId: string;
}

const BACKEND_URL = "http://localhost:4000";

const PostCard = ({ data }: PostCardProps) => {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [comment, setComment] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<CommentShape[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const multipleImages = data.images.length > 1;

  useEffect(() => {
    setLikesCount(data.likesCount ?? 0);
    setCommentsCount(data.commentsCount ?? 0);
    setLiked(data.likedByCurrentUser ?? false);
  }, [data]);

  const prevImage = () => setCurrent((p) => (p > 0 ? p - 1 : p));
  const nextImage = () =>
    setCurrent((p) => (p < data.images.length - 1 ? p + 1 : p));

  const getUploadTime = (dateString: string) => {
    const now = Date.now();
    const post = new Date(dateString).getTime();
    const diff = Math.floor((now - post) / 1000);

    if (diff < 60) return `${diff} s`;
    if (diff < 3600) return `${Math.floor(diff / 60)} m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;

    const d = Math.floor(diff / 86400);
    return `${d} d${d > 1 ? "s" : ""}`;
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/posts/${data.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${BACKEND_URL}/api/v1/posts/${data.id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      setComments(normalized);
      setCommentsCount(normalized.length);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/posts/add`,
        { postId: data.id, text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [res.data.comment, ...prev]);
      setCommentsCount((prev) => prev + 1);

      setComment("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="bg-white w-full mx-auto mb-6 rounded-md">
        <div className="flex items-center justify-between px-3 py-2">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/profile/${data.username}`)}
          >
            <CustomImage
              imgSrc={
                data.user_profile
                  ? `${BACKEND_URL}/uploads/${data.user_profile}?t=${Date.now()}`
                  : null
              }
              fallBack={fallbackImg} 
              alt={data.username}
              className="w-9 h-9 rounded-full object-cover"
              onClick={() => navigate(`/profile/${data.username}`)}
            />

            <span className="font-semibold text-sm">{data.username}</span>
            <p className="px-2 text-xs text-gray-400 uppercase">
              {getUploadTime(data.created_at)}
            </p>
          </div>

          <span className="text-xl cursor-pointer">⋮</span>
        </div>

        {data.images.length > 0 && (
          <div className="relative w-full h-[500px] bg-black">
            <img
              src={data.images[current]}
              className="w-full h-full object-cover"
            />

            {multipleImages && current > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white"
              >
                <FiChevronLeft size={20} />
              </button>
            )}

            {multipleImages && current < data.images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white"
              >
                <FiChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex gap-4">
            {liked ? (
              <FaHeart
                onClick={handleLike}
                className="text-2xl cursor-pointer text-red-500"
              />
            ) : (
              <FaRegHeart
                onClick={handleLike}
                className="text-2xl cursor-pointer"
              />
            )}

            <FiMessageCircle
              onClick={async () => {
                await fetchComments();
                setOpenModal(true);
              }}
              className="text-2xl cursor-pointer"
            />

            <FiSend className="text-2xl cursor-pointer" />
          </div>

          <FiBookmark className="text-2xl cursor-pointer" />
        </div>

        <p className="px-3 text-sm font-semibold">
          {likesCount.toLocaleString()} likes
        </p>

        <p className="px-3 text-sm mb-1">
          <span className="font-semibold mr-1">{data.username}</span>
          {data.caption}
        </p>

        {commentsCount > 0 && (
          <p
            onClick={async () => {
              await fetchComments();
              setOpenModal(true);
            }}
            className="px-3 text-sm text-gray-500 pb-2 cursor-pointer"
          >
            View all {commentsCount} comments
          </p>
        )}

        <div className="px-3 pb-3 flex items-center gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none p-2"
          />
          <button
            onClick={handleSendComment}
            className="text-blue-500 font-semibold text-sm"
          >
            Post
          </button>
        </div>
      </div>

      {openModal && (
        <CommentsModal
          onClose={() => setOpenModal(false)}
          post={{
            ...data,
            likesCount,
            likedByCurrentUser: liked,
          }}
          comments={comments}
          current={current}
          setCurrent={setCurrent}
        />
      )}
    </>
  );
};

export default PostCard;
