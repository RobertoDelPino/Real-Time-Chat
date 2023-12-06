import useAuth from "../hooks/useAuth"
import useChat from "../hooks/useChat";

const Logout = () => {
  const { logout } = useAuth();
  const { restartAll } = useChat();

  const handleLogout = () => {
    logout();
    restartAll();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <button 
        className="my-3 p-3 mr-4 border border-black hover:bg-slate-700 hover:text-white" 
        onClick={handleLogout}
    >
        Logout
    </button>
  );
};

export default Logout;
