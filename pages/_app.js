// pages/_app.js
import "@/styles/globals.css"; // นำเข้า global CSS

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
