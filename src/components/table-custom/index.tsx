// export interface Column {
//   field: string;
//   label: string | any;
//   width: string;
//   render?: any;
//   headerVertical?: boolean;
//   bodyAlign?: "left" | "center" | "right";
// }
// interface TableCustomProps {
//   rows?: any;
//   columns: Column[];
//   onClickRow?: any;
//   border?: boolean;
//   px?: boolean;
// }

// const TableCustom = ({
//   rows,
//   columns,
//   onClickRow,
//   border = false,
//   px = true,
// }: TableCustomProps) => {
//   return (
//     <div
//       className={`overflow-auto ${px && "px-6"} ${px && "py-6"}  bg-white rounded-[10px]`}
//     >
//       <table className="w-full border-collapse separate overflow-hidden rounded-t-lg">
//         <thead className="">
//           <tr className="bg-primary-1 text-black uppercase text-[15px] leading-normal rounded-t-lg">
//             {columns.map((field, index) => (
//               <th
//                 style={
//                   field?.headerVertical
//                     ? {
//                         width: field.width,
//                         writingMode: "vertical-rl",
//                         transform: "rotate(180deg)",
//                         textOrientation: "mixed",
//                         verticalAlign: "bottom",
//                       }
//                     : { width: field.width }
//                 }
//                 key={"col" + index}
//                 className={`py-2 px-1 text-center font-medium ${border && "border-4"} `}
//               >
//                 <span>{typeof field?.label === 'string' ? field?.label : field?.label()}</span>
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white">
//           {rows?.map((row: any, index: any) => (
//             <tr
//               style={{ borderBottom: "1px solid #cfcfcfff" }}
//               className="border-4 border-gray-200 bg-white hover:bg-gray-100"
//               key={"row" + index}
//               onClick={() => {
//                 return onClickRow ? onClickRow(row) : null;
//               }}
//             >
//               {columns.map((field: any, key: number) => (
//                 <td
//                 //   style={{ border: "1px solid #cfcfcfff" }}
//                   key={"td" + key}
//                   className={`rounded-xl py-2 px-1 text-black text-sm ${field?.bodyAlign == "center" ? "text-center" : field?.bodyAlign == "right" ? "text-right" : "text-left"} font-normal ${border && "border-4"}`}
//                 >
//                   <span>{field?.render ? field.render(row, index) : row[field.field]}</span>
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableCustom;

export interface Column {
  field: string;
  label: string | any;
  width: string;
  render?: any;
  headerVertical?: boolean;
  bodyAlign?: "left" | "center" | "right";
}

interface TableCustomProps {
  rows?: any;
  columns: Column[];
  onClickRow?: any;
  border?: boolean;
  px?: boolean;
}

const TableCustom = ({
  rows,
  columns,
  onClickRow,
  border = false,
  px = true,
}: TableCustomProps) => {
  return (
    <div
      className={`w-full overflow-x-auto ${px && "px-6"} ${px && "py-6"} bg-[#F3F4F6]`}
    >
      <div className="min-w-[1000px] flex flex-col gap-2">
        {/* Header Row */}
        <div className="flex gap-2 mb-1">
          {columns.map((col, index) => (
            <div
              key={"header-" + index}
              style={{
                // ใช้ calc เพื่อหักลบ Gap ออกจาก %
                // (Gap รวมคือ 8px * (จำนวนคอลัมน์ - 1)) แล้วหารเฉลี่ยคืนแต่ละคอลัมน์
                width: `calc(${col.width} - ${(8 * (columns.length - 1)) / columns.length}px)`,
                minWidth: col.width.includes("%") ? "120px" : col.width,
                ...(col?.headerVertical && {
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }),
              }}
              className="bg-[#9B5965] text-white py-3 px-2 text-center text-[14px] font-medium rounded-lg flex items-center justify-center shrink-0"
            >
              {typeof col.label === "string" ? col.label : col.label()}
            </div>
          ))}
        </div>
        {/* Body Rows */}
        {rows?.map((row: any, rowIndex: any) => (
          <div
            key={"row-" + rowIndex}
            onClick={() => onClickRow?.(row)}
            /* 1. ใส่ group เพื่อให้ลูกตรวจสอบสถานะ hover จากตัวแม่ได้ */
            className="flex gap-2  transition-all shrink-0 group"
          >
            {columns.map((col: any, colIndex: number) => (
              <div
                key={"cell-" + colIndex}
                style={{
                  width: `calc(${col.width} - ${(8 * (columns.length - 1)) / columns.length}px)`,
                  minWidth: col.width.includes("%") ? "120px" : col.width,
                }}
                /* 2. ใช้ group-hover:bg... เพื่อเปลี่ยนสีพื้นหลังของทุก Cell ในแถวพร้อมกัน */
                className={`
                                bg-white px-4 py-3 rounded-xl flex items-center min-h-[40px] shrink-0
                                transition-colors duration-200
                                group-hover:bg-gray-200 group-hover:text-black
                                ${
                                    col?.bodyAlign === "center"
                                    ? "justify-center text-center"
                                    : col?.bodyAlign === "right"
                                        ? "justify-end text-right"
                                        : "justify-start text-left"
                                }
                                ${border ? "border border-gray-200" : ""}
                                text-[14px] text-gray-800
                            `}
              >
                <div className="w-full">
                  {col?.render ? col.render(row, rowIndex) : row[col.field]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableCustom;
