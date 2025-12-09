import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "./FeedPosts";

const PostCard = ({ data }: { data: Post }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [comment, setComment] = useState("");

  const prevImage = () => setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  const nextImage = () =>
    setCurrent((prev) => (prev < data.images.length - 1 ? prev + 1 : prev));

  const multipleImages = data.images.length > 1;

  const handleSendComment = () => {
    if (!comment.trim()) return;
    console.log("Send comment:", comment);
    setComment("");
  };

  const getUploadTime = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
  };

  return (
    <div className=" bg-white w-full max-w-md mx-auto mb-6">
      <div className="flex items-center justify-between px-3 py-2">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${data.user_id}`)}
        >
          <img
            src={data.user_profile || "/default-avatar.png"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">{data.username}</span>
        </div>
        <span className="text-xl font-bold cursor-pointer">⋮</span>
      </div>

      {data.images.length > 0 && (
        <div className="relative w-full max-h-[500px] flex items-center justify-center">
          <img
            src={data.images[current]}
            alt={`post-${current}`}
            className="w-full max-h-[500px] object-cover"
          />

          {multipleImages && current > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          {multipleImages && current < data.images.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
              <FiChevronRight size={24} />
            </button>
          )}

          {multipleImages && (
            <div className="absolute bottom-3 flex gap-2">
              {data.images.map((_, index) => (
                <span
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    index === current ? "bg-white" : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex gap-4">
          <FiHeart className="text-2xl cursor-pointer hover:text-gray-500" />
          <FiMessageCircle className="text-2xl cursor-pointer hover:text-gray-500" />
          <FiSend className="text-2xl cursor-pointer hover:text-gray-500" />
        </div>
        <FiBookmark className="text-2xl cursor-pointer hover:text-gray-500" />
      </div>

      <p className="px-3 text-sm font-semibold">{data.likes.toLocaleString()} likes</p>
      <p className="px-3 text-sm">
        <span className="font-semibold mr-1">{data.username}</span>
        {data.caption}
      </p>

      {data.comments > 0 && (
        <p className="px-3 text-sm text-gray-500 cursor-pointer">
          View all {data.comments} comments
        </p>
      )}

      <div className="px-3 mt-2 flex items-center gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 outline-none px-1 py-1 text-sm"
        />
        <button
          onClick={handleSendComment}
          className="text-blue-500 font-semibold px-2 py-1"
        >
          Send
        </button>
      </div>

      <p className="px-3 py-2 text-xs text-gray-400 uppercase">
        {getUploadTime(data.created_at)}
      </p>
    </div>
  );
};

export default PostCard;
