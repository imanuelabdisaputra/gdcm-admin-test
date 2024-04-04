import "../globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative flex flex-col flex-1 h-screen">
      <section className="flex items-center justify-center flex-1 p-4 sm:container sm:py-6">
        {children}
      </section>
    </main>
  )
}
