import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Story from "../components/Story";
import CreatePost from "./posts/CreatePost";

const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar onClick={(page) => {
        if (page === "createPost") setShowCreatePost(true);
      }} />

      <div className=" flex-1 relative">
        <Story />

        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}
      </div>
    </div>
  );
};

export default Home;
