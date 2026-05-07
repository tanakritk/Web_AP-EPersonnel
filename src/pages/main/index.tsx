import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import { getLoginStorage } from "@/helpers/set-storage";
import ContentLayout from "@/layout/content-layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PageMain = () => {
  const profile = getLoginStorage()?.profile;
  const idEmp = encodeURIComponent(CryptoHelper.encrypt(profile?.id));
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/personnel-info/information/${idEmp}`);
  }, []);
  return (
    <ContentLayout titlePage="หน้าหลัก" breadcrumbList={[]}>
      <h1>Hello</h1>
    </ContentLayout>
  );
};

export default PageMain;
