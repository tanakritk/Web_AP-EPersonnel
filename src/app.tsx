import "./index.css";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import { useLoading } from "./context/loading-context";
import GetRoute from "./route";
import AlertCustom from "./components/alert-custom";
import DialogCustom from "./components/dialog-custom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAlert } from "./context/alert-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // ข้อมูลจะสดอยู่ 5 นาที
    },
  },
});

const App = () => {
  const { loadingContext } = useLoading();
  const { alertContext } = useAlert();
  const [dialog, setDialog] = useState({
    message: "",
    status: false,
  });
  const alertDetail: any = {
    type: alertContext.type,
    message: alertContext.message,
  };

  useEffect(() => {}, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AlertCustom detail={alertDetail} />
        <Loading status={Boolean(loadingContext)} />

        <GetRoute />
      </QueryClientProvider>

      {/* ---------------------------------Dialog Not Permission------------------------------------ */}

      <DialogCustom
        status={dialog.status}
        title="แจ้งเตือน"
        returnOnClose={() => setDialog({ ...dialog, status: false })}
      >
        {dialog.message}
      </DialogCustom>
    </>
  );
};

export default App;
