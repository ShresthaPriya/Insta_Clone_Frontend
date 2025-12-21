import StoryElement from "./StoryElements";
import demoPic from "../assets/pi.jpg";

const Story = () => {
  return (
    <div className="mb-6 md:px-4">
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
