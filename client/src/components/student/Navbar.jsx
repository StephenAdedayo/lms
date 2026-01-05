import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {

    const location = useLocation()
    const isCourseListPage = location.pathname.includes("course-list")
    const {navigate, isEducator} = useAppContext()

    const {user} = useUser()
    const {openSignIn} = useClerk()

  return (
    <div className={`flex justify-between items-center px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? "bg-white" : "bg-cyan-100/70" }`}>
         
          <img onClick={() => navigate("/")} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer'/>

{/*  large screens */}
          <div className='hidden md:flex items-center gap-5 text-gray-500'>
               {user &&  (
                 <div className='flex items-center gap-5 '>

                <button className='cursor-pointer' onClick={() => navigate("/educator")}>{isEducator ? "Educator Dashboard" : "Become an Educator"}</button>
                 |
                <Link to={"/my-enrollments"}>My Enrollments</Link>
                </div>)

                }



       {user ? <UserButton>
        <UserButton.MenuItems>
            <UserButton.Action label='' labelIcon={""}/>
        </UserButton.MenuItems>
       </UserButton> : (
           <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full cursor-pointer'>Create Account</button>
       )}
              
          </div>

{/* smaller screens */}
          <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
               <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs '>

                {user &&  (
                 <div className='flex items-center gap-5 '>

<button onClick={() => navigate("/educator")}>{isEducator ? "Educator Dashboard" : "Become an Educator"}</button>                 |
                <Link to={"/my-enrollments"}>My Enrollments</Link>
                </div>)

                }
               </div>
               {user ? <UserButton /> : <button onClick={openSignIn}><img src={assets.user_icon} alt="" /></button>
 }
          </div>
    </div>
  )
}

export default Navbar
