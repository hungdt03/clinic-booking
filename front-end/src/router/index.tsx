import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import AuthLayout from "../layouts/AuthLayout";
import SignInPatient from "../pages/authentication/SignInPatient";
import SignUp from "../pages/authentication/SignUp";
import DoctorProfile from "../pages/DoctorProfile";
import DoctorBookingPage from "../pages/booking/DoctorBookingPage";
import ClinicBookingPage from "../pages/booking/ClinicBookingPage";
import BookingPage from "../pages/booking/BookingPage";
import ClinicDetail from "../pages/ClinicDetail";
import DoctorDetail from "../pages/DoctorDetail";
import AccountLayout from "../layouts/AccountLayout";
import Account from "../pages/account/Account";
import Profile from "../pages/account/Profile";
import AppointmentSchedule from "../pages/account/AppointmentSchedule";
import PaymentHistory from "../pages/account/PaymentHistory";
import SearchPage from "../pages/SearchPage";
import ManagementLayout from "../layouts/ManagementLayout";
import ListClinicPage from "../pages/admin/clinic/ListClinicPage";
import SignInDoctor from "../pages/authentication/SignInDoctor";
import SignInAdmin from "../pages/authentication/SignInAdmin";
import SignInManager from "../pages/authentication/SignInManager";
import ListDoctorOwnerPage from "../pages/admin/doctor/ListDoctorOwnerPage";
import ListSpeciality from "../pages/shared/speciality/ListSpeciality";
import ListDoctorEmployeePage from "../pages/manager/employee/ListDoctorEmployeePage";
import ListManagerManagementPage from "../pages/admin/manager/ListManagerPage";
import ListShiftPage from "../pages/shared/shift/ListShiftPage";
import ListBrandPage from "../pages/manager/brand/ListBrandPage";
import ListServiceTypePage from "../pages/manager/service-type/ListServiceTypePage";
import ListServicePage from "../pages/manager/service/ListServicePage";
import ListAppointmentClinic from "../pages/manager/appointment/ListAppointmentClinic";
import ListAppointmentDoctor from "../pages/d-owner/appointment/ListAppointmentDoctor";
import ExceptionDateManage from "../pages/manager/dayoff/ExceptionDateClinicManage";
import ExceptionDateDoctorManage from "../pages/d-owner/dayoff/ExceptionDateDoctorManage";
import SearchByDoctor from "../pages/SearchByDoctor";
import SearchByClinic from "../pages/SearchByClinic";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import ListSpecialityExaminateClinic from "../pages/shared/speciality/ListSpecialityExaminateClinic";
import ListSpecialityExaminateDoctor from "../pages/shared/speciality/ListSpecialityExaminateDoctor";
import DoctorIntroduction from "../pages/shared/introduction/DoctorIntroduction";
import ClinicIntroduction from "../pages/shared/introduction/ClinicIntroduction";
import ListAppointmentDoctorEmployee from "../pages/d-employee/appointment/ListAppointmentDoctorEmployee";
import NotePage from "../pages/shared/note/NotePage";
import ContactPage from "../pages/contact/ContactPage";
import ContactLayout from "../layouts/ContactLayout";
import ContactAdminDetail from "../pages/shared/contact/ContactAdminDetail";
import ContactAdminPage from "../pages/shared/contact/ContactAdminPage";
import ChangePassword from "../pages/shared/ChangePassword";
import UserLogin from "../pages/token/user-login";
import AppointmentClinicDetails from "../pages/shared/AppointmentClinicDetails";
import ForbbidenPage from "../pages/errors/ForBiddenPage";
import AuthGuard from "./protected/auth-guard";
import GuestGuard from "./protected/guest-guard";
import ChangePasswordAccess from "./protected/change-pass";
import RoleBasedGuard from "./protected/role-based-guard";

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorBoundary />,
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <HomePage />
            },
            {
                path: 'user-login',
                element: <UserLogin />
            },
            {
                path: 'doctor',
                element: <DoctorProfile />
            },
            {
                path: 'clinic/:id',
                element: <ClinicDetail />
            },
            {
                path: 'doctor/:id',
                element: <DoctorDetail />
            },
            {
                path: 'booking/doctor',
                element: <BookingPage />
            },
            {
                path: 'booking/clinic',
                element: <BookingPage />
            },
            {
                path: 'booking/doctor/search',
                element: <SearchByDoctor />
            },
            {
                path: 'booking/clinic/search',
                element: <SearchByClinic />
            },
            {
                path: 'booking/doctor/:id',
                element: <AuthGuard 
                    element={
                        <RoleBasedGuard
                            accessibleRoles={['PATIENT']}
                            element={<DoctorBookingPage />}
                        />
                    }
                />
            },
            {
                path: 'booking/clinic/:id',
                element: <AuthGuard 
                element={
                    <RoleBasedGuard
                        accessibleRoles={['PATIENT']}
                        element={<ClinicBookingPage />}
                    />
                }
            />
            },
            {
                path: 'search',
                element: <SearchPage />
            },
            {
                path: 'speciality/search',
                element: <SearchByDoctor />
            },

        ]
    },
    {
        path: 'contact',
        errorElement: <ErrorBoundary />,
        element: <AuthGuard element={
            <RoleBasedGuard accessibleRoles={['PATIENT']} element={<ContactLayout />} />
        } />,
        children: [
            {
                path: ":recipientId",
                element: <ContactPage />
            }
        ]
    },
    {
        path: '/account',
        errorElement: <ErrorBoundary />,
        element: <AuthGuard element={
            <RoleBasedGuard accessibleRoles={['PATIENT']} element={<AccountLayout />} />
        } />,
        children: [
            {
                path: '',
                element: <Account />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'appointment',
                element: <AppointmentSchedule />
            },
            {
                path: 'payment-history',
                element: <PaymentHistory />
            },
        ]
    },
    {
        path: '/auth',
        element: <GuestGuard element={<AuthLayout />} />,
        children: [
            {
                path: 'sign-in-patient',
                element: <SignInPatient />
            },
            {
                path: 'sign-in-doctor',
                element: <SignInDoctor />
            },
            {
                path: 'sign-in-clinic',
                element: <SignInManager />
            },
            {
                path: 'sign-in-admin',
                element: <SignInAdmin />
            },
            {
                path: 'sign-up',
                element: <SignUp />
            }
        ]
    },
    {
        path: 'change-password',
        element: <ChangePassword />
    },
    {
        path: '/admin',
        errorElement: <ErrorBoundary />,
        element: <AuthGuard element={
            <RoleBasedGuard accessibleRoles={['ADMIN']} element={<ManagementLayout />} />
        } />,
        children: [
            {
                path: 'clinics',
                element: <ListClinicPage />
            },
            {
                path: 'managers',
                element: <ListManagerManagementPage />
            },
            {
                path: 'doctors',
                element: <ListDoctorOwnerPage />
            },
            {
                path: 'speciality',
                element: <ListSpeciality />
            },
        ]
    },
    {
        path: 'manager',
        element: <AuthGuard element={
            <ChangePasswordAccess element={
                <RoleBasedGuard accessibleRoles={['MANAGER']} element={<ManagementLayout />} />
            } />
        } />,
        children: [
            {
                path: '',
                element: <ClinicIntroduction />
            },
            {
                path: 'doctors',
                element: <ListDoctorEmployeePage />,
            },
            {
                path: 'speciality',
                element: <ListSpeciality />
            },
            {
                path: 'speciality-examinates',
                element: <ListSpecialityExaminateClinic />,
            },
            {
                path: 'shifts',
                element: <ListShiftPage />,
            },
            {
                path: 'brands',
                element: <ListBrandPage />,
            },
            {
                path: 'service-types',
                element: <ListServiceTypePage />,
            },
            {
                path: 'services',
                element: <ListServicePage />,
            },
            {
                path: 'appointments',
                element: <ListAppointmentClinic />,
            },
            {
                path: 'appointments/:id',
                element: <AppointmentClinicDetails />,
            },
            {
                path: 'dayoff',
                element: <ExceptionDateManage />
            },
            {
                path: 'note',
                element: <NotePage />
            },
            {
                path: 'contact',
                element: <ContactAdminPage />,
                children: [
                    {
                        path: ':recipientId',
                        element: <ContactAdminDetail />
                    }
                ]
            }
        ]
    },
    {
        path: 'd-owner',
        element: <AuthGuard element={
            <ChangePasswordAccess element={
                <RoleBasedGuard accessibleRoles={['DOCTOR_OWNER']} element={<ManagementLayout />} />
            } />
        } />,
        children: [
            {
                path: '',
                element: <DoctorIntroduction />
            },
            {
                path: 'speciality',
                element: <ListSpeciality />
            },
            {
                path: 'speciality-examinates',
                element: <ListSpecialityExaminateDoctor />,
            },
            {
                path: 'shifts',
                element: <ListShiftPage />,
            },
            {
                path: 'appointments',
                element: <ListAppointmentDoctor />,
            },
            {
                path: 'appointments/:id',
                element: <AppointmentClinicDetails />,
            },
            {
                path: 'dayoff',
                element: <ExceptionDateDoctorManage />
            },
            {
                path: 'note',
                element: <NotePage />
            },
            {
                path: 'contact',
                element: <ContactAdminPage />,
                children: [
                    {
                        path: ':recipientId',
                        element: <ContactAdminDetail />
                    }
                ]
            }
        ]
    },
    {
        path: 'd-employee',
        element: <AuthGuard element={
            <ChangePasswordAccess element={
                <RoleBasedGuard accessibleRoles={['DOCTOR_EMPLOYEE']} element={<ManagementLayout />} />
            } />
        } />,
        children: [
            {
                path: 'speciality-examinates',
                element: <ListSpecialityExaminateDoctor />,
            },
            {
                path: 'speciality',
                element: <ListSpeciality />
            },
            {
                path: 'shifts',
                element: <ListShiftPage />,
            },
            {
                path: 'appointments',
                element: <ListAppointmentDoctorEmployee />,
            },
            {
                path: 'appointments/:id',
                element: <AppointmentClinicDetails />,
            },
            {
                path: 'dayoff',
                element: <ExceptionDateDoctorManage />
            },
            {
                path: 'note',
                element: <NotePage />
            }

        ]
    },
    {
        path: 'access-denied',
        element: <ForbbidenPage />
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

export default router;