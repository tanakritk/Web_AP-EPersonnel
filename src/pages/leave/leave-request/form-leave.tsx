import _DropdownApi, { DropdownModel } from "@/api/controller/dropdown";
import { LeaveModel } from "@/api/controller/leave";
import { useLoading } from "@/context/loading-context";
import { getLoginStorage } from "@/helpers/set-storage";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
interface FormLeaveProps {
  form: LeaveModel;
  returnForm: (form: any) => void;
  isDisabled: boolean;
  action: "create" | "edit" | "view";
}
const FormLeave = ({
  form,
  returnForm,
  isDisabled,
  action,
}: FormLeaveProps): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const profile = getLoginStorage().profile;
  const userRequest = `${profile.firstname} ${profile.surname}`;
  const [timeStart, setTimeStart] = useState<any>("");
  const [timeEnd, setTimeEnd] = useState<any>("");
  const isLoaded = useRef(false);

  const { data: ddl, isLoading: isLoadingDDL } = useQuery({
    queryKey: ["ddl", "leave-request"],
    queryFn: async () => {
      const resultLeaveType = await _DropdownApi().leaveType();

      const resultStatus = await _DropdownApi().statusLeave();
      return {
        leaveType: resultLeaveType.data,
        statusLeave: resultStatus.data,
      };
    },
  });

  const onChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newForm = {
      ...form,
      [name]: value,
    };

    returnForm(newForm);
  };

  const onChangeDate = (key: string, value: any) => {
    const formattedValue =
      value && dayjs(value).isValid()
        ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") // หรือ 'YYYY-MM-DD HH:mm:ss' ถ้าเป็น DateTime
        : null;

    const newForm = {
      ...form,
      [key]: formattedValue,
    };

    if (key === "startDate") {
      newForm.startDate = dayjs(value)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
    } else if (key === "endDate") {
      newForm.endDate = dayjs(value).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    }

    if (form.leaveFormat === "ระบุเวลา" && key === "startDate") {
      const formatTimeStart =
        timeStart && dayjs(timeStart).isValid()
          ? dayjs(timeStart).format("HH:mm:ss") // หรือ 'YYYY-MM-DD HH:mm:ss' ถ้าเป็น DateTime
          : null;
      const formatTimeEnd =
        timeEnd && dayjs(timeEnd).isValid()
          ? dayjs(timeEnd).format("HH:mm:ss") // หรือ 'YYYY-MM-DD HH:mm:ss' ถ้าเป็น DateTime
          : null;
      newForm.startDate = `${dayjs(value).format("YYYY-MM-DD")} ${formatTimeStart || "00:00:00"}`;
      newForm.endDate = `${dayjs(value).format("YYYY-MM-DD")} ${formatTimeEnd || "00:00:00"}`;
    }

    returnForm(newForm);
  };

  const onChangeTime = (key: string, value: any) => {
    const formattedValue =
      value && dayjs(value).isValid()
        ? dayjs(value).format("HH:mm:ss") // หรือ 'YYYY-MM-DD HH:mm:ss' ถ้าเป็น DateTime
        : null;

    const newForm = {
      ...form,
    };
    if (key === "timeStart") {
      newForm.startDate = `${dayjs(form.startDate).format("YYYY-MM-DD")} ${formattedValue}`;
      setTimeStart(value);
    } else if (key === "timeEnd") {
      newForm.endDate = `${dayjs(form.startDate).format("YYYY-MM-DD")} ${formattedValue}`;
      setTimeEnd(value);
    }
    returnForm(newForm);
  };

  useEffect(() => {
    const finalLoad = isLoadingDDL;
    setLoadingContext(finalLoad);
  }, [setLoadingContext, isLoadingDDL]);

  useEffect(() => {
    if (
      !isLoaded.current &&
      form.startDate &&
      (action === "edit" || action === "view")
    ) {
      if (form.leaveFormat === "ระบุเวลา") {
        setTimeStart(form.startDate);
        setTimeEnd(form.endDate);
      }
      isLoaded.current = true;
    }
  }, [form.startDate, action]);

  useEffect(() => {
    if (action === "create") {
      if (form.leaveFormat === "ระบุเวลา") {
        setTimeStart("");
        setTimeEnd("");
        const newForm = {
          ...form,
          startDate: "",
          endDate: "",
        };
        returnForm(newForm);
      } else {
        const newForm = {
          ...form,
          startDate: "",
          endDate: "",
        };
        returnForm(newForm);
      }
    }
  }, [form.leaveFormat]);

  // useEffect(() => {
  //   if (action === "create") {
  //     if (form.leaveFormat === "ระบุเวลา") {
  //       setTimeStart("");
  //       setTimeEnd("");
  //     }
  //     const newForm = {
  //       ...form,
  //       startDate: "",
  //       endDate: "",
  //     };
  //     returnForm(newForm);
  //   } else {
  //     const newForm = {
  //       ...form,
  //       // startDate: "",
  //       // endDate: "",
  //     };
  //     console.log("newForm--> ", newForm);
  //     returnForm(newForm);
  //   }
  // }, []);

  return (
    <>
      <div className="flex flex-wrap py-3">
        <div className="lg:basis-2/5 basis-full  px-3 mb-3">
          <p className="mb-1">ชื่อผู้ขอลา</p>
          <TextField
            name=""
            value={userRequest}
            size="small"
            fullWidth
            autoComplete="off"
            disabled={true}
          />
        </div>

        <div className="lg:basis-3/5 basis-full  px-3 mb-3">
          <p className="mb-1">ประเภทการลา</p>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              value={form.leaveType}
              name="leaveType"
              onChange={onChangeForm}
            >
              {ddl?.leaveType?.map((item: DropdownModel, index: number) => (
                <FormControlLabel
                  key={"ddlLeaveType" + index}
                  value={item.value}
                  control={<Radio disabled={isDisabled} />}
                  label={item.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>

        <div className="basis-full  px-3 mb-3">
          <p className="mb-1">เหตุผลการลา</p>
          <TextField
            name="reasonLeave"
            value={form.reasonLeave}
            size="small"
            fullWidth
            autoComplete="off"
            disabled={isDisabled}
            multiline
            rows={2}
            onChange={onChangeForm}
          />
        </div>

        <div className="basis-full  px-3 mb-3">
          <p className="mb-1">รูปแบบการลา</p>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              value={form.leaveFormat}
              name="leaveFormat"
              onChange={onChangeForm}
            >
              <FormControlLabel
                value="เต็มวัน"
                control={<Radio disabled={isDisabled} />}
                label="เต็มวัน"
              />

              <FormControlLabel
                value="ระบุเวลา"
                control={<Radio disabled={isDisabled} />}
                label="ระบุเวลา"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {form.leaveFormat === "เต็มวัน" ? (
          <>
            <div className="lg:basis-2/5 basis-full px-3 mb-3">
              <p className="mb-1">วันที่เริ่ม</p>
              <DatePicker
                disablePast
                name="startDate"
                onChange={(newValue) => onChangeDate("startDate", newValue)}
                className="w-full"
                value={dayjs(form.startDate)}
                disabled={isDisabled}
                slotProps={{
                  textField: {
                    error: false,
                    size: "small",
                  },
                }}
              />
            </div>

            <div className="lg:basis-2/5 basis-full px-3 mb-3">
              <p className="mb-1">วันที่สิ้นสุด</p>
              <DatePicker
                disablePast
                name="endDate"
                onChange={(newValue) => onChangeDate("endDate", newValue)}
                className="w-full"
                value={dayjs(form.endDate)}
                disabled={isDisabled}
                slotProps={{
                  textField: {
                    error: false,
                    size: "small",
                  },
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="lg:basis-2/5 basis-full px-3 mb-3">
              <p className="mb-1">วันที่</p>
              <DatePicker
                disablePast
                name="startDate"
                onChange={(newValue) => onChangeDate("startDate", newValue)}
                className="w-full"
                value={dayjs(form.startDate)}
                disabled={isDisabled}
                slotProps={{
                  textField: {
                    error: false,
                    size: "small",
                  },
                }}
              />
            </div>

            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">เวลาเริ่ม</p>
              <TimePicker
                // disablePast
                name="timeStart"
                onChange={(newValue) => onChangeTime("timeStart", newValue)}
                className="w-full"
                value={dayjs(timeStart)}
                disabled={isDisabled || form.startDate == ""}
                slotProps={{
                  textField: {
                    error: false,
                    size: "small",
                  },
                }}
              />
            </div>

            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">เวลาสิ้นสุด</p>
              <TimePicker
                // disablePast
                name="timeEnd"
                onChange={(newValue) => onChangeTime("timeEnd", newValue)}
                className="w-full"
                value={dayjs(timeEnd)}
                disabled={isDisabled || form.startDate == ""}
                slotProps={{
                  textField: {
                    error: false,
                    size: "small",
                  },
                }}
              />
            </div>
          </>
        )}

        <div className="lg:basis-2/5 basis-full px-3 mb-3">
          <p className="mb-1">สถานะ</p>
          <Select fullWidth disabled={true} value={form.statusLeaveId}>
            {ddl?.statusLeave?.map((item: DropdownModel, index: number) => (
              <MenuItem key={"ddlStatusLeave" + index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default FormLeave;
