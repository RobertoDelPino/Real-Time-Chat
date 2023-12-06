/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import defaultAvatar from "../assets/defaultAvatar.jpg"

const UserPhoto = ({ user, getProfilePhoto }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);

  useEffect(() => {
    const fetchPhoto = async () => {
      const photo = await getProfilePhoto(user._id);
      setAvatar(photo);
    };

    fetchPhoto();
  }, [user, getProfilePhoto]);

  return avatar && <img className='w-12 h-12 rounded-full object-cover bg-slate-600' src={avatar} alt="Foto de perfil" />
};

export default UserPhoto