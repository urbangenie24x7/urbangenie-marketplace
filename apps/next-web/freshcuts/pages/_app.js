import { CartProvider } from '../lib/CartContext'
import '../styles/globals.css'
import '../styles/mobile.css'
import '../styles/responsive.css'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}