import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiChevronRight,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import api from "../../utils/api";
import { BASE_URL } from "../../utils/api";
import CustomImage from "../../components/CustomImage";
import type { Post } from "../../components/FeedPosts";
import { toast } from "react-toastify";

interface SharePostProps {
  images: File[];
  imageUrls?: string[];
  userId: string;
  username: string;
  user_profile?: string | null;
  onClose: () => void;
  onBack: () => void;
  onPostCreated: (post: Post) => void;
  editMode?: boolean;
  caption?: string;
  postId?: string;
}


const SharePost: React.FC<SharePostProps> = ({
  images,
  imageUrls = [],
  username,
  user_profile,
  onBack,
  onPostCreated,
  onClose,
  editMode = false,
  caption: initialCaption = "",
  postId,
}) => {
  const [current, setCurrent] = useState(0);
  const [caption, setCaption] = useState(initialCaption);
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();

  const displayImages = images.length > 0 ? images : imageUrls;

  const nextImage = () => {
    if (current < displayImages.length - 1) {
      setCurrent((p) => p + 1);
    }
  };

  const prevImage = () => {
    if (current > 0) {
      setCurrent((p) => p - 1);
    }
  };

  useEffect(() => {
    setCurrent(0);
  }, [editMode, imageUrls]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You must be logged in");
      navigate("/login");
    }
  }, [navigate]);

  const handleShare = async () => {
    try {
      setIsSharing(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must be logged in");
        navigate("/login");
        return;
      }

      let url = "";
      let method: "post" | "put" = "post";
      let data: any = null;

      const headers: any = {
        Authorization: `Bearer ${token}`,
      };

      //edit
      if (editMode) {
        if (!postId) {
          toast.error("Invalid post ID");
          return;
        }

        url = `/posts/${postId}`;
        method = "put";
        data = { caption };
        headers["Content-Type"] = "application/json";
      }

//create
      else {
        if (images.length === 0) {
          toast.error("Please select at least one image");
          return;
        }

        url = "/posts/create";
        method = "post";

        const formData = new FormData();
        formData.append("caption", caption);
        images.forEach((file) => formData.append("images", file));

        data = formData;
      }

      const res = await api({
        method,
        url,
        data,
        headers,
      });

      const createdPost = res.data?.post || res.data?.data || res.data;

      const newPost: Post = {
        id: createdPost.id || createdPost._id,
        username: createdPost.user?.userName || username,
        images:
          createdPost.urls?.length > 0
            ? createdPost.urls.map((u: string) => `${BASE_URL}${u}`)
            : imageUrls,
        user_id: createdPost.userId,
        user_profile: createdPost.user?.user_profile || user_profile,
        created_at: createdPost.createdAt || new Date().toISOString(),
        caption: createdPost.caption || caption,
        likesCount: createdPost.likesCount ?? 0,
        commentsCount: createdPost.commentsCount ?? 0,
        likedByCurrentUser: createdPost.likedByCurrentUser ?? false,
      };

      onPostCreated(newPost);
      toast.success(editMode ? "Post updated!" : "Post shared successfully!");
      onClose();
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Session expired");
        localStorage.removeItem("accessToken");
        navigate("/login");
      } else {
        toast.error(editMode ? "Failed to update post" : "Failed to share post");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <FiX size={32} />
      </button>

      <div className="relative bg-[#fafafa] w-[420px] md:w-[820px] rounded-xl overflow-hidden flex flex-col">
        {isSharing && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-black mt-4 text-sm">
              {editMode ? "Updating..." : "Sharing..."}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <button onClick={onBack}>
            <FiArrowLeft size={20} />
          </button>

          <h2 className="font-semibold">
            {editMode ? "Edit post" : "Create new post"}
          </h2>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className={`font-semibold ${
              isSharing ? "text-gray-400" : "text-blue-500"
            }`}
          >
            {editMode ? "Update" : "Share"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          <div className="relative w-full md:w-[60%] h-[250px] md:h-[500px]">
            {displayImages.length > 0 && (
              <img
                src={
                  images.length > 0
                    ? URL.createObjectURL(displayImages[current] as File)
                    : (displayImages[current] as string)
                }
                className="w-full h-full object-cover"
                alt="Post"
              />
            )}

            {current > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
              >
                <FiChevronLeft />
              </button>
            )}

            {current < displayImages.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
              >
                <FiChevronRight />
              </button>
            )}
          </div>

          <div className="w-full md:w-[40%] p-4">
            <div className="flex items-center gap-3 mb-4">
              <CustomImage
                imgSrc={
                  user_profile
                    ? user_profile.startsWith("http")
                      ? user_profile
                      : `${BASE_URL}/uploads/${user_profile}`
                    : undefined
                }
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold text-sm">{username}</span>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full h-28 resize-none border-b outline-none bg-transparent text-sm"
            />

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
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
