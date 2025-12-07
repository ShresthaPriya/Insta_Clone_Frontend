import React, { useState } from "react";
import {
  FiArrowLeft,
  FiSmile,
  FiMapPin,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import demoPic from "../../assets/pi.jpg";
import Picker, { type EmojiClickData } from "emoji-picker-react";

interface SharePostProps {
  images: string[];
  onBack: () => void;
}

const SharePost: React.FC<SharePostProps> = ({ images, onBack }) => {
  const [current, setCurrent] = useState(0);
  const [caption, setCaption] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const nextImage = () => {
    if (current < images.length - 1) setCurrent(current + 1);
  };

  const prevImage = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] w-[820px] h-[560px] rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 text-white">
          <button onClick={onBack}>
            <FiArrowLeft size={20} />
          </button>
          <h2 className="font-semibold">Create new post</h2>
          <button className="text-blue-500 font-semibold">Share</button>
        </div>

        <div className="flex flex-1">
          <div className="w-[60%] bg-black relative flex items-center justify-center">
            <img
              src={images[current]}
              alt={`Slide ${current + 1}`}
              className="w-full h-full object-cover"
            />

            {current > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 bg-black/70 rounded-full p-2"
              >
                <FiChevronLeft size={20} className="text-white" />
              </button>
            )}

            {current < images.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 bg-black/70 rounded-full p-2"
              >
                <FiChevronRight size={20} className="text-white" />
              </button>
            )}

            <div className="absolute bottom-4 flex gap-2 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full ${
                    i === current ? "bg-blue-500" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-[40%] bg-[#262626] text-white p-4 flex flex-col relative">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={demoPic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold text-sm">skinsecretsbypriya</p>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2000}
              placeholder="Write a caption..."
              className="w-full h-40 resize-none outline-none bg-transparent border-b border-gray-600 text-sm text-white placeholder:text-gray-400"
            />

            <div className="flex justify-between items-center text-gray-400 text-sm mt-2">
              <FiSmile
                onClick={() => setShowEmoji(!showEmoji)}
                className="cursor-pointer"
              />
              <span>{caption.length}/2,000</span>
            </div>

            {showEmoji && (
              <div className="absolute bottom-[100px] z-20">
                <Picker
                  onEmojiClick={(emoji: EmojiClickData) => {
                    setCaption((prev) => prev + emoji.emoji);
                    setShowEmoji(false);
                  }}
                />
              </div>
            )}

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
