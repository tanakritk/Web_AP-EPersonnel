import PersonIcon from "@mui/icons-material/Person";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import { getLoginStorage } from "@/helpers/set-storage";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";

const menuItemFull = () => {
  // ผู้ดูแลระบบ
  const profile = getLoginStorage()?.profile;
  const idEmp = encodeURIComponent(CryptoHelper.encrypt(profile?.id));
  return [
    // { id: "0", label: "หน้าหลัก", icon: HomeOutlinedIcon, path: "/" },
    {
      id: "1",
      label: "ข้อมูลส่วนตัว",
      icon: PersonIcon,
      path: `/personnel-info/information/${idEmp}`,
      relatedPaths: [
        "/personnel-info/education",
        "/personnel-info/insignia",
        "/personnel-info/academic",
        "/personnel-info/documents",
        "/personnel-info/information",
      ],
    },
    {
      id: "2",
      label: "การจัดการเวลางาน",
      icon: AccessTimeFilledIcon,
      //   relatedPaths: [`/checkin-checkout`, `/checkin-checkout-history`],
      subMenu: [
        {
          id: "2.1",
          label: "ลงชื่อ เข้างาน-ออกงาน",
          icon: PermContactCalendarIcon,
          path: `/checkin-checkout/${idEmp}`,
          relatedPaths: [`/checkin-checkout`],
        },
        {
          id: "2.2",
          label: "ประวัติเวลาการเข้างาน-ออกงาน",
          icon: EventNoteIcon,
          path: `/checkin-checkout-history/${idEmp}`,
          relatedPaths: [`/checkin-checkout-history`],
        },
      ],
    },
    {
      id: "3",
      label: "การจัดการการลา",
      icon: ContactMailIcon,
      subMenu: [
        {
          id: "3.1",
          label: "ขอลา",
          icon: AssignmentIndIcon,
          path: `/leave-request/create/${idEmp}`,
          relatedPaths: [`/leave-request`],
        },
        {
          id: "3.2",
          label: "ประวัติการลา",
          icon: DateRangeIcon,
          path: `/leave-history/${idEmp}`,
          relatedPaths: [`/leave-history`, `/leave-request-detail`],
        },
      ],
    },
    {
      id: "4",
      label: "เอกสาร",
      icon: DescriptionIcon,
      path: `/documents/${idEmp}`,
      relatedPaths: [`/documents`],
    },

    {
      id: "8",
      label: "รายการขอลา(สำหรับผู้อนุมัติ)",
      icon: ContactMailIcon,
      path: "/leave-approve-list",
      relatedPaths: [`/leave-approve`],
    },

    { id: "000", label: "ผู้มีสิทธิ์" }, // Divider

    { id: "5", label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    {
      id: "6",
      label: "การจัดการข้อมูลบุคลากร",
      icon: PeopleIcon,
      path: "/personnel-admin-list",
    },
    {
      id: "7",
      label: "ประวัติเวลาการเข้างาน-ออกงาน ของบุคลากร",
      icon: AccessTimeFilledIcon,
      path: "/checkin-checkout-history-list",
    },
    {
      id: "9",
      label: "ประวัติการลา",
      icon: DateRangeIcon,
      path: "/leave-history-list",
      relatedPaths: [`/leave-history-list`, `/leave-detail`],
    },
  ];
};

const menuItemUser = () => {
  const profile = getLoginStorage()?.profile;
  const idEmp = encodeURIComponent(CryptoHelper.encrypt(profile?.id));
  return [
    // { id: "0", label: "หน้าหลัก", icon: HomeOutlinedIcon, path: "/" },
    {
      id: "1",
      label: "ข้อมูลส่วนตัว",
      icon: PersonIcon,
      path: `/personnel-info/information/${idEmp}`,
      relatedPaths: [
        "/personnel-info/education",
        "/personnel-info/insignia",
        "/personnel-info/academic",
        "/personnel-info/documents",
        "/personnel-info/information",
      ],
    },
    {
      id: "2",
      label: "การจัดการเวลางาน",
      icon: AccessTimeFilledIcon,
      //   relatedPaths: [`/checkin-checkout`, `/checkin-checkout-history`],
      subMenu: [
        {
          id: "2.1",
          label: "ลงชื่อ เข้างาน-ออกงาน",
          icon: PermContactCalendarIcon,
          path: `/checkin-checkout/${idEmp}`,
          relatedPaths: [`/checkin-checkout`],
        },
        {
          id: "2.2",
          label: "ประวัติเวลาการเข้างาน-ออกงาน",
          icon: EventNoteIcon,
          path: `/checkin-checkout-history/${idEmp}`,
          relatedPaths: [`/checkin-checkout-history`],
        },
      ],
    },
    {
      id: "3",
      label: "การจัดการการลา",
      icon: ContactMailIcon,
      subMenu: [
        {
          id: "3.1",
          label: "ขอลา",
          icon: AssignmentIndIcon,
          path: `/leave-request/create/${idEmp}`,
          relatedPaths: [`/leave-request`],
        },
        {
          id: "3.2",
          label: "ประวัติการลา",
          icon: DateRangeIcon,
          path: `/leave-history/${idEmp}`,
          relatedPaths: [`/leave-history`, `/leave-request-detail`],
        },
      ],
    },
    {
      id: "4",
      label: "เอกสาร",
      icon: DescriptionIcon,
      path: `/documents/${idEmp}`,
      relatedPaths: [`/documents`],
    },

    // {
    //   id: "8",
    //   label: "รายการขอลา(สำหรับผู้อนุมัติ)",
    //   icon: ContactMailIcon,
    //   path: "/leave-approve-list",
    //   relatedPaths: [`/leave-approve`],
    // },

    // { id: "000", label: "ผู้มีสิทธิ์" }, // Divider

    // { id: "5", label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    // {
    //   id: "6",
    //   label: "การจัดการข้อมูลบุคลากร",
    //   icon: PeopleIcon,
    //   path: "/personnel-admin-list",
    // },
    // {
    //   id: "7",
    //   label: "ประวัติเวลาการเข้างาน-ออกงาน ของบุคลากร",
    //   icon: AccessTimeFilledIcon,
    //   path: "/checkin-checkout-history-list",
    // },
    // {
    //   id: "9",
    //   label: "ประวัติการลา",
    //   icon: DateRangeIcon,
    //   path: "/leave-history-list",
    //   relatedPaths: [`/leave-history-list`],
    // },
  ];
};

export { menuItemFull, menuItemUser };
