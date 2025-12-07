import React, { useState } from "react";
import { FiCopy, FiPlus, FiX, FiChevronRight, FiChevronLeft } from "react-icons/fi";

interface CropPreviewProps {
  images: string[];
  onBack: () => void;
  onNext: () => void;
  onAddMore: (files: FileList) => void;
  onRemove?: (index: number) => void;
}

const ImagePreview: React.FC<CropPreviewProps> = ({
  images,
  onBack,
  onNext,
  onAddMore,
  onRemove,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const visibleImages = images.slice(startIndex, startIndex + 2);

  const handleNext = () => {
    if (startIndex + 2 < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center">
      <div className="flex justify-between items-center bg-black w-[420px] h-20 rounded-t-2xl px-4">
        <button onClick={onBack} className="text-xl text-white">←</button>
        <h2 className="text-white font-semibold">Crop</h2>
        <button onClick={onNext} className="text-blue-500 font-semibold">Next</button>
      </div>

      <div className="bg-[#262626] w-[420px] h-[380px] rounded-b-2xl shadow-xl text-white relative overflow-hidden">
        {images[0] && (
          <img
            src={images[0]}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 rounded-full text-xs text-white">
            Click and drag to reorder
          </div>
        )}

        <button
          onClick={() => setShowPicker((prev) => !prev)}
          className="absolute bottom-4 right-4 bg-black/70 p-3 rounded-full hover:bg-black"
        >
          <FiCopy className="text-white text-xl" />
        </button>

        {showPicker && (
          <div className="absolute bottom-20 right-4 bg-black/80 p-3 rounded-xl w-[230px]">

            <div className="flex items-center justify-center gap-2 relative">
              {startIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute -left-4 bg-white rounded-full p-1 shadow text-black"
                >
                  <FiChevronLeft size={18} />
                </button>
              )}

              {visibleImages.map((img, index) => {
                const realIndex = startIndex + index;
                return (
                  <div
                    key={realIndex}
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-white/20"
                  >
                    <img src={img} className="w-full h-full object-cover" />

                    <button
                      onClick={() => onRemove?.(realIndex)}
                      className="absolute top-1 right-1 bg-black/90 p-1 rounded-full"
                    >
                      <FiX size={14} className="text-white" />
                    </button>
                  </div>
                );
              })}

              <label className="w-14 h-14 flex items-center justify-center border border-white/40 rounded-full cursor-pointer hover:bg-white/10">
                <FiPlus className="text-white text-lg" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    if (images.length + e.target.files.length > 5) {
                      alert("You can select up to 5 photos only.");
                      return;
                    }
                    onAddMore(e.target.files);
                  }}
                />
              </label>

              {startIndex + 2 < images.length && (
                <button
                  onClick={handleNext}
                  className="absolute -right-4 bg-white rounded-full p-1 shadow text-black"
                >
                  <FiChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
