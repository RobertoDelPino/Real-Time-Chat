import { useEffect, useState, createContext } from "react";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            const token = localStorage.getItem("token");
            if(!token){
                setIsLoading(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }

            try {
                const { data } = await axiosClient('users/profile', config)
                setAuth(data);
                navigate("/chat");
            } catch (error) {
                setAuth({});
            } finally {
                setIsLoading(false)
            }
        }
        authenticateUser();
    }, [])

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    const getProfilePhoto = async (userId) => {
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            responseType: 'blob'
        }

        try {
            const response = await axiosClient('users/profile-photo/'+ userId, config)
            const imageUrl = URL.createObjectURL(response.data);
            return imageUrl;
        } catch (error) {
            console.log(error)
        }
    }

    const changePhoto = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
                responseType: 'blob'
            }

            await axiosClient.post('/users/upload-avatar', formData, config);
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <AuthContext.Provider
            value={{
                setAuth,
                auth,
                isLoading,
                logout,
                getProfilePhoto,
                changePhoto
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;
