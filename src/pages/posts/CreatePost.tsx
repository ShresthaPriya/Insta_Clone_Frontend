import React, { useRef, useState } from "react";
import { FiImage, FiPlay, FiX } from "react-icons/fi";
import CropPreview from "./ImagePreview";
import SharePost from "./SharePost";


interface CreatePostProps {
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState<"select" | "crop"|"share">("select");

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length > 5) {
      alert("You can only select up to 5 photos.");
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
    setStep("crop");
  };

  const handleAddMore = (files: FileList) => {
    const fileArr = Array.from(files);
    const newUrls = fileArr.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls].slice(0, 5));
  };

  if (step === "crop") {
    return (
      <CropPreview
        images={images}
        onBack={() => setStep("select")}
        onNext={() => setStep("share")}
        onAddMore={handleAddMore}
      />
    );
  }
if (step === "share") {
  return (
    <SharePost
      images={images}
      onBack={() => setStep("crop")}
    />
  );
}
  return (
   <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <FiX size={32} />
      </button>
      <div className="flex justify-center items-center bg-black w-[420px] h-20 rounded-t-2xl  ">
        <h2 className="text-lg font-sans font-semibold inset-10 text-white">
          Create new post
        </h2>
      </div>

      <div className="bg-[#262626] w-[420px] h-[380px] border-t border-white-500 rounded-b-2xl shadow-xl flex flex-col items-center justify-center text-white relative">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FiImage size={48} className="text-white" />
          <FiPlay size={48} className="text-white" />
        </div>
        <p className="font-sans text-[20px] leading-[25px] tracking-[-0.2px] text-white mb-6">
          Drag photos and videos here
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleSelectClick}
          className="bg-[#4A5DF9] hover:bg-[#1877F2] transition text-white font-semibold px-6 py-2 rounded-lg"
        >
          Select from computer
        </button>
      </div>
    </div>
  )
};

export default CreatePost;
