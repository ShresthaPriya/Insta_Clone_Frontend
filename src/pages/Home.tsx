import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Story from "../components/Story";
import FeedPosts from "../components/FeedPosts";
import Suggestions from "../components/Suggestions";
import api from "../utils/api";
import demo from "../assets/pi.jpg";

const Home = () => {
  const { posts, setPosts } = useOutletContext<any>();
  const currentUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get("/posts/feed");
      const mapped = res.data.map((p: any) => ({
        id: p.id,
        username: p.user?.userName,
        images: p.urls?.length
          ? p.urls.map((u: string) => `http://localhost:4000${u}`)
          : [demo],
        user_id: p.userId,
        user_profile: p.user?.user_profile || demo,
        created_at: p.createdAt,
        caption: p.caption,
        likesCount: p.likesCount ?? 0,
        commentsCount: p.commentsCount ?? 0,
        likedByCurrentUser:
          p.likes?.some((l: any) => l.userId === currentUserId) ?? false,
      }));
      setPosts(mapped);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex justify-around gap-4">
      <div className="w-full max-w-[600px] mt-6">
        <Story />
        <FeedPosts posts={posts} currentUserId={currentUserId} />
      </div>
      <Suggestions />
    </div>
  );
};

export default Home;
