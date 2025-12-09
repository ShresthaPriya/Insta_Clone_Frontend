import PostCard from "./PostCard";

export interface Post {
  id: string;
  username: string;
  images: string[];
  user_id: string;
  user_profile?: string | null;
  created_at: string;
  caption: string;
  likes: number;
  comments: number;
  location?: string | null;
}

interface PostListProps {
  posts: Post[];
}

const FeedPosts = ({ posts = [] }: PostListProps) => {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {posts.map((post) => (post ? <PostCard key={post.id} data={post} /> : null))}
    </div>
  );
};

export default FeedPosts;
