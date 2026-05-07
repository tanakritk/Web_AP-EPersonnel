const setLoginStorage = (profile: Record<string, any>, token: string) => {
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("token", token);
};

const getLoginStorage = () => {
    const profile: any = localStorage?.getItem("profile");
    const token = localStorage?.getItem("token");
    return { profile: JSON.parse(profile), token: token}
}

const removeLoginStorage = () => {
    localStorage.removeItem("profile");
    localStorage.removeItem("token");
}

const setFiscalYearStorage = (fiscalYear: string) => {
    localStorage.setItem("fiscalYear", fiscalYear);
}

const getFiscalYearStorage = () => {
    const fiscalYear = localStorage?.getItem("fiscalYear");
    return fiscalYear
}



export { setLoginStorage, getLoginStorage, removeLoginStorage, setFiscalYearStorage, getFiscalYearStorage }