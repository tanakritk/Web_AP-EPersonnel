import dayjs from "dayjs";
import {
    dayjsLocalizer
} from "react-big-calendar";
import 'dayjs/locale/th';

const customColorCalendar = (event: any) => {
    let style = {
        backgroundColor: 'blue', // สีพื้นหลังเริ่มต้น
        //   color: 'white'
    };
    style.backgroundColor = event.color
    // switch (event.status) {
    //   case 'work':
    //     style.backgroundColor = '#eab308'
    //     break;
    //   case 'personal':
    //     style.backgroundColor = '#22c55e';
    //     break;
    //   // ... กรณีอื่นๆ
    // }

    return {
        style
    };
};

const messagesCalendar = () => {
    return {
        next: "ถัดไป", // เปลี่ยนปุ่ม Next เป็นภาษาไทย
        previous: "ย้อนกลับ", // เปลี่ยนปุ่ม Back เป็นภาษาไทย
        today: "วันนี้", // เปลี่ยนปุ่ม Today เป็นภาษาไทย
        month: "เดือน",
        week: "สัปดาห์",
        work_week: 'สัปดาห์วันทำงาน',
        day: "วัน",
        agenda: "กำหนดการ",
    }
}

//   const formatThaiOld = () => {
//     dayjs.locale("th");
//     const localizer = dayjsLocalizer(dayjs);
//     const formats = {
//         monthHeaderFormat: (date: any) => dayjs(date).format("MMMM YYYY"),
//         dayHeaderFormat: (date: any) => dayjs(date).format("ddd DD/MM"),
//     };
//     return {localizer, formats}
//   }

const formatThai = () => {
    // เพิ่ม localeData ปลั๊กอิน
    // dayjs.extend(localeData);
    dayjs.locale('th');
    const localizer = dayjsLocalizer(dayjs);

    const formats = {
        monthHeaderFormat: (date: Date) => dayjs(date).format('MMMM BBBB'), // พฤษภาคม 2568
        dayFormat: (date: Date) => dayjs(date).format('DD ddd'),
        dayHeaderFormat: (date: Date) => dayjs(date).format('ddd D MMM BBBB'),
        agendaDateFormat: (date: Date) => dayjs(date).format('D MMM BBBB'),

        dayRangeHeaderFormat: ({ start, end }: any) => {
            const s = dayjs(start);
            const e = dayjs(end);

            const startDate = s.format("D");
            const endDate = e.format("D");
            const monthStart = s.format("MMM");
            const monthEnd = e.format("MMM"); // ใช้เดือนของวันสุดท้าย
            const yearStart = s.format("BBBB"); // พ.ศ.
            const yearEnd = e.format("BBBB"); // พ.ศ.
            if( yearStart === yearEnd ){
                if(  monthStart === monthEnd ){
                    return `${startDate} - ${endDate} ${monthEnd} ${yearEnd}`;
                }else{
                    return `${startDate} ${monthStart} - ${endDate} ${monthEnd} ${yearEnd}`;
                }
                
            }else{
                return `${startDate} ${monthStart} ${yearStart} - ${endDate} ${monthEnd} ${yearEnd}`;
            }
            
        },
    };

    return { localizer, formats }
}



export const currentDateTH = () => {
    const currentDate = dayjs();
    const buddhistYear = currentDate.year() + 543;
    return currentDate.format(`D MMMM ${buddhistYear}`);
};

export { customColorCalendar, messagesCalendar, formatThai }