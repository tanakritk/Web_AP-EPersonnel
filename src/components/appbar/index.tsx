import LogoutIcon from "@mui/icons-material/Logout";
import useConfirm from "../drawer-confirm";
import { IconButton } from "@mui/material";
import logo from "../../assets/img/logo.png";

interface AppBarProps {
  returnLogout: () => void;
}

const AppBar = ({ returnLogout }: AppBarProps) => {
  const [confirm, ConfirmDialog] = useConfirm();
//   const navigate = useNavigate();
  const onLogout = async () => {
    const resultConfirm = await confirm("ท่านต้องการออกจากระบบใช่หรือไม่ ?");
    if (resultConfirm) {
      return returnLogout();
    }
  };
  return (
    <>
      <div className="flex w-full bg-white h-20 shadow items-center px-6 border-b border-b-2 border-primary-2">
        <div className="flex w-full justify-between">
          <div className="flex space-x-3 items-center">
            <div className="bg-white p-1 rounded-full">
            <img src={logo} className="w-16 h-16" />
            </div>
            <p className="text-2xl font-semibold text-secondary">
              โรงเรียนอนุบาลพิษณุโลก
              {/* *************************** */}
            </p>
          </div>
          <div className="flex space-x-3 items-center">
            {/* <Notification data={notiList} />
            <IconButton
              onClick={() => navigate("/profile")}
              sx={{
                width: 50,
                height: 50,
                padding: 0.5,
                backgroundColor: "white",
                border: "1px solid #ccc", // หรือใช้ theme.palette.grey[300]
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <Avatar className="" sizes="small" alt="U" src={avartar} />
            </IconButton> */}

            <IconButton
              onClick={onLogout}
              sx={{
                width: 50,
                height: 50,
                padding: 0.5,
                backgroundColor: "white",
                border: "1px solid #ccc", // หรือใช้ theme.palette.grey[300]
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <LogoutIcon color="error" />
            </IconButton>
          </div>
        </div>
      </div>

      {ConfirmDialog}
    </>
  );
};

export default AppBar;
