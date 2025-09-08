import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#16A34A" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#EF4444" media="(prefers-color-scheme: dark)" />
      </Head>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
