import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";
import type { LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";

const Editor = dynamic(() => import("~/components/TextEditor"), { ssr: false });

const Editar = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<"es" | "en">("es");

  const article = api.getArticle.useQuery(
    {
      slug: (router.query.articleSlug as string) ?? "",
      locale,
    },
    { enabled: !!router.query.articleSlug },
  );
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
    <ProtectedAdminLayout>
      <div className="p-5">
        <div className="flex gap-4">
          <button
            className="rounded-lg bg-blue-600 p-1 px-4 text-white hover:bg-blue-950"
            onClick={onSave}
          >
            Guardar
          </button>
          <button
            className={`${
              locale === "es" ? "font-bold" : "font-light"
            } hover:text-blue-600`}
            onClick={() => {
              setLocale("es");
            }}
          >
            Español
          </button>
          <button
            className={`${
              locale === "en" ? "font-bold" : "font-light"
            } hover:text-blue-600`}
            onClick={() => {
              setLocale("en");
            }}
          >
            Ingles
          </button>
        </div>
        {article.isLoading || article.isFetching ? (
          "Loading..."
        ) : (
          <Editor
            initialHTMLContent={article.data?.content}
            onChange={(state, le) => {
              setLexicalState(le ?? null);
            }}
          />
        )}
      </div>
    </ProtectedAdminLayout>
  );
};

export default Editar;
