import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreatePost from "../pages/posts/CreatePost";
import SearchModal from "../components/SearchModal";
import LogoutModal from "../components/LogoutModal";
import api from "../utils/api";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  const navigate = useNavigate();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    document.body.style.overflow =
      showCreatePost || showSearch || showLogout ? "hidden" : "auto";
  }, [showCreatePost, showSearch, showLogout]);

  const goToProfile = async () => {
    const res = await api.get("/user/me");
    navigate(`/profile/${res.data.userName}`);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch { }
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleSidebarClick = (page: string) => {
    if (page === "home") {
      navigate("/");
    }
    else if (page === "search") {
      setShowSearch(true);
    }
    else if (page === "createPost") {
      setShowCreatePost(true);
    }
    else if (page === "profile") {
      goToProfile();
    }
    else if (page === "logout") {
      setShowLogout(true);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onClick={handleSidebarClick}
        onLogout={() => setShowLogout(true)}
      />

      <main className="flex-1 ml-0 md:ml-64 p-6">
        <Outlet context={{ posts, setPosts }} />
      </main>


      {showCreatePost && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowCreatePost(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <CreatePost
              onPostCreated={(newPost) => {
                setPosts((prev) => [newPost, ...prev]);
                setShowCreatePost(false);
              }}
              onClose={() => setShowCreatePost(false)}
            />
          </div>
        </>
      )}


      {showSearch && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowSearch(false)}
          />
          <SearchModal onClose={() => setShowSearch(false)} />
        </>
      )}


      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default RootLayout;
