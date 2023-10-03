import { $generateHtmlFromNodes } from "@lexical/html";
import type { LexicalEditor } from "lexical";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";
import { api } from "~/utils/api";

const Editor = dynamic(() => import("~/components/TextEditor"), { ssr: false });

const Editar = () => {
  const router = useRouter();
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);

  const article = api.getArticle.useQuery(
    {
      slug: (router.query.articleSlug as string) ?? "",
      locale,
    },
    { enabled: !!router.query.articleSlug },
  );

  useEffect(() => {
    if (article.data) {
      setImagePublicId(article.data.coverPhotoPublicId ?? null);
    }
  }, [article.data]);

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
            Inglés
          </button>
          <CldUploadWidget
            uploadPreset="article_cover_photo"
            onUpload={(res) => {
              if (
                typeof res.info === "object" &&
                "public_id" in res.info &&
                typeof res.info.public_id === "string"
              ) {
                console.log(res.info);
                setImagePublicId(res.info.public_id);
              }
            }}
          >
            {({ open }) => {
              function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
                e.preventDefault();
                open();
              }
              return (
                <button
                  className="rounded-lg bg-slate-700 p-1 px-4 text-white"
                  onClick={handleOnClick}
                >
                  {imagePublicId
                    ? "Cambiar foto portada"
                    : "Subir foto portada"}
                </button>
              );
            }}
          </CldUploadWidget>
        </div>
        <div>
          {imagePublicId && (
            <CldImage
              src={imagePublicId}
              height={400}
              width={700}
              alt="Cover image for article"
            />
          )}
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
