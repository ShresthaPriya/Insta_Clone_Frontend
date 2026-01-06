import React, { useRef, useState } from "react";
import { FiImage, FiPlay, FiX } from "react-icons/fi";
import CropPreview from "./ImagePreview";
import SharePost from "./SharePost";
import type { Post } from "../../components/FeedPosts";

const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, username: payload.username };
  } catch {
    return null;
  }
};

interface CreatePostProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onPostCreated }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [step, setStep] = useState<"select" | "crop" | "share">("select");

  const user = getUserFromToken();
  const userId = user?.id;
  const username = user?.username;

  const handleSelectClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    if (selectedFiles.length + files.length > 5) {
      alert("You can only select up to 5 photos.");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
    const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls].slice(0, 5));
    setStep("crop");
  };

  const handleAddMore = (newFiles: FileList) => {
    const fileArr = Array.from(newFiles).slice(0, 5 - files.length);
    setFiles((prev) => [...prev, ...fileArr]);
    const newUrls = fileArr.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  if (step === "crop") {
    return (
      <CropPreview
        images={previewUrls}
        onBack={() => setStep("select")}
        onNext={() => setStep("share")}
        onAddMore={handleAddMore}
        onRemove={handleRemove}
        onClose={onClose} 
      />
    );
  }

  if (step === "share") {
    if (!userId) return <p className="text-white">You must be logged in to share a post.</p>;
    return (
      <SharePost
        images={files}
        userId={userId}
        username={username || `User-${userId.slice(0, 6)}`}
        onBack={() => setStep("crop")}
        onPostCreated={onPostCreated}
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
        <FiX size={32} />
      </button>
      <div className="flex justify-center items-center bg-white w-[420px] h-20 rounded-t-2xl">
        <h2 className="text-lg font-semibold text-black">Create new post</h2>
      </div>
      <div className="bg-[#fafafa] w-[420px] h-[380px] border-t border-black/50 rounded-b-2xl shadow-xl flex flex-col items-center justify-center text-white relative">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FiImage size={48} className="text-black" />
          <FiPlay size={48} className="text-black" />
        </div>
        <p className="text-[20px] mb-6">Drag photos and videos here</p>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" multiple />
        <button onClick={handleSelectClick} className="bg-[#4A5DF9] hover:bg-[#1877F2] transition text-white font-semibold px-6 py-2 rounded-lg">
          Select from computer
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
