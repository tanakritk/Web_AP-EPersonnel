import { createContext, useState } from 'react';
interface AuthContextType {
    AuthStatusContext: string;
    setAuthStatusContext: any
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children  }) => {
    const [AuthStatusContext, setAuthStatusContext] = useState<any>(false)

    return (
        <AuthContext.Provider value={{ AuthStatusContext, setAuthStatusContext }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }


