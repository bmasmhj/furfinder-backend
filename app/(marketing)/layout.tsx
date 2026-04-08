import Header from "@/components/marketing/Header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
       <> <Header />
        {children}</>
    )
}