import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
const ArticlesPreview = () => {
  const { locale } = useRouter();
  const articlesPreview = api.article.getPreviews.useQuery({
    locale: locale ?? "es",
  });
  const router = useRouter();

  return (
    <motion.div className="max-w-screen flex snap-x gap-2 overflow-x-scroll p-5">
      {articlesPreview.data?.map((article, index) => (
        <button
          key={article.id}
          onClick={() => void router.push(`/articulos/${article.slug}`)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.5, duration: 0.5 }}
            className="m-4 flex w-64 flex-col items-start justify-start gap-2 overflow-hidden rounded-md shadow-lg"
          >
            {article.coverPhotoPublicId && (
              <motion.div
                className="relative w-full"
                whileHover={{ scale: 1.1 }}
              >
                <CldImage
                  src={article.coverPhotoPublicId}
                  alt={article.title ?? "Cover photo"}
                  width="400"
                  height="500"
                  crop="thumb"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0  flex items-end justify-start p-4">
                  <h3 className="text-start text-2xl font-bold text-white">
                    {article.title}
                  </h3>
                </div>
              </motion.div>
            )}
          </motion.div>
        </button>
      ))}
    </motion.div>
  );
};

export default ArticlesPreview;