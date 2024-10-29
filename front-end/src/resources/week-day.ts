export type WeekDayResource = {
    id: number;
    dayOfWeek: number;
    title: string;
}

export const weekDaysData: WeekDayResource[] = [
    { id: 1, dayOfWeek: 1, title: 'Chủ nhật' },
    { id: 2, dayOfWeek: 2, title: 'Thứ Hai' },
    { id: 3, dayOfWeek: 3, title: 'Thứ Ba' },
    { id: 4, dayOfWeek: 4, title: 'Thứ Tư' },
    { id: 5, dayOfWeek: 5, title: 'Thứ Năm' },
    { id: 6, dayOfWeek: 6, title: 'Thứ Sáu' },
    { id: 7, dayOfWeek: 7, title: 'Thứ Bảy' }
];