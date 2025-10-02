import { Html, Head, Main, NextScript } from 'next/document';
import { type DocumentProps } from 'next/document';

export default function Document({ locale }: DocumentProps) {
  return (
    <Html lang={locale}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

