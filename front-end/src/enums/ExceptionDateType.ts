export enum ExceptionDateEnum {
    ONE_DAY = "ONE DAY",
    MORE_THAN_ONE_DAY = "MORE THAN ONE DAY",
    SOME_SHIFTS = "SOME SHIFTS",
    REPEAT_BY_WEEK = "REPEAT BY WEEK",
}

export type ExceptionDateType = {
    value: ExceptionDateEnum;
    title: string;
}


export const exceptionDateData: ExceptionDateType[] = [
    { value: ExceptionDateEnum.ONE_DAY, title: 'Một ngày' },
    { value: ExceptionDateEnum.MORE_THAN_ONE_DAY, title: 'Nhiều hơn một ngày' },
    { value: ExceptionDateEnum.SOME_SHIFTS, title: 'Một số ca' },
    { value: ExceptionDateEnum.REPEAT_BY_WEEK, title: 'Lặp lại hàng tuần' }
];