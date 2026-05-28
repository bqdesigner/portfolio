import './globals.css';
import Header from './_components/Header';
import Footer from './_components/Footer';

export const metadata = {
  title: { default: 'Blog | Bruno Queirós', template: '%s | Bruno Queirós' },
  description: 'Um espaço com os meus pensamentos sobre qualquer coisa e design também.',
  metadataBase: new URL('https://portifolio-with-ia.vercel.app'),
  openGraph: {
    siteName: 'Bruno Queirós',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var qt=new URLSearchParams(location.search).get('theme');if(qt==='light'||qt==='dark'){localStorage.setItem('theme',qt);var u=new URL(location.href);u.searchParams.delete('theme');history.replaceState(null,'',u.pathname+(u.search||'')+u.hash);}var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
