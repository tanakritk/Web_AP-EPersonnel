import AccordionCustom from "@/components/Accordion-Custom";
import TabAction, { TabValueProps } from "@/components/tab-action";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import { getLoginStorage } from "@/helpers/set-storage";
import ContentLayout from "@/layout/content-layout";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import _EducationApi, { EducationModel } from "@/api/controller/education";
import { useLoading } from "@/context/loading-context";
import { useAlert } from "@/context/alert-context";
import { BaseSearchModel } from "@/api/interface";
import { omit } from "lodash";
import useConfirm from "@/components/drawer-confirm";

const profile = getLoginStorage()?.profile;
const idEmp = encodeURIComponent(CryptoHelper.encrypt(profile?.id));
const tabValue: TabValueProps[] = [
  { label: "ข้อมูลส่วนตัว", path: `/personnel-info/information/${idEmp}` },
  {
    label: "ประวัติการศึกษา",
    path: `/personnel-info/education/${idEmp}`,
    action: true,
  },
  {
    label: "ประวัติการรับเครื่องราชอิสริยาภรณ์",
    path: `/personnel-info/insignia/${idEmp}`,
  },
  {
    label: "ประวัติการเลื่อนวิทยฐานะ",
    path: `/personnel-info/academic/${idEmp}`,
  },
];

