import LandingPage from "@/components/shared/LandingPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    return (
      <>
        <LandingPage />
      </>
    );
  }

  return (
    <>
      <section className="mt-10 flex flex-col gap-10">section</section>
    </>
  );
}
