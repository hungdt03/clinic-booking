import { ExceptionDateEnum } from "../enums/ExceptionDateType";

export type AuthResponse = {
    user?: UserResource;
    accessToken?: string;
    refreshToken: string;
}



export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
}

export type UserResource = {
    id: string;
    fullName: string;
    thumbnail: string;
    email: string;
    userName: string;
    phoneNumber: string;
    dateOfBirth: Date;
    gender: string;
    identityCard: string;
    ethnicGroup: string;
    address: string;
    role: string;
    isOnline: boolean;
    recentOnlineTime: Date;
    isPasswordChanged: boolean;
};

export interface ClinicResource {
    id: string;
    name: string;
    address: string;
    thumbnailUrl: string;
    specializations: SpecialityResource[];
    images: string[];
    introductionPlain: string;
    introductionHtml: string;
}

export type PartialDoctor = {
    position: string;
    academicTitle: string;
    degree: string;
    currentWorkPlace: string;
    experienceYears: number;
    address: string;
    introductionPlain: string;
    introductionHtml: string;
}

export interface DoctorOwnerResource {
    details: PartialDoctor;
    user: UserResource;
    specializations: SpecialityResource[];
    educations: EducationResource[];
    awardsAndResearches: AwardResource[];
    workExperiences: WorkExperienceResource[];
    images: string[]
}

export type AwardResource = {
    id: number;
    year: string;
    content: string;
}

export type EducationResource = {
    id: number;
    fromYear: string;
    toYear: string;
    studyPlace: string;
}

export type WorkExperienceResource = {
    id: number;
    fromYear: string;
    toYear: string;
    workPlace: string;
}

export type DoctorEmployeeResource = {
    details: PartialDoctor;
    user: UserResource;
    clinic: ClinicResource
}

export type ManagerResource = {
    clinic: ClinicResource,
    user: UserResource
}

export type SpecialityResource = {
    id: number;
    name: string;
    thumbnail: string;
    description: string;
}

export type BookingAppointmentRuleResource = {
    isBrandRequired: boolean;
    isDoctorRequired: boolean;
    isServiceRequired: boolean;
    brandOrder: number;
    doctorOrder: number;
    serviceOrder: number;
};

export interface ShiftResource {
    id: number;
    type: string;
    startTime: string;
    endTime: string;
}

export type BrandResource = {
    id: number;
    name: string;
    address: string;
}

export type ServiceTypeResource = {
    id: number;
    name: string;
    subName: string;
    isIncludeFee: boolean;
}

export type ServiceResource = {
    id: number;
    name: string;
    fee: number;
    type: string;
    serviceType: ServiceTypeResource
}

export type ProfileResource = {
    id: string;
    name: string;
    phoneNumber: string;
    dateOfBirth: Date;
    gender: string;
    identityCard: string;
    address: string;
    major: string;
    email: string;
    relationship: string;
    ethnicGroup: string;
    isPrimary: boolean;
};

export type AppointmentResource = {
    id: number;
    appointmentDate: Date;
    clinic: ClinicResource;
    brand: BrandResource;
    doctor: DoctorEmployeeResource;
    service: ServiceResource;
    serviceType: ServiceTypeResource;
    shift: ShiftResource;
    profile: ProfileResource;
    note: string;
    status: string;
    fileAttaches: string[];
    numberOrder: number;
}


export type DayShiftResource = {
    day: Date;
    shifts: ShiftResource[]
}

export type ExceptionDateResource = {
    id: number;
    fromDate: Date;
    toDate: Date;
    isFullDate: boolean;
    isRepeat: boolean;
    reason: string;
    content: string;
    type: ExceptionDateEnum;
    clinicId?: string | null;
    clinic?: ClinicResource | null;
    unavailableShifts: ShiftResource[];
    doctorId?: string | null;
    doctor?: DoctorOwnerResource | null;
};

export type UnavailableDateResource = {
    day: Date;
    title: string;
    isExceptionDate: boolean;
}

export interface SearchResource {
    data: ClinicResource | DoctorOwnerResource;
    type: 'CLINIC' | 'DOCTOR'
}

export type NoteResource = {
    content: string;
}

export type NotificationType = "message" | "booking"

export type NotificationResource = {
    id: number;
    title: string;
    content: string;
    notificationType: NotificationType;
    referenceId: number;
    haveRead: boolean;
    createdAt: Date;
    recipient: UserResource;
}

export type BookingProcessResource = {
    id: number;
    name: string;
    orderNumber: number;
}