const PagePersonalEducation = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const params = useParams();
  const userId = Number(
    decodeURIComponent(CryptoHelper.decrypt(String(params?.id))),
  );
  const isDisabled = false;
  const [listEdu, setListEdu] = useState<EducationModel[]>([]);
  const [confirm, confirmDialog] = useConfirm();

  const ddlLevel = [
    "มัธยมปลาย",
    "ปวช.",
    "ปวส.",
    "ปริญญาตรี",
    "ปริญญาโท",
    "ปริญญาเอก",
  ];

  const onLoadData = async () => {
    const payload: BaseSearchModel = {
      page: 1,
      limit: 100,
      filterOperator: "and",
      filter: [
        {
          field: "mas_user.id",
          operator: "=",
          value: userId,
        },
      ],
      sorting: [{ field: "id", pattern: "ASC" }],
    };
    try {
      setLoadingContext(true);
      const result = await _EducationApi().search(payload);
      if (result.statusCode === 200) {
        setListEdu(result.data);
      }
    } catch (e: any) {
      setAlertContext({ type: "warning", message: e.message });
    } finally {
      setLoadingContext(false);
    }
  };

  useEffect(() => {
    onLoadData();
  }, [userId]);

  const onChangeForm = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => {
    const { name, value } = event.target;
    const newList = [...listEdu];
    newList[index] = { ...newList[index], [name]: value };
    setListEdu(newList);
  };

  const onClickAdd = () => {
    setListEdu([
      ...listEdu,
      {
        level: "",
        location: "",
        branch: "",
        endYear: "",
        grage: "",
        userId: userId,
      },
    ]);
  };

  const onClickSave = async (index: number) => {
    const data = listEdu[index];
    if (!data.level || !data.location || !data.branch || !data.endYear || !data.grage) {
      setAlertContext({
        type: "warning",
        message: "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง",
      });
      return;
    }

    try {
      setLoadingContext(true);
      let result;
      if (data.id) {
        const payload = omit(data, ["createdDate", "updatedDate", "deletedDate", "no", "id"]);
        result = await _EducationApi().update(data.id, payload);
      } else {
        result = await _EducationApi().create(data);
      }

      if (result.statusCode === 200) {
        setAlertContext({ type: "success", message: "บันทึกสําเร็จ" });
        onLoadData();
      }
    } catch (e: any) {
      setAlertContext({ type: "warning", message: e.message });
    } finally {
      setLoadingContext(false);
    }
  };

  const onClickDelete = async (index: number) => {
    const data = listEdu[index];
    if (!data.id) {
      const newList = listEdu.filter((_, i) => i !== index);
      setListEdu(newList);
      return;
    }

    if (!(await confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?"))) return;

    try {
      setLoadingContext(true);
      const result = await _EducationApi().delete(data.id);
      if (result.statusCode === 200) {
        setAlertContext({ type: "success", message: "ลบข้อมูลสําเร็จ" });
        onLoadData();
      }
    } catch (e: any) {
      setAlertContext({ type: "warning", message: e.message });
    } finally {
      setLoadingContext(false);
    }
  };

  return (
    <ContentLayout titlePage="" breadcrumbList={[]}>
      <Card>
        <CardHeader
          title={
            <Box>
              <Divider
                className="text-[22px] font-bold"
                textAlign="left"
                sx={{
                  mb: 2,
                  "&::before, &::after": {
                    borderColor: "primary.main",
                  },
                }}
              >
                ข้อมูลส่วนตัว
              </Divider>
              <div className="pr-20">
                <TabAction tabValue={tabValue} />
              </div>
            </Box>
          }
        />

        <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
          <AccordionCustom title="ประวัติการศึกษา" defaultExpanded>
            <div className="w-full flex flex-col items-center justify-center lg:px-10 px-2 lg:py-10 py-5">
              {listEdu.map((item, index) => (
                <div key={"EDU" + index} className="lg:w-2/4 w-full">
                  <div className="bg-white shadow p-4 rounded-lg">
                    <Divider
                      className="text-[16px]"
                      textAlign="left"
                      sx={{
                        mb: 2,
                        "&::before, &::after": {
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      ลำดับที่ {index + 1}
                    </Divider>
                    <div className="flex flex-wrap ">
                      <div className="basis-full px-3 mb-3">
                        <p className="mb-1">ระดับการศึกษา <span className="text-red-500">*</span></p>
                        <Select
                          fullWidth
                          size="small"
                          name="level"
                          value={item.level || ""}
                          onChange={(e) => onChangeForm(index, e)}
                          disabled={isDisabled}
                        >
                          {ddlLevel.map((lvl) => (
                            <MenuItem key={lvl} value={lvl}>
                              {lvl}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>

                      <div className="basis-full px-3 mb-3">
                        <p className="mb-1">สถานศึกษา <span className="text-red-500">*</span></p>
                        <TextField
                          name="location"
                          value={item.location || ""}
                          onChange={(e) => onChangeForm(index, e)}
                          size="small"
                          fullWidth
                          autoComplete="off"
                          disabled={isDisabled}
                        />
                      </div>

                      <div className="basis-full px-3 mb-3">
                        <p className="mb-1">สาขา / วิชาเอก <span className="text-red-500">*</span></p>
                        <TextField
                          name="branch"
                          value={item.branch || ""}
                          onChange={(e) => onChangeForm(index, e)}
                          size="small"
                          fullWidth
                          autoComplete="off"
                          disabled={isDisabled}
                        />
                      </div>

                      <div className="basis-1/2 px-3 mb-3">
                        <p className="mb-1">ปีที่สำเร็จการศึกษา <span className="text-red-500">*</span></p>
                        <TextField
                          name="endYear"
                          value={item.endYear || ""}
                          onChange={(e) => onChangeForm(index, e)}
                          size="small"
                          type="number"
                          fullWidth
                          autoComplete="off"
                          disabled={isDisabled}
                        />
                      </div>
                      <div className="basis-1/2 px-3 mb-3">
                        <p className="mb-1">เกรดเฉลี่ย <span className="text-red-500">*</span></p>
                        <TextField
                          name="grage"
                          value={item.grage || ""}
                          onChange={(e) => onChangeForm(index, e)}
                          size="small"
                          type="number"
                          fullWidth
                          autoComplete="off"
                          disabled={isDisabled}
                        />
                      </div>
                    </div>

                    {!isDisabled && (
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => onClickDelete(index)}
                        >
                          ลบ
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => onClickSave(index)}
                        >
                          บันทึก
                        </Button>
                      </div>
                    )}
                  </div>

                  <Box
                    sx={{
                      mt: 3,
                      mb: 3,
                      borderBottom: "2px solid",
                      borderColor: "primary.main",
                      borderRadius: "2px",
                      width: "100%",
                      marginX: "auto",
                    }}
                  />
                </div>
              ))}

              {!isDisabled && (
                <div className="flex justify-start">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onClickAdd}
                  >
                    เพิ่มประวัติการศึกษา
                  </Button>
                </div>
              )}
            </div>
          </AccordionCustom>
        </CardContent>
      </Card>
      {confirmDialog}
    </ContentLayout>
  );
};

export default PagePersonalEducation;
