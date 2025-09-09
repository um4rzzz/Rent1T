import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="bg-[var(--bg)]">
      <Head>
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0B0B0C" media="(prefers-color-scheme: dark)" />
      </Head>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
