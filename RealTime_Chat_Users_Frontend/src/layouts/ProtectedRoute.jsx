import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const ProtectedRoute = () => {
    const { auth, isLoading } = useAuth();
    if(isLoading) return 'Loading...'
    return (
        <>
            {auth._id ? (
                <div className="bg-gray-100 h-full">
                    <div className="flex min-h-screen h-full">
                        <main className="flex-1">
                            <Outlet/>
                        </main>
                    </div>
                </div>
            ) : <Navigate to="/" />}
        </>
    )
}

export default ProtectedRoute
