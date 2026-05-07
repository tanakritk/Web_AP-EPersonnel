const getCurentFiscalYear = (currentDate: Date): number => {
    const currentYear = currentDate.getFullYear();
    // 30 กันยายนของปีเดียวกับ currentDate
    const cutoffDate = new Date(currentYear, 8, 30); // เดือน 8 = กันยายน
    // ถ้า currentDate > cutoffDate ให้ return ปีถัดไป
    const resultYear = currentDate > cutoffDate ? currentYear + 1 : currentYear;

    return resultYear + 543; // แปลงเป็นปี พ.ศ.
}

const getFiscalYearRangeFromBuddhistYear = (buddhistYear: number): { start: string; end: string } => {
    const groupSize = 5;
    const baseYear = 2561; // เริ่มช่วงกลุ่มแรกที่ พ.ศ. 2561–2565

    const groupIndex = Math.floor((buddhistYear - baseYear) / groupSize);

    const startBE = baseYear + groupIndex * groupSize;
    const endBE = startBE + groupSize - 1;

    const startAD = startBE - 544; // ต.ค. ของปีก่อน พ.ศ.
    const endAD = endBE - 543;

    return {
        start: `${startAD}-10-01`,
        end: `${endAD}-09-30`
    };
};

const getRangeFiscalYear = (buddhistYear: number): string[] => {
    const startYear = Math.floor((buddhistYear - 2566) / 5) * 5 + 2566;
    return Array.from({ length: 5 }, (_, i) => (startYear + i).toString());
};

const getRangeFiscalYearDDL = (buddhistYear: number): { label: string; value: string }[] => {
    const startYear = Math.floor((buddhistYear - 2566) / 5) * 5 + 2566;

    return Array.from({ length: 5 }, (_, i) => {
        const year = startYear + i;
        return { label: `ปีงบประมาณ ${year}`, value: year.toString() };
    });
};


export { getCurentFiscalYear, getFiscalYearRangeFromBuddhistYear, getRangeFiscalYear, getRangeFiscalYearDDL }