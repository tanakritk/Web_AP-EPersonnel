import AccordionCustom from "@/components/Accordion-Custom";
import ContentLayout from "@/layout/content-layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useNavigate, useParams } from "react-router-dom";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BaseSearchModel } from "@/api/interface";
import _SystemApi from "@/api/controller/system";
import { useEffect, useMemo, useState } from "react";
import { useLoading } from "@/context/loading-context";
import _AttendenceApi, { AttendenceModel } from "@/api/controller/attendence";
import { getDistance, isPointWithinRadius } from "geolib";
import { useAlert } from "@/context/alert-context";

const PageCheckInCheckOut = (): JSX.Element => {
  const { setLoadingContext } = useLoading();
  const { setAlertContext } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const id = decodeURIComponent(CryptoHelper.decrypt(params.id || ""));
  const [state, setState] = useState<"checkIn" | "checkOut">("checkIn");
  const [status, setStatus] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [now, setNow] = useState(dayjs());

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: systemData, isLoading: isLoadingSystem } = useQuery({
    queryKey: ["system", id],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: 1,
        limit: 100,
        filterOperator: "and",
        filter: [],
      };
      const result = await _SystemApi().search(payload);
      const location = result.data.find((item: any) => item.id === 1);
      const limitLocation = result.data.find((item: any) => item.id === 2);
      const timeStart = result.data.find((item: any) => item.id === 3);
      const timeEnd = result.data.find((item: any) => item.id === 4);
      return {
        location: location?.value,
        lomitLocation: limitLocation?.value,
        timeStart: timeStart?.value,
        timeEnd: timeEnd?.value,
      };
    },
  });

  const { data: attendenceData, isLoading: isLoadingAttendence } = useQuery({
    queryKey: ["checkin-checkout", id, dayjs().format("DD/MM/BBBB")],
    queryFn: async () => {
      const payload: BaseSearchModel = {
        page: 1,
        limit: 1,
        filterOperator: "and",
        filter: [
          {
            field: "attendanceDate",
            operator: "=",
            value: dayjs().format("YYYY-MM-DD"),
          },
          {
            field: "mas_user.id",
            operator: "=",
            value: Number(id),
          },
        ],
      };
      const result = await _AttendenceApi().search(payload);
      return result.data;
    },
  });

  const { mutate: onAction, isPending: isLoadingAction } = useMutation({
    mutationFn: async ({
      stateAction,
      body,
    }: {
      stateAction: "create" | "update";
      body: AttendenceModel;
    }) => {
      if (stateAction === "create") {
        return await _AttendenceApi().create(body);
      } else {
        return await _AttendenceApi().update(attendenceData[0].id, body);
      }
    },
    onSuccess: (data, variables) => {
      console.log(data, variables);
      setAlertContext({
        type: "success",
        message:
          variables.stateAction === "create"
            ? "บันทึกเวลาเข้างานสำเร็จ"
            : "บันทึกเวลาออกงานสำเร็จ",
      });
      queryClient.invalidateQueries({
        queryKey: ["checkin-checkout", id, dayjs().format("DD/MM/BBBB")],
      });
    },
    onError: () => {
      setAlertContext({
        type: "warning",
        message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
      });
      setLoadingContext(false);
    },
    onSettled: () => {
      setLoadingContext(false);
    },
  });

  // const calCurentTime = () => {
  //   const timeStart = systemData?.timeStart;
  //   const timeEnd = systemData?.timeEnd;
  //   const timeNow = dayjs().format("HH:mm");
  //   return `${timeStart} - ${timeEnd}`;
  // };

  const workingMinutes = useMemo(() => {
    if (!attendenceData || attendenceData.length === 0) {
      return 0;
    }

    const tempData: AttendenceModel = attendenceData[0];
    if (!tempData.checkInTime) {
      return 0;
    }

    const checkIn = dayjs(tempData.checkInTime);
    const checkOut = tempData.checkOutTime ? dayjs(tempData.checkOutTime) : now;

    return Math.max(0, checkOut.diff(checkIn, "minute"));
  }, [attendenceData, now]);

  const calWorkingTime = useMemo(() => {
    const hours = Math.floor(workingMinutes / 60);
    const minutes = workingMinutes % 60;
    return `${hours} ชม. ${minutes} น.`;
  }, [workingMinutes]);

  const gaugeValue = useMemo(() => {
    if (!systemData?.timeStart || !systemData?.timeEnd) return 0;

    const [startH, startM] = systemData.timeStart.split(":");
    const [endH, endM] = systemData.timeEnd.split(":");

    const startD = dayjs()
      .hour(Number(startH))
      .minute(Number(startM))
      .second(0);
    const endD = dayjs().hour(Number(endH)).minute(Number(endM)).second(0);

    const totalMinutes = endD.diff(startD, "minute");
    if (totalMinutes <= 0) return 0;

    const percentage = (workingMinutes / totalMinutes) * 100;
    return percentage > 100 ? 100 : Math.round(percentage);
  }, [systemData, workingMinutes]);

  const calCurentTime = useMemo(() => {
    if (state === "checkIn") {
      return (
        <span className="text-md font-semibold">ยังไม่มีการบันทึกการทำงาน</span>
      );
    } else if (state === "checkOut") {
      const tempData: AttendenceModel = attendenceData[0];
      const checkin = dayjs(tempData.checkInTime).format("HH:mm");
      const checkout = tempData.checkOutTime
        ? dayjs(tempData.checkOutTime).format("HH:mm")
        : "ปัจจุบัน";
      return (
        <span className="text-3xl font-semibold">
          {checkin} - {checkout}
        </span>
      );
    }
    return;
  }, [state, attendenceData]);

  useEffect(() => {
    if (attendenceData?.length > 0) {
      // มีการลงเวลาไปเเล้ว 1 รอบ
      const tempData: AttendenceModel = attendenceData[0];
      if (tempData.checkInTime && !tempData.checkOutTime) {
        // ลงชื่อเข้างานเเล้ว เเต่ยังไม่ลงชื่อออกงาน
        setState("checkOut");
      } else if (tempData.checkInTime && tempData.checkOutTime) {
        // ลงชื่อเข้างานเเล้ว ออกงานเเล้ว
        setState("checkOut");
      }
    } else {
      // ยังไม่เคยมีการลงเวลา
      setState("checkIn");
    }
  }, [attendenceData]);

  const onValidateLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setLoadingLocation(true);
      setStatus("กำลังขอตำแหน่งจาก GPS...");

      if (!navigator.geolocation) {
        setStatus("เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง");
        setLoadingLocation(false);
        resolve(false);
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (accuracy > 50) {
            setStatus(
              `สัญญาณ GPS ไม่แม่นยำพอ (คลาดเคลื่อน ±${accuracy.toFixed(
                1,
              )} ม.) กรุณาลองใหม่อีกครั้ง`,
            );
            setLoadingLocation(false);
            resolve(false);
            return;
          }

          const currentLoc = { latitude, longitude };

          // ------------  master ------------- //
          let targetLat = 14.114947717073859;
          let targetLng = 100.59783268674421;
          let maxDistance = 300;

          if (systemData?.location) {
            const [lat, lng] = systemData.location.split(",");
            if (lat && lng) {
              targetLat = Number(lat.trim());
              targetLng = Number(lng.trim());
            }
          }

          if (systemData?.lomitLocation) {
            maxDistance = Number(systemData.lomitLocation);
          }
          // ---------------------------------- //

          const TARGET_LOCATION = {
            latitude: targetLat,
            longitude: targetLng,
          };

          const isInside: boolean = isPointWithinRadius(
            currentLoc,
            TARGET_LOCATION,
            maxDistance,
          );

          const distance = getDistance(currentLoc, TARGET_LOCATION);

          if (isInside) {
            setStatus(
              `✅ อยู่ในระยะที่กำหนด (${distance} เมตร) [Accuracy: ±${accuracy.toFixed(
                0,
              )}m]`,
            );
            setLoadingLocation(false);
            resolve(true);
          } else {
            setStatus(
              `❌ อยู่ห่างเกินไป (${distance} เมตร) [Accuracy: ±${accuracy.toFixed(
                0,
              )}m]`,
            );
            setLoadingLocation(false);
            resolve(false);
          }
        },
        (error: GeolocationPositionError) => {
          setStatus(`ข้อผิดพลาด: ${error.message}`);
          setLoadingLocation(false);
          resolve(false);
        },
        options,
      );
    });
  };

  const onCllickCheckIn = async () => {
    const isPass = await onValidateLocation();
    if (!isPass) {
      return;
    }

    const payload: AttendenceModel = {
      attendanceDate: dayjs().format("YYYY-MM-DD"),
      checkInTime: dayjs().format("YYYY-MM-DD HH:mm"),
      // status: "ปกติ",
      userId: Number(id),
    };
    onAction({ stateAction: "create", body: payload });
  };

  const onCllickCheckOut = async () => {
    const isPass = await onValidateLocation();
    if (!isPass) {
      return;
    }

    const payload: AttendenceModel = {
      checkOutTime: dayjs().format("YYYY-MM-DD HH:mm"),
    };
    onAction({ stateAction: "update", body: payload });
  };

  useEffect(() => {
    const finalLoading =
      isLoadingSystem || isLoadingAttendence || isLoadingAction;
    setLoadingContext(finalLoading);
  }, [
    setLoadingContext,
    isLoadingSystem,
    isLoadingAttendence,
    isLoadingAction,
  ]);
  return (
    <>
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
                  ลงชื่อเข้างาน - ออกงาน
                </Divider>
                {/* <div className="pr-20">
                  <TabAction tabValue={tabValue} />
                </div> */}
              </Box>
            }
          />

          <CardContent sx={{ marginLeft: 1 }} className="space-y-10">
            <AccordionCustom title="ลงชื่อ เข้างาน - ออกงาน" defaultExpanded>
              <div className="flex justify-end mt-3">
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(
                      `/checkin-checkout-history/${encodeURIComponent(CryptoHelper.encrypt(id))}`,
                    )
                  }
                >
                  ประวัติการเข้า-ออกงาน
                </Button>
              </div>
              <div className="w-full flex flex-col items-center justify-center lg:px-10 px-2 lg:py-10 py-5">
                <div className="bg-white shadow  p-4 rounded-lg lg:w-2/4 w-full ">
                  <div className="flex flex-col lg:flex-row lg:justiby-between justify-start">
                    <div className="flex flex-col space-y-10 w-full">
                      <span className="font-semibold">
                        {dayjs().format("DD/MM/BBBB")}
                      </span>
                      {calCurentTime}
                    </div>
                    <div className="flex justify-end flex-col">
                      <Gauge
                        width={200}
                        height={200}
                        value={gaugeValue} // Percent
                        cornerRadius="50%"
                        // text={({ value, valueMax }) => `${value} / ${valueMax}`}
                        text={() => calWorkingTime}
                        sx={() => ({
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 20,
                          },
                        })}
                      />
                    </div>
                  </div>
                  {isMobile ? (
                    <div className="basis-full mt-6 space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 flex lg:flex-row flex-col">
                      <Button
                        className="mb-3"
                        variant="contained"
                        disabled={state === "checkOut" || loadingLocation}
                        onClick={onCllickCheckIn}
                      >
                        {loadingLocation
                          ? "กำลังตรวจสอบ..."
                          : "ลงบันทึกเวลาเข้างาน"}
                      </Button>
                      <Button
                        variant="outlined"
                        disabled={state === "checkIn"}
                        onClick={onCllickCheckOut}
                      >
                        {loadingLocation
                          ? "กำลังตรวจสอบ..."
                          : "ลงบันทึกเวลาออกงาน"}
                      </Button>
                    </div>
                  ) : (
                    <div className="basis-full mt-6 justify-center flex">
                      <span className="text-red-500 font-semibold text-lg text-center">
                        ระบบรองรับการลงชื่อเข้า-ออกงานผ่านโทรศัพท์เท่านั้น
                      </span>
                    </div>
                  )}
                  {status && (
                    <div className="mt-4 text-center font-bold text-lg text-gray-700">
                      {status}
                    </div>
                  )}
                </div>
                <span className="text-red-500 mt-2">
                  หมายเหตุ : ช่วงเวลาทำงาน {systemData?.timeStart} -{" "}
                  {systemData?.timeEnd} น.
                </span>
              </div>
            </AccordionCustom>
          </CardContent>
        </Card>
      </ContentLayout>
    </>
  );
};

export default PageCheckInCheckOut;
