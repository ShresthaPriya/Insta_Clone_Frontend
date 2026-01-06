import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import CustomImage from "./CustomImage";
import CommentsModal from "./CommentsModal";
import api from "../utils/api";
import { BASE_URL } from "../utils/api";
import fallbackImg from "../assets/pi.jpg";


interface Sender {
  id: string;
  userName: string;
  user_profile?: string | null;
}

interface Notification {
  id: string;
  type:
  | "FOLLOW"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPTED"
  | "LIKE"
  | "COMMENT"
  | "REPLY";
  isRead: boolean;
  userId: string;
  postId?: string;
  commentId?: string;
  followRequestId?: string;
  sender?: Sender | null;
  post?: {
    id: string;
    urls?: string[];
    userName?: string;
    user_profile?: string;
  };
  followRequestStatus?: "PENDING" | "ACCEPTED" | "REJECTED";
}


export const Notifications = () => {
  const navigate = useNavigate();
  const myUserId = localStorage.getItem("userId");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hidden, setHidden] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);


  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);


  useEffect(() => {
    const handleNotification = (data: Notification) => {
      if (data.userId !== myUserId) return;
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, [myUserId]);


  const openPostComments = async (postId: string) => {
    try {
      const postRes = await api.get(`/posts/${postId}`);
      const post = postRes.data;

      const normalizedPost = {
        ...post,
        images:
          post.urls?.map((u: string) =>
            u.startsWith("http") ? u : `${BASE_URL}${u}`
          ) ?? [],
        likesCount: post.likesCount ?? 0,
        likedByCurrentUser: post.likedByCurrentUser ?? false,
        user_profile: post.user?.user_profile ?? null,
        username: post.user?.userName ?? "Unknown",
        caption: post.caption ?? "",
        created_at: post.created_at ?? post.createdAt,
      };

      const commentsRes = await api.get(`/posts/${postId}/comments`);
      const normalizedComments = (commentsRes.data.comments || []).map(
        (c: any) => ({
          ...c,
          likesCount: c.likesCount ?? c.likes?.length ?? 0,
          likedByCurrentUser: c.likedByCurrentUser ?? false,
          replies: (c.replies || []).map((r: any) => ({
            ...r,
            likesCount: r.likesCount ?? r.likes?.length ?? 0,
            likedByCurrentUser: r.likedByCurrentUser ?? false,
          })),
        })
      );

      setSelectedPost(normalizedPost);
      setComments(normalizedComments);
      setCurrent(0);
      setOpenModal(true);
    } catch (err) {
      console.error("Failed to open post comments", err);
    }
  };

  const openProfile = (userName: string) => navigate(`/profile/${userName}`);


  const acceptRequest = async (n: Notification) => {
    try {
      if (!n.followRequestId) return;

      const res = await api.post(`/follow/follow-request/${n.followRequestId}/accept`);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === n.id
            ? { ...notif, type: "FOLLOW_ACCEPTED", isRead: true }
            : notif
        )
      );

      console.log("Follow request accepted:", res.data);
    } catch (err: any) {
      console.error("Failed to accept follow request", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to accept follow request");
    }
  };

  const rejectRequest = async (n: Notification) => {
    try {
      if (!n.followRequestId) return;

      await api.delete(`/follow/follow-request/${n.followRequestId}/reject`);

      setNotifications((prev) => prev.filter((notif) => notif.id !== n.id));

      console.log("Follow request rejected");
    } catch (err: any) {
      console.error("Failed to reject follow request", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to reject follow request");
    }
  };





  return (
    <>
      <div className="max-w-xl mx-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {notifications.length > 0 && (
            <button
              onClick={() => setHidden((p) => !p)}
              className="text-sm text-gray-600"
            >
              {hidden ? "View" : "Hide"}
            </button>
          )}
        </div>

        {notifications.length === 0 && (
          <p className="text-gray-500 text-center">No notifications</p>
        )}

        {!hidden &&
          notifications.map((n) => {
            const sender: Sender = n.sender ?? {
              id: "",
              userName: "Unknown",
              user_profile: null,
            };

            return (
              <div
                key={n.id}
                className="flex items-center justify-between gap-3 p-3 rounded-md bg-gray-100"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    if (n.postId) openPostComments(n.postId);
                    else openProfile(sender.userName);
                  }}
                >
                  <CustomImage
                    imgSrc={
                      sender.user_profile
                        ? sender.user_profile.startsWith("http")
                          ? sender.user_profile
                          : `${BASE_URL}/uploads/${sender.user_profile}`
                        : fallbackImg
                    }
                    fallBack={fallbackImg}
                    className="w-10 h-10 rounded-full"
                  />

                  <p className="text-sm">
                    <b>{sender.userName}</b>{" "}
                    {n.type === "LIKE" && "liked your post"}
                    {n.type === "COMMENT" && "commented on your post"}
                    {n.type === "REPLY" && "replied to your comment"}
                    {n.type === "FOLLOW" && "started following you"}
                    {n.type === "FOLLOW_ACCEPTED" &&
                      "accepted your follow request"}
                    {n.type === "FOLLOW_REQUEST" &&
                      "sent you a follow request"}
                  </p>
                </div>

                {n.post && n.post.urls?.[0] && (
                  <img
                    src={
                      n.post.urls[0].startsWith("http")
                        ? n.post.urls[0]
                        : `${BASE_URL}${n.post.urls[0]}`
                    }
                    className="w-10 h-10 object-cover rounded-md"
                    alt="post"
                  />
                )}

                {n.type === "FOLLOW_REQUEST" && n.sender && (
                  <div className="flex gap-2">
                    {n.followRequestId && n.followRequestStatus === "PENDING" && (
                      <>
                        <button onClick={() => acceptRequest(n)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">Accept</button>
                        <button onClick={() => rejectRequest(n)} className="px-3 py-1 text-sm bg-gray-300 rounded-md">Decline</button>
                      </>
                    )}
                    {n.followRequestStatus === "ACCEPTED" && (
                      <button disabled className="px-3 py-1 text-sm bg-green-600 text-white rounded-md cursor-default">Accepted</button>
                    )}
                    {n.followRequestStatus === "REJECTED" && (
                      <button disabled className="px-3 py-1 text-sm bg-red-600 text-white rounded-md cursor-default">Rejected</button>
                    )}
                  </div>
                )}


                {n.type === "FOLLOW_ACCEPTED" && (
                  <p className="text-sm">
                    {/* <b>{sender.userName}</b>  */}
                  </p>
                )}


              </div>
            );
          })}
      </div>

      {openModal && selectedPost && (
        <CommentsModal
          onClose={() => setOpenModal(false)}
          post={selectedPost}
          comments={comments}
          current={current}
          setCurrent={setCurrent}
        />
      )}
    </>
  );
};
