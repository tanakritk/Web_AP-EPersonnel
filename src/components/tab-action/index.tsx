import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface TabValueProps {
  label: string;
  path: string;
  action?: boolean;
}

interface TabActionProps {
  tabValue: TabValueProps[];
}
// const tabValue: TabValueProps[] = [
//     { label: "ข้อมูลผู้ยื่นคำขอ", path: '', action: true },
//     { label: "ข้อมูลของห้องปฏิบัติการ", path: '' },
//     { label: "รายการเอกสารเเนบ", path: '' },
// ]
const TabAction = ({ tabValue }: TabActionProps): JSX.Element => {
  const navigate = useNavigate();
  const onChangeTab = (
    path: string,
    action?: boolean | null | undefined,
  ): void => {
    if (!action) {
      navigate(path);
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        {tabValue.map((item, index) => (
          <div key={"tab" + index} className="px-3 py-2">
            <Button
              className="min-h-12"
              sx={{ minWidth: 250 }}
              variant={item.action ? "contained" : "outlined"}
              onClick={() => onChangeTab(item.path, item?.action)}
            >
              <span className={`text-[16px] ${item.action ? 'text-white' : 'text-black'}`}>{item.label}</span>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TabAction;
