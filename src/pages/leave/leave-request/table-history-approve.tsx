import TableCustom, { Column } from "@/components/table-custom";
import dayjs from "dayjs";

export interface TableHistoryApproveRow {
  no: number;
  name: string;
  position: string;
  status: string;
  note: string;
  date: string | Date;
}

export interface TableHistoryApproveProps {
  rows: TableHistoryApproveRow[];
}

const TableHistoryApprove = ({
  rows,
}: TableHistoryApproveProps): JSX.Element => {
  const columns: Column[] = [
    {
      field: "no",
      label: "ลำดับ",
      bodyAlign: "center",
      width: "5%",
    },
    {
      field: "name",
      label: "ผู้ทำรายการ",
      bodyAlign: "left",
      width: "15%",
    },
    {
      field: "position",
      label: "ตำแหน่ง",
      bodyAlign: "center",
      width: "15%",
    },
    {
      field: "status",
      label: "สถานะ",
      bodyAlign: "center",
      width: "15%",
    },
    {
      field: "note",
      label: "หมายเหตุ",
      bodyAlign: "left",
      width: "35%",
    },
    {
      field: "date",
      label: "วันที่",
      bodyAlign: "center",
      width: "10%",
      render: (row: TableHistoryApproveRow) =>
        dayjs(row.date).format("DD/MM/BBBB HH:mm:ss"),
    },
  ];
  return (
    <div className="my-6 space-y-6">
      <TableCustom rows={rows || []} columns={columns} px={false} border />
    </div>
  );
};

export default TableHistoryApprove;
