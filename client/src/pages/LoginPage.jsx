// LoginPage.jsx - Updated with One Piece theme
import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContex } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const {login} = useContext(AuthContex)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return
    }
    
   login({
    state: currState === "Sign up" ? "signup" : "login",
    credentials: { fullName, email, password, bio }
   });
 }

  return (
    <div className='min-h-screen bg-[url("./src/assets/luffy_bg.jpg")] bg-cover bg-center bg-fixed flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4'>

  {/* Logo & Heading */}
  <div className="text-center">
    <img src={assets.logo_big} alt="Logo" className='w-[min(300px,80vw)] mb-4 drop-shadow-lg' />
    <h1 className="text-4xl font-bold text-yellow-400 text-shadow-lg font-[Comic Sans MS]">Straw Hat Chat</h1>
    <p className="text-white text-lg mt-2 font-[Comic Sans MS] drop-shadow-md">Set Sail for Adventure!</p>
  </div>

  {/* Form */}
  <form 
    onSubmit={onSubmitHandler}
    className='bg-black/25 backdrop-blur-md border-2 border-yellow-400 p-8 flex flex-col gap-6 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.5)] w-full max-w-md'
  >
    
    <h2 className='font-bold text-2xl flex justify-between items-center text-yellow-300 font-[Comic Sans MS]'>
      {currState === "Sign up" ? "Join the Crew!" : "Welcome Back!"}
      <img 
        src={assets.arrow_icon} 
        alt="Toggle" 
        className='w-6 cursor-pointer transform hover:scale-110 transition-transform'
        onClick={() => setCurrState(currState === "Sign up" ? "Login" : "Sign up")}
      />
    </h2>

    {/* Name Input */}
    {currState === "Sign up" && !isDataSubmitted && (
      <input 
        onChange={(e)=>setFullName(e.target.value)}
        value={fullName}
        type="text" 
        className='p-3 border-2 border-yellow-400 rounded-lg bg-black/20 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-300 outline-none transition-all' 
        placeholder='Pirate Name' 
        required
      />
    )}

    {/* Email & Password */}
    {!isDataSubmitted && (
      <>
       <input 
         onChange={(e)=>setEmail(e.target.value)} 
         value={email}  
         type="email" 
         placeholder='Message Bird Address' 
         required 
         className='p-3 border-2 border-yellow-300 rounded-lg bg-black/20 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-300 outline-none transition-all'
       />
       <input 
         onChange={(e)=>setPassword(e.target.value)} 
         value={password}
         type='password' 
         placeholder='Secret Code' 
         required 
         className='p-3 border-2 border-yellow-300 rounded-lg bg-black/20 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-300 outline-none transition-all'
       />
      </>
    )}

    {/* Bio */}
    {currState === "Sign up" && isDataSubmitted && (
      <textarea 
        onChange={(e)=>setBio(e.target.value)}
        value={bio}
        rows={4} 
        className='p-3 border-2 border-yellow-300 rounded-lg bg-black/20 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-300 outline-none transition-all'
        placeholder='Tell us your pirate story...' 
        required
      ></textarea>
    )}

    {/* Submit Button */}
    <button className='py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-yellow-300 font-bold rounded-lg cursor-pointer border-2 border-yellow-400 transform hover:scale-105 transition-all font-[Comic Sans MS] text-lg shadow-md'>
      {currState === "Sign up" ? "Join the Crew!" : "Set Sail!"}
    </button>

    {/* Terms */}
    <div className="flex items-center gap-2 text-sm text-white/90">
      <input type="checkbox" required className="w-4 h-4 accent-yellow-400" />
      <p>Agree to pirate code & treasure maps policy</p>
    </div>

    {/* Toggle Sign Up / Login */}
    <div className='flex flex-col gap-2 text-center'>
      {currState === "Sign up" ? (
        <p className='text-sm text-yellow-100'>
          Already part of the crew? 
          <span
            onClick={() => { setCurrState("Login") }}
            className='font-bold text-yellow-300 cursor-pointer ml-1 hover:underline'
          >
            Login here
          </span>
        </p>
      ) : (
        <p className='text-sm text-yellow-100'>
          New to the Grand Line? 
          <span
            className='font-bold text-yellow-300 cursor-pointer ml-1 hover:underline'
            onClick={() => { setCurrState("Sign up") }}
          >
            Join the adventure!
          </span>
        </p>
      )}
    </div>
  </form>
</div>

  )
}

export default LoginPage