import { getInitialStaffData } from '@/utils/server-staff';
import { StaffManagementClient } from '@/app/admin/_components/staff-management-client';

/**
 * Server Component: Fetches initial staff data on the server
 * Then hydrates the client component with this data
 */
export default async function StaffManagement() {
    // Fetch staff data on the server side
    const initialStaff = await getInitialStaffData();
    // console.log("Initial staff data fetched on server:", initialStaff);

    return (
        // Pass data to client component for interactive features
        <StaffManagementClient initialStaff={initialStaff} />
    );
}
