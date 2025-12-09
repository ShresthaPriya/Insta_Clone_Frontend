
import React, { useState } from "react";
import { FiArrowLeft, FiMapPin, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import axios from "axios";
import demo from "../../assets/pi.jpg";
import type { Post } from "../../components/FeedPosts";

interface SharePostProps {
  images: File[];
  userId: string;
  onBack: () => void;
  onPostCreated: (post: Post) => void;
}

const SharePost: React.FC<SharePostProps> = ({ images, userId, onBack, onPostCreated }) => {
  const [current, setCurrent] = useState(0);
  const [caption, setCaption] = useState("");

  const nextImage = () => current < images.length - 1 && setCurrent(current + 1);
  const prevImage = () => current > 0 && setCurrent(current - 1);

  const handleShare = async () => {
    if (!userId) return alert("User not logged in");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return alert("You must be logged in!");

      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));
      formData.append("caption", caption);
      formData.append("userId", userId);

      const res = await axios.post("http://localhost:4000/api/v1/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${accessToken}` },
      });

      const createdPost = res.data.data;

   const newPost: Post = {
  id: createdPost.id,
  username: createdPost.user?.userName || `User-${createdPost.userId.slice(0, 6)}`,
  images: createdPost.urls?.length ? createdPost.urls.map((url: string) => `http://localhost:4000${url}`) : [demo],
  user_id: createdPost.userId,
  user_profile: createdPost.user?.userProfile || demo,
  created_at: createdPost.createdAt,
  caption: createdPost.caption,
  likes: createdPost.likes ?? 0,
  comments: createdPost.comments ?? 0,
  location: createdPost.location || null,
};


      onPostCreated(newPost);
      onBack();
      alert("Post shared successfully!");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Failed to share post.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] w-[820px] h-[560px] rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 text-white">
          <button onClick={onBack}><FiArrowLeft size={20} /></button>
          <h2 className="font-semibold">Create new post</h2>
          <button onClick={handleShare} className="text-blue-500 font-semibold">Share</button>
        </div>

        <div className="flex flex-1">
          <div className="w-[60%] bg-black relative flex items-center justify-center">
<img
  src={
    images[current] instanceof File
      ? URL.createObjectURL(images[current])
      : images[current] // already a URL
  }
  alt={`Slide ${current + 1}`}
  className="w-full h-full object-cover"
/>
            {current > 0 && <button onClick={prevImage} className="absolute left-4 bg-black/70 rounded-full p-2"><FiChevronLeft size={20} className="text-white" /></button>}
            {current < images.length - 1 && <button onClick={nextImage} className="absolute right-4 bg-black/70 rounded-full p-2"><FiChevronRight size={20} className="text-white" /></button>}
            <div className="absolute bottom-4 flex gap-2 z-10">
              {images.map((_, i) => <div key={i} className={`w-5 h-5 rounded-full ${i === current ? "bg-blue-500" : "bg-gray-500"}`} />)}
            </div>
          </div>

          <div className="w-[40%] bg-[#262626] text-white p-4 flex flex-col">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2000}
              placeholder="Write a caption..."
              className="w-full h-40 resize-none outline-none bg-transparent border-b border-gray-600 text-sm text-white placeholder:text-gray-400"
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

