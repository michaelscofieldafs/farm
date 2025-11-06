import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { ThemeProvider } from 'next-themes'
import { DM_Sans } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { Web3Provider } from '@/components/Web3Provider'
import { AppContextProvider } from '../context/appContext';
import { BackgroundBeatiful } from '@/components/LightBackground'

const font = DM_Sans({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <Web3Provider>
          <AppContextProvider>
            <ThemeProvider attribute="class" enableSystem defaultTheme="system">
              <div className="fixed inset-0 z-[9999] pointer-events-none">
                <BackgroundBeatiful
                />
              </div>
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </ThemeProvider>
            <ToastContainer />
          </AppContextProvider>
        </Web3Provider>
        <div id="root"></div>
        <div id="modal" />
      </body>
    </html>
  )
}