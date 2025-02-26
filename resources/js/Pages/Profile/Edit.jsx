import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 ">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12 bg-white shadow-xl dark:bg-gray-800">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-lg p-4 shadow-xl sm:rounded-lg sm:p-8 dark:bg-gray-700">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg p-4 shadow-xl sm:rounded-lg sm:p-8 dark:bg-gray-700">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg p-4 shadow-xl sm:rounded-lg sm:p-8 dark:bg-gray-700">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
