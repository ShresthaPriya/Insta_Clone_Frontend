import StoryElement from "./StoryElements";
import demoPic from "../assets/pi.jpg";

const Story = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
      
      <div className="flex gap-4 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <StoryElement
            key={i}
            profilePicture={demoPic}
            checkOpen={i === 7}
          >
            Priya
          </StoryElement>
        ))}
      </div>

    </div>
  );
};

export default Story;
