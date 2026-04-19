import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MyChannelRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.username) {
      navigate(`/channel/${user.username}`, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to your channel...</p>
      </div>
    </div>
  );
};

export { MyChannelRedirect };
export default MyChannelRedirect;
