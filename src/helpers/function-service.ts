import dayjs from "dayjs";

const getBase64 = async (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
};

const base64toBlob = (base64Data: string) => {
  var byteString = window.atob(base64Data);
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var int8Array = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([int8Array], { type: "application/octet-stream" });
};

const isBase64 = (string: string) => {
  // Base64 validation regex
  const base64Regex =
    /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=)?$/i;

  // Check if the string is a valid Base64 encoded string
  return base64Regex.test(string);
};

const validateInputRequired = (form: any) => {
  for (let key in form) {
    // console.log("validateInputRequired--> ",form[] )
    if (form[key] == "") {
      // console.log("---> ", form[key])
      return false;
    }
  }

  return true;
};

const formatNumber = (num: string) => {
  return num?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const isoDateToLocalized = (isoDate: string | Date) => {
  const date = new Date(isoDate);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + 7; // เพิ่ม 7 ชั่วโมงสำหรับเขตเวลา GMT+7
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // นำค่าที่ได้ไปใช้กับ new Date()
  const localizedDate = new Date(year, month, day, hour, minute, second, 0);

  return localizedDate;
  // const utcDate = new Date(isoDate);
  // // เพิ่ม 7 ชั่วโมงในหน่วยมิลลิวินาที
  // const bangkokOffsetMs = 7 * 60 * 60 * 1000;
  // const localizedTimestamp = utcDate.getTime() + bangkokOffsetMs;
  // return new Date(localizedTimestamp);
};

const getWeekRange = (dateInput: string) => {
  const date = new Date(dateInput); // รับวันที่ที่ต้องการ (ในรูปแบบ YYYY-MM-DD)
  const day = date.getDay(); // 0 = วันอาทิตย์, 1 = วันจันทร์, ..., 6 = วันเสาร์

  // คำนวณวันอาทิตย์ (เริ่มต้นของสัปดาห์)
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);

  // คำนวณวันเสาร์ (สิ้นสุดของสัปดาห์)
  const saturday = new Date(date);
  saturday.setDate(date.getDate() + (7 - day));

  return {
    sunday: sunday.toISOString().split("T")[0], // แปลงเป็นรูปแบบ YYYY-MM-DD
    sundayNext: saturday.toISOString().split("T")[0],
  };
};

const getMimeTypeFromBase64 = (base64: string): string => {
  const match = base64.match(/^data:(.+);base64,/);
  return match ? match[1] : "application/octet-stream";
};

const createFileFromBase64WithMimeType = (
  base64: string,
  fileName: string,
): File => {
  // ใช้อันนี้ ครอบคลุมดี
  const mimeType = getMimeTypeFromBase64(base64);
  const base64WithoutPrefix = base64.split(",")[1];
  const binary = atob(base64WithoutPrefix);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], fileName, { type: mimeType });
};

const convertDateToBuddhist = (date: string) => {
  const buddhistDate = dayjs(date).add(543, "year");
  return buddhistDate.format("YYYY-MM-DD HH:mm:ss");
};

const convertDateToChristian = (date: string) => {
  const buddhistDate = dayjs(date).subtract(543, "year");
  return buddhistDate.format("YYYY-MM-DD HH:mm:ss");
};

const getDateRange = (startDate: string, endDate: string) => {
  let start = dayjs(startDate);
  const end = dayjs(endDate);
  const dateArray = [];

  while (start.isBefore(end) || start.isSame(end, "day")) {
    dateArray.push(start.format("YYYY-MM-DD"));
    start = start.add(1, "day"); // เพิ่มวันโดยไม่เปลี่ยนค่าของ start เดิม
  }

  return dateArray;
};

// const deCodeBase64OnURL = (url: string) => {
//     console.log("url--> ", url)
//     const urlParams: any = new URLSearchParams(url);
//     // const urlParams: any = url
//     console.log("urlParams--> ", urlParams)
//     const decodedData = window.atob(urlParams||'');
//     const paramsObj = Object.fromEntries(new URLSearchParams(decodedData));
//     return paramsObj
// }
const deCodeBase64OnURL = (url: string) => {
  // ตรวจสอบว่า URL มี query string หรือไม่
  const urlParams = new URLSearchParams(url);
  const encodedData = urlParams.entries().next().value?.[0] || ""; // ดึงค่า Base64 ตัวแรกที่เจอ
  if (!encodedData) {
    console.error("No Base64 data found in URL");
    return {};
  }
  try {
    // ถอดรหัส Base64
    const decodedData = window.atob(encodedData);
    // แปลงค่าเป็น Object
    const paramsObj = Object.fromEntries(new URLSearchParams(decodedData));
    return paramsObj;
  } catch (error) {
    console.error("Base64 decoding error:", error);
    return {}; // คืนค่าเป็น object ว่างถ้า error
  }
};

// const getRangeFiscalYear = () => {
//     const currentYear = new Date().getFullYear() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.
//     const startYear = Math.floor((currentYear - 2566) / 5) * 5 + 2566; // คำนวณจุดเริ่มต้น
//     return Array.from({ length: 5 }, (_, i) => (startYear + i).toString()); // สร้างอาร์เรย์
// }

// const getRangeFiscalYearDDL = () => {
//     const currentYear = new Date().getFullYear() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.
//   const startYear = Math.floor((currentYear - 2566) / 5) * 5 + 2566; // คำนวณปีเริ่มต้นของช่วง

//   return Array.from({ length: 5 }, (_, i) => {
//     const year = startYear + i;
//     return { label: `ปีงบประมาณ ${year}`, value: year.toString() };
//   });
// }

const fnDownloadFile = (file: any) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
};

export {
  deCodeBase64OnURL,
  getBase64,
  validateInputRequired,
  base64toBlob,
  isBase64,
  formatNumber,
  isoDateToLocalized,
  getWeekRange,
  createFileFromBase64WithMimeType,
  convertDateToBuddhist,
  convertDateToChristian,
  getDateRange,
  // getRangeFiscalYear,
  // getRangeFiscalYearDDL,
  fnDownloadFile,
};
