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
      const existingClass = node.getAttribute("class") ?? "";
      node.setAttribute(`class`, classNames(existingClass, tailwindClass));
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
      <article>
        <div>{/* Cover photo */}</div>
        <div className="max-w-5xl px-5">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </article>
    </RootLayout>
  );
};

export default Article;
