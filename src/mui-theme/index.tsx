import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ec7f8a",
    },
    warning: {
      main: "#ff870f",
      contrastText: "#fff",
    },
    error: {
      main: "#f15950",
    },
    secondary: {
      main: "#D9D9D9",
    },
    // success: {
    //   main: "#05e417",
    // },
    // white: {
    //   main: '#fff',
    // }
  },

  typography: {
    fontFamily: ["IBM Plex Sans Thai", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //   borderRadius: "8px",
          //   fontWeight: 400,
          //   boxShadow: "none",
          borderRadius: "12px", // ปรับความโค้งมนให้ใกล้เคียงรูป
          //   fontWeight: 700, // ให้ตัวหนังสือดูหนาเด่นชัด
          boxShadow: "none",
          //   padding: "10px 24px", // ปรับระยะห่างให้ดูพอดี
          //   fontSize: "1.1rem", // ขนาดตัวอักษร
          //   "&:hover": {
          //     boxShadow: "none",
          //   },
        },

        containedPrimary: {
          backgroundColor: "#ec7f8a", // สีชมพูหลัก
          color: "#fff",
          "&:hover": {
            backgroundColor: "#ec7f8a", // สีตอน Hover ให้เข้มขึ้นนิดหน่อย
          },
        },
        // สไตล์สำหรับปุ่มเส้นขอบชมพู (ด้านขวา)
        outlinedPrimary: {
          color: "#ec7f8a",
          borderColor: "#ec7f8a",
          borderWidth: "1px",
          backgroundColor: "white",
          "&:hover": {
            borderWidth: "1px",
            backgroundColor: "rgba(232, 162, 169, 0.04)", // สีพื้นอ่อนๆ ตอน Hover
            borderColor: "#ec7f8a",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: "#eeeeee",
          },
          "& .MuiInputBase-input.Mui-disabled": {
            opacity: 1, // ป้องกันการจาง
            "-webkit-text-fill-color": "#000000 !important", // บังคับให้สีตัวหนังสือเป็นสีดำ
          },
          // borderColor: "#D6DAE1",
          borderRadius: "8px",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: "#eeeeee", // พื้นหลังเมื่อ disabled
            color: "#000000", // สีตัวอักษรเมื่อ disabled
            opacity: 1, // ปิดการทำให้สีจาง
          },
          // borderColor: "#D6DAE1",
          borderRadius: "8px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // ความโค้งมนตามรูป
          backgroundColor: "#ffffff", // สีขาวในสถานะปกติ
          transition: "background-color 0.2s",

          // เมื่อ Disabled
          "&.Mui-disabled": {
            backgroundColor: "rgb(218, 217, 217) !important", // สีเทา (ปรับระดับความเข้มตามชอบ เช่น #eeeeee หรือ #f5f5f5)
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent", // สีเส้นขอบตอน disabled
              borderWidth: "0px !important",
            },
          },

          // จัดการสีเส้นขอบ (Border)
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ec7f8a", // สีชมพูเมื่อ hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ec7f8a", // สีชมพูเมื่อ focus
          },
        },
        input: {
          padding: "10px 10px",
          "&.Mui-disabled": {
            WebkitTextFillColor: "#666666", // สีตัวอักษรตอน disabled (ให้เข้มขึ้นเพื่อให้ชัดเจน)
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        textAlignLeft: {
          "&::before": {
            display: "none",
          },
          "&::after": {
            flex: 1,
          },
        },
      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#9B5965",
            color: "white",
            "&:hover": {
              backgroundColor: "#9B5965",
            },
          },
        },
      },
    },
  },
});

export { theme };
