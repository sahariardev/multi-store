export enum AttendanceType {
    PRESENT,
    APPROVED_LEAVE,
    UNAPPROVED_LEAVE
}

export const isValidAttendanceType = (attendanceType: string): boolean => {
    const attendanceTypes: string[] = Object.keys(AttendanceType).filter((item) => {
        return isNaN(Number(item));
    });

    return attendanceTypes.includes(attendanceType);
}