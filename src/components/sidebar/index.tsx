import MenuSideBar from "./menu";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import profileImgMan from "../../assets/img/profile-man.png";
import profileImgGirl from "../../assets/img/profile-girl.png";
import { Avatar, Divider } from "@mui/material";
import { getLoginStorage } from "@/helpers/set-storage";
interface SideBarProps {
  status: boolean;
  toggleMenu: any;
}

const SideBar = ({ status, toggleMenu }: SideBarProps) => {
  const profile = getLoginStorage().profile;
  return (
    <div
      style={{ zIndex: 90 }}
      className={`shadow-xl fixed relative flex flex-col space-y-4 pt-5 mt-3 left-0 rounded-r-lg bg-white h-[calc(100vh-93px)] transition-all duration-100 ease-in-out absolute sm:static 
                ${status ? "px-3 xl:w-[20%] lg:w-[35%] md:w-2/4 sm:w-2/4 w-3/4 translate-x-0 opacity-100" : "w-4 opacity-100 translate-x-0"}
            `}
    >
      <div
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
        onClick={toggleMenu}
        className="absolute top-[45px] right-[-16px] bg-[#fff] cursor-pointer w-[32px] h-[32px] text-[22px] hexagon leading-[30px] text-[#999] text-center hover:text-[#333] duration-200 border-r-[2px]"
      >
        {status ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </div>

      {/* {status && (
        <div className="flex flex-col items-center mb-6 justify-center relative ">
          <div className="flex items-center space-x-2">
            <img src={logo} width={200} height={30} />
          </div>
        </div>
      )} */}

      {status && (
        <div className="flex-1 overflow-y-auto flex flex-col w-full pb-4 hide-scrollbar">
          <div className="flex  justify-start px-4 space-x-4 ">
            <div className="flex items-center">
              {/* <img src={logo} width={200} height={30} /> */}
              <Avatar
                alt="Remy Sharp"
                src={profile?.sex === "ชาย" ? profileImgMan : profileImgGirl}
                sx={{ width: 60, height: 60 }}
              />
            </div>
            <div className="flex flex-col justify-start">
              <p className="text-lg font-semibold">
                {profile?.firstname} {profile?.surname}
              </p>
              <p className="text-sm">{profile?.position}</p>
            </div>
          </div>
          <Divider sx={{ marginTop: "50px" }}></Divider>
          <MenuSideBar />
        </div>
      )}
    </div>
  );
};

export default SideBar;
