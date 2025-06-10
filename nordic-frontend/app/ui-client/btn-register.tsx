'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
const { REGISTER, SIGN_OUT } = require('../templates');
 
export default function BtnRegister() {

    const pathname = usePathname();

    if (pathname.includes("admin"))
    {
        return <Link href='/'>{SIGN_OUT}</Link>
    } else {
        return <Link href='/admin'>{REGISTER}</Link> 
    }          
}