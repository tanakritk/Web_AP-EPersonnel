import { createContext, ReactNode, useContext, useState } from "react";

interface AlertStateProps {
    message: string; 
    type: "success"|"warning";
}

interface AlertContextType {
    alertContext: AlertStateProps;
    setAlertContext: React.Dispatch<React.SetStateAction<AlertStateProps>>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

const AlertProvider: React.FC<{children: ReactNode}> = ({ children  }) => {
    const [alertContext, setAlertContext] = useState<AlertStateProps>({
        message: "",
        type: "success"
    })

    return (
        <AlertContext.Provider value={{ alertContext, setAlertContext }}>
            { children }
        </AlertContext.Provider>
    )
}

const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error("useAlert must be used within an AlertProvider");
    }

    const showAlert = (message: string, type: AlertStateProps["type"] = "success") => {
        context.setAlertContext({ message, type });
        
        // ออปชันเสริม: ตั้งเวลาปิด Alert อัตโนมัติ (เช่น 5 วินาที)
        setTimeout(() => {
            context.setAlertContext({ message: "", type: "success" });
        }, 5000);
    };

    return { ...context, showAlert };
};

export { AlertProvider, useAlert }



