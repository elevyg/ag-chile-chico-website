import Navbar from "~/components/Navbar";
import RootLayout from "~/pages/RootLayout";
import { $generateHtmlFromNodes } from "@lexical/html";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "~/../next-i18next.config.mjs";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { LexicalEditor } from "lexical";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "es",
      "en",
    ])),
  },
});

const Editor = dynamic(() => import("~/components/TextEditor"), { ssr: false });

const NewArticle = () => {
  const [editor, setLexicalState] = useState<LexicalEditor | null>(null);

  const onSave = () => {
    if (editor) {
      editor.update(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        console.log("htmlString", htmlString);
      });
    }
  };
  return (
    <>
      <RootLayout>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-slate-500 to-slate-950 pt-[80px] text-white ">
          <div className="flex min-h-screen flex-1 flex-col p-10">
            <h1>Crea un artículo nuevo</h1>
            <button onClick={onSave}>Guardar</button>
            <div className="">
              <Editor
                placeholder="Escribe aquí tu artículo"
                onChange={(state, le) => {
                  setLexicalState(le ?? null);
                }}
              />
            </div>
          </div>
        </div>
      </RootLayout>
    </>
  );
};

export default NewArticle;
