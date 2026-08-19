import { MasterUserRelationModel } from "@/api/controller/master-user";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useState } from "react";
import { useParams } from "react-router-dom";
// import { ModelApplicantProps } from "src/apis/applicant";

interface CardAddressProps {
  form: MasterUserRelationModel; //ModelApplicantProps;
  returnForm: (form: any) => void; //(form: ModelApplicantProps) => void;
  isDisabled: boolean;
  //   returnForm: (form: ModelApplicantProps) => void;
}

const CardInformation = ({
  form,
  returnForm,
  isDisabled,
}: CardAddressProps): JSX.Element => {
  const [isDisablePosition, setIsDisablePosition] = useState<boolean>(false);
  const params = useParams();
  const isDisabledUsername = params?.action === "create" ? false : true;
  const ddl = {
    statusWork: ["ข้าราชการ", "พนักงานประจำ", "อัตราจ้าง", "ลูกจ้างชั่วคราว"],
    position: [
      "ผู้อำนวยการ",
      "รองผู้อำนวยการ",
      "หัวหน้าฝ่ายงาน",
      "หัวหน้ากลุ่มสาระ",
      "ครู",
      "ครูผู้ช่วย",
      "นักวิชาการ",
      "ลูกจ้างชั่วคราว",
    ],
    deputy: [
      "กลุ่มงานบริหารวิชาการ",
      "กลุ่มงานบริหารงานบุคคล",
      "กลุ่มงานบริหารงานทั่วไป",
      "กลุ่มงานบริหารงบประมาณ",
    ],
    academicStanding: ["ไม่มี", "คศ.1", "คศ.2", "คศ.3", "คศ.4"],
  };
  const onChangeFormCard = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => {
    const { name, value } = event.target;
    if (name === "statusWork" && value === "ลูกจ้างชั่วคราว") {
      const newForm = {
        ...form,
        position: "ลูกจ้างชั่วคราว",
        [name]: value,
      };
      setIsDisablePosition(true);
      returnForm(newForm);
    } else {
      const newForm = {
        ...form,
        [name]: value,
      };
      setIsDisablePosition(false);
      returnForm(newForm);
    }
  };

  const calcYearService = (startDate?: string): string => {
    if (!startDate) return "";
    const start = dayjs(startDate);
    if (!start.isValid()) return "";
    const now = dayjs();
    const years = now.diff(start, "year");
    const months = now.diff(start.add(years, "year"), "month");
    if (years === 0 && months === 0) return "น้อยกว่า 1 เดือน";
    if (years === 0) return `${months} เดือน`;
    if (months === 0) return `${years} ปี`;
    return `${years} ปี ${months} เดือน`;
  };

  //   const onChangeDate = (key: string, value: any) => {
  //     const newForm = {
  //       ...form,
  //       [key]: value,
  //     };
  //     returnForm(newForm);
  //   };

  const onChangeDate = (key: string, value: any) => {
    const formattedValue =
      value && dayjs(value).isValid()
        ? dayjs(value).format("YYYY-MM-DD") // หรือ 'YYYY-MM-DD HH:mm:ss' ถ้าเป็น DateTime
        : null;

    const newForm = {
      ...form,
      [key]: formattedValue,
    };

    returnForm(newForm);
  };

  return (
    <>
      <div className="flex flex-wrap py-3">
        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full  px-3 mb-3">
            <p className="mb-1">ชื่อผู้ใช้งาน</p>
            <TextField
              name="username"
              value={form.username}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled || isDisabledUsername}
            />
          </div>
        </div>

        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">คำนำหน้าชื่อ</p>
            <TextField
              name="title"
              value={form.title}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">ชื่อ</p>
            <TextField
              name="firstname"
              value={form.firstname}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">สกุล</p>
            <TextField
              name="surname"
              value={form.surname}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เพศ</p>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                value={form.sex}
                name="sex"
                onChange={onChangeFormCard}
              >
                <FormControlLabel value="ชาย" control={<Radio />} label="ชาย" />
                <FormControlLabel
                  value="หญิง"
                  control={<Radio />}
                  label="หญิง"
                />
                {/* <FormControlLabel
                value="หม้าย"
                control={<Radio />}
                label="หม้าย"
              /> */}
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">วันเกิด</p>
            <DateTimePicker
              // disablePast
              name="birthday"
              // value={form.birthday}
              onChange={(newValue) => onChangeDate("birthday", newValue)}
              className="w-full"
              value={dayjs(form.birthday)}
              views={["year", "month", "day"]}
              disabled={isDisabled}
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

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เลขที่บัตรประชาชน</p>
            <TextField
              name="idCardNumber"
              value={form.idCardNumber}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-3/5 basis-full px-3 mb-3">
            <p className="mb-1">ที่อยู่</p>
            <TextField
              name="address"
              value={form.address}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>
        </div>

        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เบอร์ติดต่อ</p>
            <TextField
              name="phone"
              value={form.phone}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">สัญชาติ</p>
            <TextField
              name="nationality"
              value={form.nationality}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เชื้อชาติ</p>
            <TextField
              name="ethnicity"
              value={form.ethnicity}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">สถานะ</p>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                value={form.statusUser}
                name="statusUser"
                onChange={onChangeFormCard}
              >
                <FormControlLabel value="โสด" control={<Radio />} label="โสด" />
                <FormControlLabel
                  value="สมรส"
                  control={<Radio />}
                  label="สมรส"
                />
                {/* <FormControlLabel
                value="หม้าย"
                control={<Radio />}
                label="หม้าย"
              /> */}
              </RadioGroup>
            </FormControl>
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">กรุ๊ปเลือด</p>
            <TextField
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* <div className="basis-full flex flex-wrap">
          
        </div> */}

        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">ตำแหน่งการทำงาน</p>
            <Select
              fullWidth
              disabled={isDisabled}
              value={form.statusWork}
              name="statusWork"
              onChange={onChangeFormCard}
            >
              {ddl.statusWork.map((item, index) => (
                <MenuItem key={"statusWork" + index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">ตำแหน่งงานปัจจุบัน</p>
            <Select
              fullWidth
              disabled={isDisabled || isDisablePosition}
              value={form.position}
              name="position"
              onChange={onChangeFormCard}
            >
              {ddl.position.map((item, index) => (
                <MenuItem key={"position" + index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </div>

          {(form.position === "ครู" ||
            form.position === "ลูกจ้างชั่วคราว" ||
            form.position === "ครูผู้ช่วย") && (
            <>
              <div className="lg:basis-1/5 basis-full px-3 mb-3">
                <p className="mb-1">กลุ่มสาระที่สอน</p>
                <TextField
                  name="subjects"
                  value={form.subjects}
                  onChange={onChangeFormCard}
                  size="small"
                  fullWidth
                  autoComplete="off"
                  disabled={isDisabled}
                />
              </div>

              <div className="lg:basis-1/5 basis-full px-3 mb-3">
                <p className="mb-1">สอนช่วงชั้น</p>
                <TextField
                  name="class"
                  value={form.class}
                  onChange={onChangeFormCard}
                  size="small"
                  fullWidth
                  autoComplete="off"
                  disabled={isDisabled}
                />
              </div>
            </>
          )}

          {form.position === "หัวหน้ากลุ่มสาระ" && (
            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">หัวหน้ากลุ่มสาระ</p>
              <TextField
                name="subjectGroupLeader"
                value={form.subjectGroupLeader}
                onChange={onChangeFormCard}
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>
          )}

          {form.position === "หัวหน้าฝ่ายงาน" && (
            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">หัวหน้าฝ่ายงาน</p>
              <Select
                fullWidth
                disabled={isDisabled}
                value={form.headWorkDepartment}
                name="headWorkDepartment"
                onChange={onChangeFormCard}
              >
                {ddl.deputy.map((item, index) => (
                  <MenuItem key={"deputy12" + index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          {form.position === "รองผู้อำนวยการ" && (
            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">รองผู้อำนวยการฝ่ายงาน</p>
              <Select
                fullWidth
                disabled={isDisabled}
                value={form.deputyDirector}
                name="deputyDirector"
                onChange={onChangeFormCard}
              >
                {ddl.deputy.map((item, index) => (
                  <MenuItem key={"deputy" + index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          {form.statusWork === "ข้าราชการ" && (
            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">วิทยฐานะ</p>
              <Select
                fullWidth
                disabled={isDisabled}
                value={form.academicStanding ?? ""}
                name="academicStanding"
                onChange={onChangeFormCard}
              >
                {ddl.academicStanding.map((item, index) => (
                  <MenuItem key={"academicStanding" + index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">วันเริ่มราชการ</p>
            <DateTimePicker
              // disablePast
              name="yearServiceStartDate"
              onChange={(newValue) =>
                onChangeDate("yearServiceStartDate", newValue)
              }
              className="w-full"
              value={dayjs(form.yearServiceStartDate)}
              views={["year", "month", "day"]}
              disabled={isDisabled}
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

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">อายุราชการ</p>
            <TextField
              name="yearService"
              value={calcYearService(form.yearServiceStartDate)}
              size="small"
              fullWidth
              autoComplete="off"
              disabled
            />
          </div>
        </div>


        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เลขที่ใบประกอบวิชาชีพครู</p>
            <TextField
              name="professionalLicenseNo"
              value={form.professionalLicenseNo}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">วันหมดอายุ</p>
            <DateTimePicker
              // disablePast
              name="professionalLicenseEndDate"
              onChange={(newValue) =>
                onChangeDate("professionalLicenseEndDate", newValue)
              }
              className="w-full"
              value={dayjs(form.professionalLicenseEndDate)}
              views={["year", "month", "day"]}
              disabled={isDisabled}
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
        </div>

        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เลขที่ใบประกอบวิชาชีพผู้บริหาร</p>
            <TextField
              name="administratorLicenseNo"
              value={form.administratorLicenseNo ?? ""}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">วันหมดอายุ</p>
            <DateTimePicker
              // disablePast
              name="administratorLicenseEndDate"
              onChange={(newValue) =>
                onChangeDate("administratorLicenseEndDate", newValue)
              }
              className="w-full"
              value={dayjs(form.administratorLicenseEndDate)}
              views={["year", "month", "day"]}
              disabled={isDisabled}
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
        </div>
        <div className="basis-full flex flex-wrap">
          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">เลขที่ใบประกอบวิชาชีพศึกษานิเทศก์</p>
            <TextField
              name="supervisorLicenseNo"
              value={form.supervisorLicenseNo ?? ""}
              onChange={onChangeFormCard}
              size="small"
              fullWidth
              autoComplete="off"
              disabled={isDisabled}
            />
          </div>

          <div className="lg:basis-1/5 basis-full px-3 mb-3">
            <p className="mb-1">วันหมดอายุ</p>
            <DateTimePicker
              // disablePast
              name="supervisorLicenseEndDate"
              onChange={(newValue) =>
                onChangeDate("supervisorLicenseEndDate", newValue)
              }
              className="w-full"
              value={dayjs(form.supervisorLicenseEndDate)}
              views={["year", "month", "day"]}
              disabled={isDisabled}
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
        </div>
        
      </div>
    </>
  );
};

export default CardInformation;
