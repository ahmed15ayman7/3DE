export const metadata = {
  title: 'تسجيل الدخول - 3DE',
  description: 'تسجيل الدخول للمدرسين والطلاب في 3DE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {children}
    </div>
  )
}
