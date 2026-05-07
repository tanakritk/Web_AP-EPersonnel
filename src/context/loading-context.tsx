import { createContext, ReactNode, useContext, useState } from "react";

interface LoadContextType {
    loadingContext: boolean;
    setLoadingContext: (value: boolean) => void;
}

const LoadContext = createContext<LoadContextType | undefined>(undefined)

const LoadingProvider: React.FC<{children: ReactNode}> = ({ children  }) => {
    const [loadingContext, setLoadingContext] = useState<boolean>(false)

    return (
        <LoadContext.Provider value={{ loadingContext, setLoadingContext }}>
            { children }
        </LoadContext.Provider>
    )
}

const useLoading = () => {
    const context = useContext(LoadContext);
    
    // ป้องกันกรณีเผลอใช้ Hook นอก LoadingProvider
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    
    return context;
};

export { LoadingProvider, useLoading }