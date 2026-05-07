import { InsigniaModel } from "@/api/controller/insignia";
import DialogCustom from "@/components/dialog-custom";
import { Button, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export interface ModelDialogManageState {
  isOpen: boolean;
  data: any | InsigniaModel;
  state: "create" | "update" | "view";
}

interface DialogManageProps extends ModelDialogManageState {
  onCloseDoalog: () => void;
  onSubmit: (state: "create" | "update", body: InsigniaModel) => void;
  //   onRefetch: (closeDialog?: boolean) => void;
}

const DialogManage = ({
  isOpen,
  data,
  state,
  onCloseDoalog,
  onSubmit,
}: DialogManageProps): JSX.Element => {
  const [form, setForm] = useState<InsigniaModel>({
    name: "",
    receiptDate: "",
    dueDate: "",
  });

  const onClearForm = (): void => {
    setForm({
      name: "",
      receiptDate: "",
      dueDate: "",
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
  }, [isOpen]);
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
            <p>ชื่อเครื่องราชอิสริยาภรณ์</p>
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
              // disablePast
              name="receiptDate"
              onChange={(newValue) => onChangeDate("receiptDate", newValue)}
              className="w-full"
              value={dayjs(form.receiptDate)}
              views={["year", "month", "day"]}
              //   onChange={(newValue) =>
              //     onChangeDate("DateExpireCard", newValue)
              //   }
              //   disabled={isDisabled}
              slotProps={{
                textField: {
                  error: false,
                  size: "small",
                },
                //   actionBar: {
                //     actions: ["clear", "cancel", "accept"],
                //   },
              }}
            />
          </div>

          <div className="mb-3">
            <p>วันครบกำหนดขอเครื่องราชอิสริยาภรณ์ครั้งถัดไป</p>
            <DateTimePicker
              // disablePast
              name="dueDate"
              onChange={(newValue) => onChangeDate("dueDate", newValue)}
              className="w-full"
              value={dayjs(form.dueDate)}
              views={["year", "month", "day"]}
              //   onChange={(newValue) =>
              //     onChangeDate("DateExpireCard", newValue)
              //   }
              //   disabled={isDisabled}
              slotProps={{
                textField: {
                  error: false,
                  size: "small",
                },
                //   actionBar: {
                //     actions: ["clear", "cancel", "accept"],
                //   },
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
