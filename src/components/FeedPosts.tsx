import PostCard from "./PostCard";

export interface Post {
  id: string;
  username: string;
  images: string[];
  user_id: string;
  user_profile?: string | null;
  created_at: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
}

interface PostListProps {
  posts: Post[];
  currentUserId: string;
}

const FeedPosts = ({ posts = [], currentUserId }: PostListProps) => {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          data={post}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default FeedPosts;
