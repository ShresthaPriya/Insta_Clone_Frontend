import React, { useState } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiChevronRight,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import axios from "axios";
import CustomImage from "../../components/CustomImage";
import type { Post } from "../../components/FeedPosts";
import { toast } from "react-toastify";

interface SharePostProps {
  images: File[];
  userId: string;
  username: string;
  user_profile?: string | null;
  onClose: () => void;
  onBack: () => void;
  onPostCreated: (post: Post) => void;
}

const BACKEND_URL = "http://localhost:4000";

const SharePost: React.FC<SharePostProps> = ({
  images,
  userId,
  username,
  user_profile,
  onBack,
  onPostCreated,
  onClose,
}) => {
  const [current, setCurrent] = useState(0);
  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const nextImage = () =>
    current < images.length - 1 && setCurrent(current + 1);
  const prevImage = () => current > 0 && setCurrent(current - 1);

  const handleShare = async () => {
    if (!userId) return toast.error("User not logged in");
    try {
      setIsSharing(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("You must be logged in");

      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));
      formData.append("caption", caption);

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/posts/create`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdPost = res.data?.post || res.data?.data || res.data;

      const newPost: Post = {
        id: createdPost.id || createdPost._id,
        username: createdPost.user?.username || username,
        images: createdPost.urls?.length
          ? createdPost.urls.map((url: string) => `${BACKEND_URL}${url}`)
          : [],
        user_id: createdPost.userId,
        user_profile: createdPost.user?.userProfile || user_profile,
        created_at: createdPost.createdAt || new Date().toISOString(),
        caption: createdPost.caption || "",
        likesCount: 0,
        commentsCount: 0,
        likedByCurrentUser: false,
      };

      onPostCreated(newPost);
      toast.success("Post shared successfully!");
      onBack();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to share post");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
        <FiX size={32} />
      </button>

      <div className="relative bg-[#fafafa] w-[420px] rounded-xl overflow-hidden flex flex-col md:w-[820px]">
        {isSharing && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-100">
            <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-black mt-4 text-sm">Sharing</p>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 text-black">
          <button onClick={onBack}>
            <FiArrowLeft size={20} />
          </button>
          <h2 className="font-semibold">Create new post</h2>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className={`font-semibold ${isSharing ? "text-black-500" : "text-blue-500"}`}
          >
            {isSharing ? "Sharing..." : "Share"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          <div className="w-full h-[250px] bg-white relative flex items-center justify-center md:w-[60%] md:h-[500px]">
            <img
              src={URL.createObjectURL(images[current])}
              alt={`Slide ${current + 1}`}
              className="w-full h-full object-cover"
            />
            {current > 0 && (
              <button onClick={prevImage} className="absolute left-4 bg-white/70 rounded-full p-2">
                <FiChevronLeft size={20} className="text-black" />
              </button>
            )}
            {current < images.length - 1 && (
              <button onClick={nextImage} className="absolute right-4 bg-white/70 rounded-full p-2">
                <FiChevronRight size={20} className="text-black" />
              </button>
            )}
          </div>

          <div className="w-full bg-[#fafafa] text-black p-4 flex flex-col md:w-[40%]">
            <div className="flex items-center gap-3 mb-4">
              <CustomImage
                imgSrc={
                  user_profile
                    ? `${BACKEND_URL}/uploads/${user_profile}?t=${Date.now()}`
                    : undefined
                }
                fallBack={undefined}
                className="w-8 h-8 rounded-full object-cover"
                alt={username}
              />

              <span className="text-sm font-semibold">{username}</span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2000}
              placeholder="Write a caption..."
              className="w-full h-20 resize-none bg-transparent border-b border-gray-600 outline-none text-sm placeholder:text-gray-400 md:h-40"
            />

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-300 cursor-pointer">
              <FiMapPin />
              <span>Add location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePost;
