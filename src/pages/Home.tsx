import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Story from "../components/Story";
import CreatePost from "./posts/CreatePost";
import FeedPosts, { type Post } from "../components/FeedPosts";
import axios from "axios";
import demo from "../assets/pi.jpg";

const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    document.body.style.overflow = showCreatePost ? "hidden" : "auto";
  }, [showCreatePost]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:4000/api/v1/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Feed response:", res.data);

      const postsArray: any[] = Array.isArray(res.data) ? res.data : [];

      const mappedPosts: Post[] = postsArray.map((p: any) => ({
        id: p.id,
        username: p.user?.userName || `User-${p.userId.slice(0, 6)}`,
 images: p.urls?.length
    ? p.urls.map((url: string) => `http://localhost:4000${url}`) 
    : [demo],
        user_id: p.userId,
        user_profile: p.user?.userProfile || [demo],
        created_at: p.createdAt,
        caption: p.caption,
        likes: p.likes ?? 0,
        comments: p.comments ?? 0,
        location: p.location || null,
      }));

      setPosts(mappedPosts);
    } catch (err) {
      console.error("Failed to load feed:", err);
      setPosts([]);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePost(false);
    document.querySelector("#feed-container")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        onClick={(page) => {
          if (page === "createPost") setShowCreatePost(true);
        }}
      />

      <div className="flex-1 flex justify-center relative">
        <div className="w-full max-w-[470px] px-2" id="feed-container">
          <Story />
          <FeedPosts posts={posts} />
        </div>

        {showCreatePost && (
          <>
            <div
              onClick={() => setShowCreatePost(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <CreatePost onPostCreated={handlePostCreated} onClose={() => setShowCreatePost(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

