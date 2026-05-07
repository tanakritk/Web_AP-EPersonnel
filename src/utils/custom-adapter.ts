import "dayjs/locale/th";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(buddhistEra);

export default class CustomAdapter extends AdapterDayjs {
  constructor({ locale, formats }: any) {
    super({ locale, formats });
  }

  formatByString = (date: dayjs.Dayjs | Date, format: string) => {
    const newFormat = format.replace(/\bYYYY\b/g, "BBBB");

    const formattedDate = this.dayjs(date).format(newFormat);
    return formattedDate;
  };
}
