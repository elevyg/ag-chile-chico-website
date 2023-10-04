import classNames from "classnames";
import { NodeType, parse, type HTMLElement } from "node-html-parser";
import RootLayout from "~/pages/RootLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import SuperJSON from "superjson";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CldImage } from "next-cloudinary";
import Navbar from "~/components/Navbar";

const classMap = new Map(
  Object.entries({
    p: "leading-8 py-2",
    h1: "text-2xl font-bold",
    ol: "list-decimal list-inside",
  }),
);

function addTailwindClasses(node: HTMLElement) {
  if (node.nodeType === NodeType.ELEMENT_NODE) {
    const tagName = node.tagName?.toLowerCase();
    const tailwindClass = classMap.get(tagName);

    if (tailwindClass) {
      node.setAttribute(`class`, classNames(tailwindClass));
    }

    for (const childNode of node.childNodes) {
      addTailwindClasses(childNode as HTMLElement);
    }
  }
}

const convertStringToHTML = (htmlString?: string) => {
  if (!htmlString) return;
  const html = parse(htmlString);
  addTailwindClasses(html);
  return html;
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(),
    transformer: SuperJSON,
  });
  try {
    const slug = context.params?.slug;

    if (!slug) return;

    const article = await ssg.article.get.fetch({
      slug,
      locale: context.locale ?? "en",
    });

    if (!article) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        ...(await serverSideTranslations(
          context.locale ?? "es",
          ["landing", "common"],
          nextI18nConfig,
          ["es", "en"],
        )),
        trpcState: ssg.dehydrate(),
        slug,
      },
      revalidate: 1,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await prisma.article.findMany({
    select: { slug: true },
  });
  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: "blocking",
  };
};

const Article = ({ slug }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { locale } = useRouter();
  const article = api.article.get.useQuery({ slug, locale: locale ?? "es" });
  const content = convertStringToHTML(article.data?.content);

  if (!content) return;

  return (
    <RootLayout>
      <Navbar />
      <article className="my-5 flex flex-col items-center gap-5">
        <div className="flex w-full flex-col sm:w-3/4 lg:w-3/5">
          <h1 className="px-5 text-2xl md:text-4xl">{article.data?.title}</h1>
          <p className="px-5">
            Ultima actualización: {article.data?.updatedAt.toLocaleDateString()}
          </p>

          {article.data?.coverPhotoPublicId && (
            <CldImage
              width={700}
              height={100}
              priority
              src={article.data?.coverPhotoPublicId}
              alt="Cover image for article"
              sizes="100vw"
              className="mt-5 w-full"
            />
          )}
        </div>
        <div className="max-w-3xl px-5">
          <div dangerouslySetInnerHTML={{ __html: content }} />d
        </div>
      </article>
    </RootLayout>
  );
};

export default Article;
