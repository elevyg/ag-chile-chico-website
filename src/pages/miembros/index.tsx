import { useTranslation } from "next-i18next";
import MemberCard from "~/components/MemberCard";
import Navbar from "~/components/Navbar";
import RootLayout from "~/pages/RootLayout";
import { api } from "~/utils/api";
import { ssgApiHelper } from "~/utils/ssgApi";
import { translationServerProps } from "~/utils/translationServerProps";

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  const ssg = await ssgApiHelper();
  await ssg.member.listPublished.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      ...(await translationServerProps(locale, ["landing"])),
    },
  };
};

const MembersPage = () => {
  const { t } = useTranslation("landing");
  const members = api.member.listPublished.useQuery();

  return (
    <RootLayout>
      <Navbar />
      <section className="bg-slate-100 px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
            {t("members-section-title")}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            {t("members-section-description")}
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.data?.map((member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                placeId={member.placeId}
                address={member.address}
                mapsUrl={member.mapsUrl}
                mapsLabel={t("see-more-map-label")}
              />
            ))}
          </div>
        </div>
      </section>
    </RootLayout>
  );
};

export default MembersPage;
