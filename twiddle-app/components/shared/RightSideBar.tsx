import { currentUser } from "@clerk/nextjs/server";

const RightSideBar = async () => {
  const user = await currentUser();
  if (!user) return null;

  return (
    <>
      <section className="custom-scrollbar rightsidebar">rightsidebar</section>
    </>
  );
};

export default RightSideBar;
