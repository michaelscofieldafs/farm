import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { Web3Provider } from '@/components/Web3Provider'
import { AppContextProvider } from '../context/appContext';
import { BackgroundBeatiful } from '@/components/LightBackground'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Web3Provider>
          <AppContextProvider>
            <div className="fixed inset-0 z-[9999] pointer-events-none">
              <BackgroundBeatiful
              />
            </div>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
            <ToastContainer />
          </AppContextProvider>
        </Web3Provider>
        <div id="root"></div>
        <div id="modal" />
      </body>
    </html>
  )
}