import DialogCustom from "@/components/dialog-custom";
import InputFileCustom from "@/components/input-file-custom";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export interface ModelDialogManageState {
  isOpen: boolean;
  data: any;
  state: "add" | "edit" | "view";
}

interface DialogManageProps extends ModelDialogManageState {
  onCloseDoalog: () => void;
  onSubmit: (body: FormData) => void;
}

const DialogManage = ({
  isOpen,
  data,
  state,
  onCloseDoalog,
  onSubmit,
}: DialogManageProps): JSX.Element => {
  const [form, setForm] = useState<{ name: string; file: any[] }>({
    name: "",
    file: [],
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: data?.name || "",
        file: [],
      });
    }
  }, [isOpen, data]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.file.length > 0) {
      formData.append("files", form.file[0]);
    }
    onSubmit(formData);
  };

  return (
    <>
      <DialogCustom
        status={isOpen}
        title={state === "add" ? "เพิ่มรายการ" : "แก้ไขรายการ"}
        returnOnClose={onCloseDoalog}
        size="sm"
      >
        <div className="flex flex-col">
          <div className="mb-3">
            <p>ชื่อเอกสาร</p>
            <TextField
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <InputFileCustom
              name="file"
              fileValue={form.file}
              permissionChangeFile={true}
              permissionDownloadFile={true}
              returnChangeFile={(val) => setForm({ ...form, file: val })}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outlined" onClick={onCloseDoalog} color="error">
              ยกเลิก
            </Button>
            <Button variant="contained" onClick={handleSave}>
              บันทึก
            </Button>
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default DialogManage;
