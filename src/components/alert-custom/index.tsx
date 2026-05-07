import { Alert } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WarningIcon from "@mui/icons-material/Warning";
import { useEffect, useState } from "react";
import { useAlert } from "@/context/alert-context";
interface AlertCustomInterface {
  detail: Detail;
}

interface Detail {
  // type:  "success"|"warning";
  type: string; //"success"|"warning";
  message: string;
}

const AlertCustom = ({ detail }: AlertCustomInterface) => {
  const [isShow, setIsShow] = useState(false);
  const { setAlertContext } = useAlert();
  useEffect(() => {
    if (detail.message == "") {
      setIsShow(false);
    } else {
      setIsShow(true);
      setTimeout(function () {
        setIsShow(false);
        setAlertContext({
          type: "success",
          message: "",
        });
      }, 2000);
    }
  }, [detail]);
  return (
    <>
      <div
        style={{ zIndex: 9999 }}
        className={`transition-all duration-300 ease-out-in absolute top-0 left-0  ${isShow ? "sm:w-1/3 w-full translate-x-0 opacity-100 " : "w-0 opacity-0 -translate-x-full"}`}
      >
        {isShow && (
          <>
            {detail.type == "success" ? (
              <Alert
                variant="filled"
                icon={<TaskAltIcon fontSize="inherit" />}
                severity="success"
              >
                {detail?.message || ""}
              </Alert>
            ) : (
              <Alert
                variant="filled"
                icon={<WarningIcon fontSize="inherit" />}
                severity="warning"
              >
                {detail?.message || ""}
              </Alert>
            )}
          </>
        )}
      </div>
      {/* } */}
    </>
  );
};

export default AlertCustom;
