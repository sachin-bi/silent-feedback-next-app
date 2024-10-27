'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'




const Navbar = () => {
    // It is Object destructuring with renaming. So data.user would also be fine if not renamed . **catch :but according to next-auth docs like this only we have to write
    const { data: session, status } = useSession()
    console.log('--from navbar.tsx.. data & status::', session, status);

    //ts err - desolved by assertion
    const user: User = session?.user as User




    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">Silent Mystry Message</a>
                {
                    session ? (
                        <>
                            <span className="mr-4">Welcome,{user?.username || user?.email}</span>
                            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'> Logout</Button>
                        </>

                    ) : (
                        <Link href={'sign-in'}>
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>

                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar