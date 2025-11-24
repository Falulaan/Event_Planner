import Link from "next/link";
import Image from "next/image";


// const navigation = [
   // { name: 'Home', href: '/', current: true },
    // { name: 'Events', href: '/Events', current: false },
    // { name: 'Projects', href: '/Projects', current: false },
    // { name: 'Calendar', href: '/Calendar', current: false },]


import React from 'react'

const NavBar = () => {
    return (
        <header>
            <nav>
                <div className="logo">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                        <p>DevEvent</p>
                    </Link>
                </div>

                <ul className="list-none">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/Events">Events</Link></li>
                    <li><Link href="/CreateEvent">Create Event</Link></li>
                </ul>
            </nav>
        </header>
    )
}
export default NavBar
