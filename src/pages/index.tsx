import { NextPage } from "next";
import dynamic from "next/dynamic";

import TasksList from "@/features/taskList";

const Layout = dynamic(() => import("../ui/layout"), { ssr: false });

const HomePage: NextPage = () => {
  return (
    <Layout>
      <TasksList />
    </Layout>
  );
};
export default HomePage;
