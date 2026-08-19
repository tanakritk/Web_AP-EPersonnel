import AccordionCustom from "@/components/Accordion-Custom";
import TabAction, { TabValueProps } from "@/components/tab-action";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import CardInformation from "./card-information";
import CardMate from "./card-mate";
import CardChild from "./card-child";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BaseSearchModel } from "@/api/interface";
import _MasterUserApi, {
  MasterUserRelationModel,
  MateAndChildModel,
} from "@/api/controller/master-user";
import { useLoading } from "@/context/loading-context";
import { useAlert } from "@/context/alert-context";
import { useParams } from "react-router-dom";
import { getLoginStorage } from "@/helpers/set-storage";
import omit from "lodash/omit";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";

const profile = getLoginStorage()?.profile;
const idEmp = encodeURIComponent(CryptoHelper.encrypt(profile?.id));
const tabValue: TabValueProps[] = [
  {
    label: "ข้อมูลส่วนตัว",
    path: `/personnel-info/information/${idEmp}`,
    action: true,
  },
  {
    label: "ประวัติการศึกษา",
    path: `/personnel-info/education/${idEmp}`,
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

const PagePersonnelInformation = (): JSX.Element => {
  const isDisabled = false;
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const params = useParams();
  const id = Number(
    decodeURIComponent(CryptoHelper.decrypt(String(params?.id))),
  );
  const queryClient = useQueryClient();
  const [form, setForm] = useState<MasterUserRelationModel>({
    username: "",
    password: "",
    title: "",
    firstname: "",
    surname: "",
    address: "",
    idCardNumber: "",
    phone: "",
    nationality: "",
    ethnicity: "",
    birthday: "",
    statusUser: "",
    bloodGroup: "",
    position: "",
    statusWork: "",
    professionalLicenseNo: "",
    professionalLicenseEndDate: "",
    administratorLicenseNo: "",
    administratorLicenseEndDate: "",
    supervisorLicenseNo: "",
    supervisorLicenseEndDate: "",
    yearService: "",
    subjects: "",
    isActive: true,
    isRefactorPassword: false,
    class: "",
    subjectGroupLeader: "",
    headWorkDepartment: "",
    deputyDirector: "",
    sex: "",
    mate: {
      //   title: "",
      //   firstname: "",
      //   surname: "",
      //   address: "",
      //   idCardNumber: "",
      //   phone: "",
      //   nationality: "",
      //   ethnicity: "",
    },
    child: [
      {
        title: "",
        firstname: "",
        surname: "",
        address: "",
        idCardNumber: "",
        phone: "",
        nationality: "",
        ethnicity: "",
      },
      {
        title: "",
        firstname: "",
        surname: "",
        address: "",
        idCardNumber: "",
        phone: "",
        nationality: "",
        ethnicity: "",
      },
      {
        title: "",
        firstname: "",
        surname: "",
        address: "",
        idCardNumber: "",
        phone: "",
        nationality: "",
        ethnicity: "",
      },
      {
        title: "",
        firstname: "",
        surname: "",
        address: "",
        idCardNumber: "",
        phone: "",
        nationality: "",
        ethnicity: "",
      },
      {
        title: "",
        firstname: "",
        surname: "",
        address: "",
        idCardNumber: "",
        phone: "",
        nationality: "",
        ethnicity: "",
      },
    ],
  });

  const onLoadData = async () => {
    const payload: BaseSearchModel = {
      page: 1,
      limit: 10,
      filterOperator: "and",
      relation: ["mate", "child"],
      filter: [
        {
          field: "id",
          operator: "=",
          value: id,
        },
      ],
    };
    try {
      setLoadingContext(true);
      const result = await _MasterUserApi().search(payload);
      if (result.statusCode === 200) {
        const tempData = result.data[0];
        const mapChild = form?.child?.map((item: any, index: number) => {
          if (tempData?.child[index]) {
            return { ...tempData.child[index] };
          } else {
            return { ...item };
          }
        });
        setForm({
          ...tempData,
          mate: tempData?.mate || {},
          child: mapChild || [],
        });
      }
    } catch (e: any) {
      setAlertContext({ type: "warning", message: e.message });
    } finally {
      setLoadingContext(false);
    }
  };

  useEffect(() => {
    onLoadData();
  }, [id]);

  const { mutate: actionSave, isPending: isLoadingActionSave } = useMutation({
    mutationFn: async (payload: MasterUserRelationModel) => {
      const newData = omit(payload, [
        "createdDate",
        "updatedDate",
        "deletedDate",
        "id",
        "no",
      ]);
      const newChild = newData.child?.map((item: any) => {
        const { createdDate, updatedDate, deletedDate, ...resp } = item;
        return resp;
      });
      const newMate = omit(newData.mate, [
        "createdDate",
        "updatedDate",
        "deletedDate",
      ]);
      const newPayload = {
        ...newData,
        mate: newMate,
        child: newChild,
      };
      return await _MasterUserApi().updateRelation(Number(id), newPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel-list"] });
      queryClient.invalidateQueries({ queryKey: ["ddl"] });
      setAlertContext({ type: "success", message: "บันทึกสําเร็จ" });
    },
    onSettled: () => {
      setLoadingContext(false);
    },
  });

  const onValidate = (payload: MasterUserRelationModel): string => {
    const idCardRegex = /^\d{13}$/;
    const phoneRegex = /^0\d{8,9}$/;

    // ข้อมูลส่วนตัว
    if (!payload.username) return "กรุณากรอกชื่อผู้ใช้งาน";
    if (!payload.title) return "กรุณากรอกคำนำหน้าชื่อ";
    if (!payload.firstname) return "กรุณากรอกชื่อ";
    if (!payload.surname) return "กรุณากรอกนามสกุล";
    if (!payload.birthday) return "กรุณากรอกวันเกิด";
    if (!payload.idCardNumber) return "กรุณากรอกเลขบัตรประชาชน";
    if (!idCardRegex.test(payload.idCardNumber))
      return "กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก และต้องเป็นตัวเลขเท่านั้น";
    if (!payload.phone) return "กรุณากรอกเบอร์ติดต่อ";
    if (!phoneRegex.test(payload.phone))
      return "กรุณากรอกเบอร์ติดต่อให้ถูกต้อง (เช่น 0812345678)";
    if (!payload.statusUser) return "กรุณาเลือกสถานะ";
    if (!payload.statusWork) return "กรุณาเลือกตำแหน่งการทำงาน";
    if (!payload.position) return "กรุณาเลือกตำแหน่งงานปัจจุบัน";

    // ข้อมูลคู่สมรส
    if (payload.statusUser === "สมรส") {
      if (
        !payload.mate?.title ||
        !payload.mate?.firstname ||
        !payload.mate?.surname
      ) {
        return "กรุณากรอกข้อมูลคู่สมรสให้ครบถ้วน (คำนำหน้า, ชื่อ, นามสกุล)";
      }
      if (
        payload.mate?.idCardNumber &&
        !idCardRegex.test(payload.mate.idCardNumber)
      ) {
        return "กรุณากรอกเลขบัตรประชาชนคู่สมรสให้ถูกต้อง (13 หลัก)";
      }
      if (payload.mate?.phone && !phoneRegex.test(payload.mate.phone)) {
        return "กรุณากรอกเบอร์ติดต่อคู่สมรสให้ถูกต้อง";
      }
    }

    // ข้อมูลบุตร
    if (payload.child && payload.child.length > 0) {
      for (let i = 0; i < payload.child.length; i++) {
        const child = payload.child[i];
        // ถ้ามีการกรอกชื่อหรือนามสกุล ต้องกรอกให้ครบทั้ง 3 อย่าง
        if (child.firstname || child.surname) {
          if (!child.title || !child.firstname || !child.surname) {
            return `กรุณากรอกข้อมูลบุตรคนที่ ${i + 1} ให้ครบถ้วน (คำนำหน้า, ชื่อ, นามสกุล)`;
          }
          if (child.idCardNumber && !idCardRegex.test(child.idCardNumber)) {
            return `กรุณากรอกเลขบัตรประชาชนของบุตรคนที่ ${i + 1} ให้ถูกต้อง (13 หลัก)`;
          }
          if (child.phone && !phoneRegex.test(child.phone)) {
            return `กรุณากรอกเบอร์ติดต่อของบุตรคนที่ ${i + 1} ให้ถูกต้อง`;
          }
        }
      }
    }

    return "";
  };

  const onClickSave = () => {
    const filterChild = form.child?.filter(
      (item) => item.firstname !== "" && item.surname !== "",
    );
    let payload = {
      ...form,
      child: filterChild,
    };

    const errorMessage = onValidate(payload);
    if (errorMessage) {
      setAlertContext({ type: "warning", message: errorMessage });
      return;
    }

    actionSave(payload);
  };

  useEffect(() => {
    const isAnyLoading = isLoadingActionSave;
    setLoadingContext(isAnyLoading);
  }, [setLoadingContext, isLoadingActionSave]);

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
                    borderColor: "primary.main", // กำหนดสีเส้น (ชมพู) เฉพาะที่เส้นก่อนและหลังตัวหนังสือ
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
          <AccordionCustom title="ข้อมูลส่วนตัว" defaultExpanded>
            <CardInformation
              form={form}
              returnForm={(newData) => setForm({ ...newData })}
              isDisabled={isDisabled}
            />
          </AccordionCustom>

          {form.statusUser === "สมรส" && (
            <AccordionCustom title="คู่สมรส" defaultExpanded>
              <CardMate
                form={form.mate as MateAndChildModel}
                returnForm={(newData) => setForm({ ...form, mate: newData })}
                isDisabled={isDisabled}
              />
            </AccordionCustom>
          )}

          <AccordionCustom title="บุตร" defaultExpanded>
            <CardChild
              form={form.child as MateAndChildModel[]}
              returnForm={(newData) => setForm({ ...form, child: newData })}
              isDisabled={isDisabled}
            />
          </AccordionCustom>

          <div
            className="flex justify-end space-x-3"
            style={{ marginTop: "60px" }}
          >
            <Button variant="contained" onClick={onClickSave}>
              บันทึกข้อมูล
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* <TabAction tabValue={tabValue}></TabAction> */}
    </ContentLayout>
  );
};

export default PagePersonnelInformation;
