// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./mui-theme";
import { LoadingProvider } from "./context/loading-context";
import { AlertProvider } from "./context/alert-context";
import { AuthProvider } from "./context/auth-context";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import CustomAdapter from "./utils/custom-adapter";

createRoot(document.getElementById("root")!).render(
  //   <StrictMode>
  <AuthProvider>
    <LoadingProvider>
      <AlertProvider>
        <LocalizationProvider
          dateAdapter={CustomAdapter}
          adapterLocale="th" // ตั้งค่า locale เป็นภาษาไทย
        >
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </AlertProvider>
    </LoadingProvider>
  </AuthProvider>,
  //   </StrictMode>,
);
