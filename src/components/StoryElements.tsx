import React, { useState } from "react";
import defaultStoryBorder from "../assets/story-out.png";
import storyBorderAnimation from "../assets/story-out-animation.gif";
import storyBorderPassive from "../assets/story-out-passive.png";

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

  const getBorder = () => {
    if (checkOpen) return storyBorderPassive;
    if (isOpened) return storyBorderAnimation;
    return defaultStoryBorder;
  };

  return (
    <div className="flex flex-col items-center w-[72px]">
      <div className="relative w-[66px] h-[66px]">
        <img
          src={getBorder()}
          alt="border"
          className="absolute inset-0 w-full h-full"
        />
        <img
          src={profilePicture}
          alt="pp"
          onClick={() => setOpened(true)}
          className="absolute inset-[4px] w-[58px] h-[58px] rounded-full object-cover cursor-pointer"
        />
      </div>

      <p className="mt-1 text-xs truncate w-full text-center">
        {children}
      </p>
    </div>
  );
};

export default StoryElement;
