/* eslint-disable @typescript-eslint/no-misused-promises */
import { $generateHtmlFromNodes } from "@lexical/html";
import type { LexicalEditor } from "lexical";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useController, useForm, type SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { IoArrowBackOutline } from "react-icons/io5";
import { ProtectedAdminLayout } from "~/components/ProtectedAdminLayout";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const Editor = dynamic(() => import("~/components/TextEditor"), { ssr: false });

const ArticleEditor = ({
  articleSlug: articleSlugProp,
}: {
  articleSlug?: string;
}) => {
  const [articleSlug, setArticuleSlug] = useState<string | undefined>(
    articleSlugProp,
  );
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

  const { handleSubmit, control } = useForm<{
    slug: string;
    title: string;
    description?: string;
  }>({
    defaultValues: {
      title: article?.data?.title ?? "",
      slug: article?.data?.slug ?? "",
      description: article?.data?.description ?? "",
    },
  });

  const title = useController({ name: "title", control });
  const slug = useController({
    name: "slug",
    control,
    disabled: !!article.data?.slug,
  });
  const description = useController({ name: "description", control });

  useEffect(() => {
    if (article.data) {
      setImagePublicId(article.data.coverPhotoPublicId ?? null);
      title.field.onChange(article.data.title);
      slug.field.onChange(article.data.slug);
    } else {
      title.field.onChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.data, locale]);

  const updateOrCrateArticle = api.article.upsert.useMutation({
    onSuccess: (newSlug) => {
      setArticuleSlug(newSlug);
      toast.success("Artículo guardado");
    },
    onError: (err) => {
      toast.error("Error al guardar el artículo");
      console.error(err);
    },
  });

  const onSubmit: SubmitHandler<{
    slug: string;
    title: string;
    description?: string;
  }> = (data) => {
    if (!editor) toast.error("Debes agregar contenido para poder guardar");
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
          description: data.description,
        });
      });
    }
  };

  const router = useRouter();

  return (
    <ProtectedAdminLayout>
      <>
        <Toaster />
        <div className="p-5">
          <div className="flex gap-4">
            <button
              className="flex items-center justify-center gap-2 hover:font-bold"
              onClick={() => {
                void router.push("/admin");
              }}
            >
              <IoArrowBackOutline />
              Volver
            </button>
            <button
              disabled={updateOrCrateArticle.isLoading}
              className="rounded-lg bg-blue-600 p-1 px-4 text-white hover:bg-blue-950"
              onClick={handleSubmit(onSubmit)}
            >
              {updateOrCrateArticle.isLoading ? "Guardando..." : "Guardar"}
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
              uploadPreset={
                env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_COVER_PHOTO
              }
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
          <div className="mt-5 flex flex-col gap-5">
            <div>
              <Label htmlFor="title">Título:</Label>
              <Input {...title.field} />
            </div>
            <div>
              <Label htmlFor="description">Descripción:</Label>
              <TextArea className="h-40" {...description.field} />
            </div>
            {!articleSlug && (
              <div>
                <Label htmlFor="slug">Slug:</Label>
                <Input {...slug.field} />
              </div>
            )}
          </div>
          <div>
            {imagePublicId && (
              <CldImage
                src={imagePublicId}
                height={400}
                width={700}
                alt="Cover image for article"
                className="my-5"
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
      </>
    </ProtectedAdminLayout>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={
      "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 " +
      props.className
    }
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={
      "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 " +
      props.className
    }
  />
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className="text-md block font-medium text-gray-900">
    {props.children}
  </label>
);

export default ArticleEditor;
