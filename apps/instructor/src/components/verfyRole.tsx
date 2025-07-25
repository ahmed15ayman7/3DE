'use client';
import { useAuth } from "@3de/auth";
import { Button, RouteLoader } from "@3de/ui";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function VerfyRole({ children }: { children: React.ReactNode }) {
  const { user, isLoading,logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user?.role !== "INSTRUCTOR" && !isLoading) {
      logout();
    }
  }, [user, isLoading, logout]);
  if (isLoading) {
    return <RouteLoader showText loadingText="طريق النجاح يبدأ بخطوة... ويستمر بالصبر" size="md" />;
  }

  if (user?.role !== "INSTRUCTOR") {
    return <div className="flex flex-col items-center text-center gap-4 justify-center h-screen">
        <AlertTriangle className="w-40 h-40 text-red-500"/>
        <h1 className="text-2xl font-bold">لا يمكنك الدخول لهذه الصفحة</h1>
        <p className="text-gray-500">ليس لديك صلاحية للدخول لهذه الصفحة</p>
        <div className="flex gap-4">
            <Button onClick={()=>router.push('/')}>الصفحة الرئيسية</Button>
            <Button variant="outline" onClick={()=>router.push('/auth/login')}>تسجيل الدخول بحساب آخر</Button>
        </div>
    </div>;
  }
  return children;
}