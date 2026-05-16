import { AcademicModel } from "@/api/controller/academic";
import DialogCustom from "@/components/dialog-custom";
import { Button, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export interface ModelDialogManageState {
  isOpen: boolean;
  data: any | AcademicModel;
  state: "create" | "update" | "view";
}

interface DialogManageProps extends ModelDialogManageState {
  onCloseDoalog: () => void;
  onSubmit: (state: "create" | "update", body: AcademicModel) => void;
}

const DialogManage = ({
  isOpen,
  data,
  state,
  onCloseDoalog,
  onSubmit,
}: DialogManageProps): JSX.Element => {
  const [form, setForm] = useState<AcademicModel>({
    name: "",
    receiptDate: "",
    dueDate: "",
    note: "",
  });

  const onClearForm = (): void => {
    setForm({
      name: "",
      receiptDate: "",
      dueDate: "",
      note: "",
    });
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeDate = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: dayjs(value).format("YYYY-MM-DD"),
    }));
  };

  useEffect(() => {
    if (isOpen) {
      if (state === "create") {
        onClearForm();
      } else {
        setForm(data);
      }
    }
  }, [isOpen, state, data]);

  return (
    <>
      <DialogCustom
        status={isOpen}
        title={state === "create" ? "เพิ่มรายการ" : "แก้ไขรายการ"}
        returnOnClose={onCloseDoalog}
        size="sm"
      >
        <div className="flex flex-col">
          <div className="mb-3">
            <p>ชื่อวิทยฐานะ</p>
            <TextField
              onChange={onChangeInput}
              value={form.name}
              name="name"
              fullWidth
            />
          </div>

          <div className="mb-3">
            <p>วันที่รับการแต่งตั้ง</p>
            <DateTimePicker
              name="receiptDate"
              onChange={(newValue) => onChangeDate("receiptDate", newValue)}
              className="w-full"
              value={form.receiptDate ? dayjs(form.receiptDate) : null}
              views={["year", "month", "day"]}
              slotProps={{
                textField: {
                  error: false,
                  size: "small",
                },
              }}
            />
          </div>

          <div className="mb-3">
            <p>วันครบกำหนดส่งผลงานเลื่อนวิทยฐานะ</p>
            <DateTimePicker
              name="dueDate"
              onChange={(newValue) => onChangeDate("dueDate", newValue)}
              className="w-full"
              value={form.dueDate ? dayjs(form.dueDate) : null}
              views={["year", "month", "day"]}
              slotProps={{
                textField: {
                  error: false,
                  size: "small",
                },
              }}
            />
          </div>

          <div className="mb-3">
            <p>หมายเหตุ</p>
            <TextField
              onChange={onChangeInput}
              value={form.note}
              name="note"
              fullWidth
              multiline
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outlined" onClick={onCloseDoalog} color="error">
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                onSubmit(state === "create" ? "create" : "update", form)
              }
            >
              บันทึก
            </Button>
          </div>
        </div>
      </DialogCustom>
    </>
  );
};

export default DialogManage;
