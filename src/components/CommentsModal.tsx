import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FiX,
  FiMessageCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiHeart as FiHeartOutline,
  FiBookmark,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import CustomImage from "./CustomImage";
import fallbackImg from "../assets/pi.jpg";
import SharePost from "../pages/posts/SharePost";
import api from "../utils/api";
import { toast } from "react-toastify";


interface Reply {
  id: string;
  text: string;
  createdAt: string;
  user: {
    userName: string;
    user_profile?: string | null;
  };
  likesCount?: number;
  likedByCurrentUser?: boolean;
}

interface CommentShape {
  id: string;
  text: string;
  createdAt: string;
  user: {
    userName: string;
    user_profile?: string | null;
  };
  replies: Reply[];
  likesCount?: number;
  likedByCurrentUser?: boolean;
}

interface Props {
  onClose: () => void;
  onPostDeleted?: () => void;
  post: any;
  comments: CommentShape[];
  current: number;
  setCurrent: (v: number) => void;
}

const BACKEND_URL = "http://localhost:4000";

const CommentsModal = ({ onClose, post, comments: initialComments, current, setCurrent, onPostDeleted }: Props) => {
  const [comments, setComments] = useState<CommentShape[]>(initialComments || []);
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
  const [commentLikedByMe, setCommentLikedByMe] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [postLiked, setPostLiked] = useState<boolean>(!!post.likedByCurrentUser);
  const [postLikesCount, setPostLikesCount] = useState<number>(post.likesCount ?? 0);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [postState, setPostState] = useState(post);

  useEffect(() => {
    const likes: Record<string, number> = {};
    const liked: Record<string, boolean> = {};
    (initialComments || []).forEach((c) => {
      likes[c.id] = c.likesCount ?? 0;
      liked[c.id] = c.likedByCurrentUser ?? false;
      c.replies.forEach((r) => {
        likes[r.id] = r.likesCount ?? 0;
        liked[r.id] = r.likedByCurrentUser ?? false;
      });
    });
    setCommentLikes(likes);
    setCommentLikedByMe(liked);
  }, [initialComments]);

  const getProfile = (user?: { user_profile?: string | null }) =>
    user?.user_profile
      ? `${BACKEND_URL}/uploads/${user.user_profile}?t=${Date.now()}`
      : postState.user_profile
        ? `${BACKEND_URL}/uploads/${postState.user_profile}?t=${Date.now()}`
        : fallbackImg;

  const fmtTime = (iso?: string) => {
    if (!iso) return "";
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const toggleReplies = (id: string) => setOpenReplies((p) => ({ ...p, [id]: !p[id] }));

  const toggleCommentLike = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post(`/posts/comment/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setCommentLikedByMe((p) => ({ ...p, [id]: res.data.liked }));
      setCommentLikes((p) => ({ ...p, [id]: res.data.likesCount }));
    } catch (err) {
      console.error(err);
    }
  };

  const togglePostLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post(`/posts/${postState.id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPostLiked(res.data.liked);
      setPostLikesCount(res.data.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  const sendComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    try {
      const token = localStorage.getItem("accessToken");
      const url = replyTo
        ? `${BACKEND_URL}/api/v1/posts/reply`
        : `${BACKEND_URL}/api/v1/posts/add`;

      const res = await axios.post(
        url,
        { postId: postState.id, text: trimmed, parentCommentId: replyTo?.commentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = res.data.comment || res.data.reply;

      if (replyTo) {
        setComments((prev) =>
          prev.map((c) => (c.id === replyTo.commentId ? { ...c, replies: [created, ...c.replies] } : c))
        );
      } else {
        setComments((prev) => [created, ...prev]);
      }

      setCommentLikes((prev) => ({ ...prev, [created.id]: created.likesCount ?? 0 }));
      setCommentLikedByMe((prev) => ({ ...prev, [created.id]: created.likedByCurrentUser ?? false }));
      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/posts/${post.id}`);
      toast.success("Post deleted");
      onPostDeleted(); 
      onClose();
    } catch {
      toast.error("Failed to delete post");
    }
  };




  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          <FiX size={26} />
        </button>

        <div className="max-w-6xl w-[95%] h-[560px] flex bg-white rounded-r-md">
          <div className="w-[55%] bg-black relative">
            <img src={postState.images?.[current]} className="w-full h-full object-cover" />
            {current > 0 && (
              <button onClick={() => setCurrent(current - 1)} className="absolute left-4 top-1/2 text-white">
                <FiChevronLeft size={22} />
              </button>
            )}
            {current < postState.images.length - 1 && (
              <button onClick={() => setCurrent(current + 1)} className="absolute right-4 top-1/2 text-white">
                <FiChevronRight size={22} />
              </button>
            )}
          </div>

          <div className="w-[45%] flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {postState.caption && (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <CustomImage
                      imgSrc={getProfile(postState)}
                      fallBack={fallbackImg}
                      className="w-8 h-8 rounded-full object-cover"
                      alt={postState.username || "Unknown"}
                    />
                    <div>
                      <span className="font-semibold">{postState.username || "Unknown"}</span> {postState.caption}
                      <div className="text-xs text-gray-400 mt-1">{fmtTime(postState.created_at || postState.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="text-xl cursor-pointer"
                      onClick={() => setShowPostOptions(true)}
                    >
                      ⋮
                    </span>
                  </div>
                </div>
              )}

              {comments.map((c) => (
                <div key={c.id}>
                  <div className="flex gap-3">
                    <CustomImage
                      imgSrc={getProfile(c.user)}
                      fallBack={fallbackImg}
                      className="w-8 h-8 rounded-full"
                      alt={c.user.userName || "Unknown"}
                    />
                    <div>
                      <span className="font-semibold">{c.user.userName || "Unknown"}</span> {c.text}
                      <div className="flex gap-4 text-xs text-gray-400 mt-1">
                        <span>{fmtTime(c.createdAt)}</span>
                        <button onClick={() => toggleCommentLike(c.id)} className="flex items-center gap-1">
                          {commentLikedByMe[c.id] ? <FaHeart className="text-red-500" /> : <FiHeartOutline />}
                          <span className="text-[12px]">{commentLikes[c.id] ?? 0}</span>
                        </button>
                        <button
                          onClick={() => {
                            setReplyTo({ commentId: c.id, userName: c.user.userName });
                            setNewComment(`@${c.user.userName} `);
                            inputRef.current?.focus();
                          }}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {c.replies.length > 0 && (
                    <div className="ml-11 mt-2">
                      <button onClick={() => toggleReplies(c.id)} className="text-xs text-gray-400">
                        {openReplies[c.id] ? "Hide replies" : `View replies (${c.replies.length})`}
                      </button>

                      {openReplies[c.id] &&
                        c.replies.map((r) => (
                          <div key={r.id} className="flex gap-3 mt-2">
                            <CustomImage
                              imgSrc={getProfile(r.user)}
                              fallBack={fallbackImg}
                              className="w-7 h-7 rounded-full"
                              alt={r.user.userName || "Unknown"}
                            />
                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="font-semibold">{r.user.userName || "Unknown"}</span> {r.text}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                <span>{fmtTime(r.createdAt)}</span>
                                <button onClick={() => toggleCommentLike(r.id)} className="flex items-center gap-1">
                                  {commentLikedByMe[r.id] ? <FaHeart className="text-red-500" /> : <FiHeartOutline />}
                                  <span className="text-[12px]">{commentLikes[r.id] ?? 0}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyTo({ commentId: c.id, userName: r.user.userName });
                                    setNewComment(`@${r.user.userName} `);
                                    inputRef.current?.focus();
                                  }}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-[#DBDBDB] flex items-center justify-between mb-2">
              <div className="flex gap-4">
                <button onClick={togglePostLike}>
                  {postLiked ? <FaHeart className="text-red-500 text-xl" /> : <FiHeartOutline className="text-2xl" />}
                </button>
                <FiMessageCircle className="text-2xl" />
                <FiSend className="text-2xl" />
              </div>
              <FiBookmark className="text-2xl" />
            </div>

            <div className="px-4 py-2 text-sm font-semibold">{postLikesCount.toLocaleString()} likes</div>

            <div className="border-t border-[#DBDBDB] px-4 py-3 flex gap-3">
              <input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? `Replying to @${replyTo.userName}` : "Add a comment..."}
                className="flex-1 outline-none"
              />
              <button onClick={sendComment} className="text-blue-500 font-semibold">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPostOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-[360px] overflow-hidden text-center">
            <button className="w-full py-3 text-red-500 font-semibold border-b" onClick={() => {
              setShowPostOptions(false);
              handleDeletePost();
            }}
            >
              Delete
            </button>
            <button
              className="w-full py-3 border-b"
              onClick={() => {
                setEditingPost(true);
                setShowPostOptions(false);
              }}
            >
              Edit
            </button>
            <button className="w-full py-3" onClick={() => setShowPostOptions(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingPost && (
        <SharePost
          images={postState.imagesFiles || []}
          userId={postState.userId}
          username={postState.username}
          user_profile={postState.user_profile}
          caption={postState.caption}
          editMode={true}
          postId={postState.id}
          onBack={() => setEditingPost(false)}
          onPostCreated={(updatedPost) => {
            setPostState(updatedPost);
          }}
          onClose={() => setEditingPost(false)}
        />
      )}
    </>
  );
};

export default CommentsModal;
