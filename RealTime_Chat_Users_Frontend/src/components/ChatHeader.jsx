/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import defaultAvatar from "../assets/defaultAvatar.jpg"

const ChatHeader = (props) => {
    const { user, getProfilePhoto } = props;
    const [avatar, setAvatar] = useState(defaultAvatar);

    useEffect(() => {
        const fetchPhoto = async () => {
          const photo = await getProfilePhoto(user._id);
          setAvatar(photo);
        };
    
        fetchPhoto();
    }, [getProfilePhoto, user]);

    
    return (
        <div className="flex items-center p-4 bg-gray-200">
            <img src={avatar} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
            <h2 className="text-xl font-bold">{user.name}</h2>
        </div>
    );
};

export default ChatHeader;