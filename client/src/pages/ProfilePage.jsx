// ProfilePage.jsx - Updated with One Piece theme
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useContext } from 'react';
import { AuthContex } from '../../context/AuthContext';

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContex);
  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!selectedImg){
      await updateProfile({fullName: name, bio})
      navigate('/')
      return
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=> {
      const base64Image = reader.result;
      await updateProfile ({profilePic:base64Image, fullName: name, bio})
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen bg-[url('/wanted.jpg')] bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[rgba(80, 5, 161, 0.95)] text-yellow-400 border-4 border-red-500 flex items-center justify-between max-sm:flex-col-reverse rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.5)]">
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 flex-1">
          <h3 className="text-2xl font-bold font-[Comic Sans MS]">Edit Your Wanted Poster</h3>

          {/* Avatar Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer group">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <div className="relative">
              <img
                src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
                className={`w-16 h-16 ${selectedImg ? 'rounded-full border-2 border-yellow-400' : ''} group-hover:scale-110 transition-transform`}
                alt="Profile Avatar"
              />
              <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                EDIT
              </div>
            </div>
            <span className="text-sm text-gray-300 group-hover:text-yellow-400">Change Wanted Photo</span>
          </label>

          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-lg border-2 border-blue-500 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            placeholder="Pirate Name"
          />

          {/* Bio Input */}
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-3 rounded-lg border-2 border-green-500 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            placeholder="Your pirate story and dreams..."
          />

          <button
            type="submit"
            className="py-3 px-6 bg-red-600 hover:bg-red-700 text-yellow-400 font-bold rounded-lg border-2 border-yellow-400 transform hover:scale-105 transition-all font-[Comic Sans MS] text-lg"
          >
            Update Poster
          </button>
        </form>

        {/* Current Profile Image */}
        <div className="p-6 text-center">
          <div className="relative inline-block">
            <img 
              className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover" 
              src={authUser?.profilePic || assets.logo_icon} 
              alt="Current Wanted Poster" 
            />
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold rotate-12">
              WANTED
            </div>
          </div>
          <p className="mt-3 text-white font-[Comic Sans MS]">Current Poster</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage