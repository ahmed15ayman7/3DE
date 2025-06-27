import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";

export default async function Home() {
    let session = await getSession();
    if ((session?.user as any)?.role === 'INSTRUCTOR') {
        redirect('/instructor/dashboard');
    } else if ((session?.user as any)?.role === 'STUDENT') {
        redirect('/student/dashboard');
    } else if ((session?.user as any)?.role === 'PARENT') {
        redirect('/parent/dashboard');
    } else {
        redirect('/auth/signin');
    }
}