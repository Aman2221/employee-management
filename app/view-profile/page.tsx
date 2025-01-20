import Layout from "@/components/Common/Layout";
import UserProfile from "@/components/Profile/UserProfile";
import React, { Suspense } from "react";

const Profile = () => {
  return (
    <Suspense>
      <Layout>{<UserProfile />}</Layout>
    </Suspense>
  );
};

export default Profile;
