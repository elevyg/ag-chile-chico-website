/* eslint-disable @typescript-eslint/no-misused-promises */
import { $generateHtmlFromNodes } from "@lexical/html";
import type { LexicalEditor } from "lexical";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useController, useForm, type SubmitHandler } from "react-hook-form";
import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";
import { api } from "~/utils/api";

const Editor = dynamic(() => import("~/components/TextEditor"), { ssr: false });

const ArticleEditor = ({ articleSlug }: { articleSlug?: string }) => {
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);

  const article = api.article.get.useQuery(
    {
      slug: articleSlug ?? "",
      locale,
    },
    {
      enabled: !!articleSlug,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
  );

  const [editor, setLexicalState] = useState<LexicalEditor | null>(null);

  const { handleSubmit, control } = useForm<{ slug: string; title: string }>({
    defaultValues: {
      title: article?.data?.title ?? "",
      slug: article?.data?.slug ?? "",
    },
  });

  const title = useController({ name: "title", control });
  const slug = useController({ name: "slug", control });

  useEffect(() => {
    if (article.data) {
      setImagePublicId(article.data.coverPhotoPublicId ?? null);
      title.field.onChange(article.data.title);
      slug.field.onChange(article.data.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.data]);

  const updateOrCrateArticle = api.article.upsert.useMutation();

  const onSubmit: SubmitHandler<{ slug: string; title: string }> = (data) => {
    if (editor) {
      editor.update(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        console.log("htmlString", htmlString);
        console.log(data);
        updateOrCrateArticle.mutate({
          slug: data.slug,
          title: data.title,
          content: htmlString,
          locale,
          coverPhotoPublicId: imagePublicId ?? undefined,
        });
      });
    }
  };

  return (
    <ProtectedAdminLayout>
      <div className="p-5">
        <div className="flex gap-4">
          <button
            className="rounded-lg bg-blue-600 p-1 px-4 text-white hover:bg-blue-950"
            onClick={handleSubmit(onSubmit)}
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
          <Label htmlFor="slug">Título:</Label>
          <Input {...title.field} />
          {!articleSlug && (
            <>
              <Label htmlFor="slug">Slug:</Label>
              <Input {...slug.field} />
            </>
          )}
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

        {(article.isLoading || article.isFetching) && !!articleSlug ? (
          "Cargando..."
        ) : (
          <div>
            <Label>Contenido:</Label>
            <Editor
              initialHTMLContent={article.data?.content}
              onChange={(state, le) => {
                setLexicalState(le ?? null);
              }}
            />
          </div>
        )}
      </div>
    </ProtectedAdminLayout>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
  />
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className="text-md block font-medium text-gray-900">
    {props.children}
  </label>
);

export default ArticleEditor;
