/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import defaultAvatar from "../assets/defaultAvatar.jpg"

const PersonalUserPhoto = ({ user, getProfilePhoto, changePhoto }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const fileInput = useRef();

  useEffect(() => {
    const fetchPhoto = async () => {
      const photo = await getProfilePhoto(user._id);
      setAvatar(photo);
    };

    fetchPhoto();
  }, [user, getProfilePhoto]);

  const changePhotoHandler = async (e) => {
    await changePhoto(e.target.files[0])
    const photo = await getProfilePhoto(user._id);
    setAvatar(photo); 
  }

  const handleDivClick = () => {
    fileInput.current.click();
  };

  return (
    <div className='my-3 flex justify-center'>
      <div>
        {avatar && <img onClick={handleDivClick}className='ml-4 w-12 h-12 rounded-full object-cover hover:bg-black hover:opacity-70 hover:cursor-pointer' src={avatar} alt="Foto de perfil" />}
      </div>
      <input type='file' ref={fileInput} onChange={changePhotoHandler} style={{ display: 'none' }} />
    </div>
    

  );
};

export default PersonalUserPhoto;