import React, { useState } from "react";

interface Props {
  profilePicture: string;
  children: string;
  checkOpen?: boolean;
}

const StoryElement: React.FC<Props> = ({
  profilePicture,
  children,
  checkOpen,
}) => {
  const [isOpened, setOpened] = useState(false);

  const isSeen = checkOpen || isOpened;

  return (
    <div className="flex flex-col items-center w-[72px] shrink-0">
      <div
        onClick={() => setOpened(true)}
        className={`w-[62px] h-[62px] aspect-square p-0.5
          rounded-full cursor-pointer
          ${
            isSeen
              ? "bg-gray-300"
              : "bg-linear-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]"
          }`}
      >
        <div className="w-full h-full bg-white p-0.5 rounded-full aspect-square">
          <img
            src={profilePicture}
            alt="story"
            className="w-full h-full rounded-full object-cover aspect-square"
          />
        </div>
      </div>


      <p className="mt-1 text-xs truncate w-full text-center">
        {children}
      </p>
    </div>
  );
};

export default StoryElement;
