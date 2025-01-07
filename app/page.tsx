import Layout from "@/components/Common/Layout";
import UserUpdates from "@/components/Updates/UserUpdates";

export default function Home() {
  return (
    <Layout showSearchInput={false}>
      <UserUpdates />
    </Layout>
  );
}
