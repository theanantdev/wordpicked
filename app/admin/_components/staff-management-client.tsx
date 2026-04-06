'use client';

import { useState } from 'react';
import { Trash2, Lock, Unlock, Plus, CheckCircle, AlertCircle } from 'lucide-react';

interface Staff {
    id: string;
    name: string;
    email: string;
    is_verified: boolean;
    is_blocked: boolean;
    created_at: string;
    is_admin?: boolean;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface StaffManagementClientProps {
    initialStaff: Staff[];
}

export function StaffManagementClient({ initialStaff }: StaffManagementClientProps) {
    const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch staff from API (for refreshing)
    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/staff');
            const data = await response.json();

            if (data.success) {
                setStaffList(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch staff');
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            alert('Failed to fetch staff list');
        } finally {
            setLoading(false);
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const errors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission (show confirmation modal)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setShowConfirmModal(true);
        }
    };

    // Confirm and create staff
    const confirmCreateStaff = async () => {
        try {
            setLoading(true);
            setShowConfirmModal(false);

            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to create staff');
            }

            setSuccessMessage(`Staff "${formData.name}" created successfully!`);
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            setShowForm(false);
            setFormErrors({});

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);

            // Refresh staff list
            await fetchStaff();
        } catch (error) {
            console.error('Error creating staff:', error);
            alert(error instanceof Error ? error.message : 'Failed to create staff');
        } finally {
            setLoading(false);
        }
    };

    // Toggle block status
    const toggleBlockStaff = async (id: string, currentStatus: boolean) => {
        try {
            setLoading(true);
            const response = await fetch('/api/staff', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    is_blocked: !currentStatus
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to update staff status');
            }

            setSuccessMessage(
                `Staff ${!currentStatus ? 'blocked' : 'unblocked'} successfully!`
            );
            setTimeout(() => setSuccessMessage(''), 3000);

            await fetchStaff();
        } catch (error) {
            console.error('Error updating staff status:', error);
            alert(error instanceof Error ? error.message : 'Failed to update staff status');
        } finally {
            setLoading(false);
        }
    };

    // Delete staff
    const deleteStaff = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            setLoading(true);
            const response = await fetch('/api/staff?id=' + id, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to delete staff');
            }

            setSuccessMessage(`Staff "${name}" deleted successfully!`);
            setTimeout(() => setSuccessMessage(''), 3000);

            await fetchStaff();
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF9F2] p-4 md:p-8">
            {/* Header */}
            <div className='flex flex-row justify-between items-center'>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading text-[#11412A] mb-2">
                        Staff Management
                    </h1>
                    <p className="text-[#A8812A] text-sm md:text-base">
                        Manage admin staff accounts and permissions
                    </p>

                </div>
                {/* Action Button */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8812A] text-[#FFFFFF] rounded-none font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Staff
                    </button>
                </div>

            </div>


            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 rounded-lg border border-[#11412A]/20 bg-[#FFFFFF] p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#11412A]" />
                    <p className="text-[#11412A]">{successMessage}</p>
                </div>
            )}



            {/* Staff Form */}
            {showForm && (
                <div className="mb-8 rounded-lg border border-[#E3DAC8] bg-[#FFFFFF] p-6 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-[#11412A] mb-6">Create Staff Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-[#11412A] text-sm font-medium mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className={`w-full px-4 py-3 rounded-lg border border-[#E3DAC8] bg-[#FDF9F2] transition-colors text-[#11412A] placeholder:text-[#A8812A]/70 focus:outline-none focus:ring-2 ${formErrors.name
                                    ? 'border-[#DC2828] focus:ring-[#DC2828]/30'
                                    : 'border-[#E3DAC8] focus:ring-[#A8812A]/40'
                                    }`}
                                placeholder="John Doe"
                            />
                            {formErrors.name && (
                                <p className="text-[#DC2828] text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {formErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-[#11412A] text-sm font-medium mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className={`w-full px-4 py-3 rounded-lg border border-[#E3DAC8] bg-[#FDF9F2] transition-colors text-[#11412A] placeholder:text-[#A8812A]/70 focus:outline-none focus:ring-2 ${formErrors.email
                                    ? 'border-[#DC2828] focus:ring-[#DC2828]/30'
                                    : 'border-[#E3DAC8] focus:ring-[#A8812A]/40'
                                    }`}
                                placeholder="john@example.com"
                            />
                            {formErrors.email && (
                                <p className="text-[#DC2828] text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {formErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-[#11412A] text-sm font-medium mb-2">
                                Password *
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className={`w-full px-4 py-3 rounded-lg border border-[#E3DAC8] bg-[#FDF9F2] transition-colors text-[#11412A] placeholder:text-[#A8812A]/70 focus:outline-none focus:ring-2 ${formErrors.password
                                    ? 'border-[#DC2828] focus:ring-[#DC2828]/30'
                                    : 'border-[#E3DAC8] focus:ring-[#A8812A]/40'
                                    }`}
                                placeholder="••••••••"
                            />
                            {formErrors.password && (
                                <p className="text-[#DC2828] text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {formErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-[#11412A] text-sm font-medium mb-2">
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                className={`w-full px-4 py-3 rounded-lg border border-[#E3DAC8] bg-[#FDF9F2] transition-colors text-[#11412A] placeholder:text-[#A8812A]/70 focus:outline-none focus:ring-2 ${formErrors.confirmPassword
                                    ? 'border-[#DC2828] focus:ring-[#DC2828]/30'
                                    : 'border-[#E3DAC8] focus:ring-[#A8812A]/40'
                                    }`}
                                placeholder="••••••••"
                            />
                            {formErrors.confirmPassword && (
                                <p className="text-[#DC2828] text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-[#A8812A] text-[#FFFFFF] rounded-none font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Creating...' : 'Create Staff'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 px-4 py-3 bg-[#FFFFFF] border border-[#E3DAC8] text-[#11412A] rounded-lg font-medium hover:bg-[#FDF9F2] transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Staff Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full overflow-hidden rounded-lg border border-[#E3DAC8] bg-[#FFFFFF] backdrop-blur-xl">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 bg-[#E3DAC8] border-b border-[#E3DAC8]">
                        <div className="text-[#11412A] font-semibold text-sm">Name</div>
                        <div className="text-[#11412A] font-semibold text-sm">Email</div>
                        <div className="hidden md:block text-[#11412A] font-semibold text-sm">Verified</div>
                        <div className="hidden md:block text-[#11412A] font-semibold text-sm">Status</div>
                        <div className="text-[#11412A] font-semibold text-sm">Actions</div>
                        <div className="text-[#11412A] font-semibold text-sm">Delete</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-[#E3DAC8]">
                        {staffList.length === 0 ? (
                            <div className="p-8 text-center text-[#A8812A]">
                                No staff members yet. Create your first staff account.
                            </div>
                        ) : (
                            staffList.map((staff) => (
                                <div
                                    key={staff.id}
                                    className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 hover:bg-[#FDF9F2] transition-colors items-center"
                                >
                                    {/* Name */}
                                    <div className="text-[#11412A] font-medium text-sm truncate">
                                        {staff.name}
                                    </div>

                                    {/* Email */}
                                    <div className="text-[#11412A] text-sm truncate">
                                        {staff.email}
                                    </div>
                                    {!staff.is_admin ? <>
                                        {/* Verified */}
                                        <div className="hidden md:block">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${staff.is_verified
                                                    ? 'bg-[#11412A]/10 text-[#11412A]'
                                                    : 'bg-[#DC2828]/10 text-[#DC2828]'
                                                    }`}
                                            >
                                                {staff.is_verified ? 'Yes' : 'No'}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="hidden md:block">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${staff.is_blocked
                                                    ? 'bg-[#DC2828]/10 text-[#DC2828]'
                                                    : 'bg-[#11412A]/10 text-[#11412A]'
                                                    }`}
                                            >
                                                {staff.is_blocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </div>

                                        {/* Block/Unblock Action */}
                                        <button
                                            onClick={() =>
                                                toggleBlockStaff(staff.id, staff.is_blocked)
                                            }
                                            disabled={loading}
                                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                                            title={
                                                staff.is_blocked
                                                    ? 'Click to unblock'
                                                    : 'Click to block'
                                            }
                                        >
                                            {staff.is_blocked ? (
                                                <>
                                                    <Lock className="w-4 h-4 text-[#DC2828]" />
                                                    <span className="hidden sm:inline text-[#DC2828]">
                                                        Blocked
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="w-4 h-4 text-[#11412A]" />
                                                    <span className="hidden sm:inline text-[#11412A]">
                                                        Active
                                                    </span>
                                                </>
                                            )}
                                        </button>

                                        {/* Delete Action */}
                                        <button
                                            onClick={() => deleteStaff(staff.id, staff.name)}
                                            disabled={loading}
                                            className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-[#DC2828]/10 hover:bg-[#DC2828]/20 text-[#DC2828] transition-all disabled:opacity-50"
                                            title="Delete staff"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                    </> : <>
                                        <div>
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#11412A]/10 text-[#11412A]`}
                                            >
                                                Website Owner
                                            </span>
                                        </div>
                                    </>}

                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#FFFFFF] border border-[#E3DAC8] rounded-lg p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-2 bg-[#A8812A]/20 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-[#A8812A]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#11412A]">
                                    Confirm Staff Creation
                                </h3>
                                <p className="text-[#A8812A] text-sm mt-1">
                                    Please verify all information before creating the staff account.
                                </p>
                            </div>
                        </div>

                        {/* Verification Details */}
                        <div className="bg-[#FDF9F2] border border-[#E3DAC8] rounded-lg p-4 mb-6 space-y-3">
                            <div>
                                <p className="text-[#A8812A] text-xs uppercase tracking-wide">
                                    Name
                                </p>
                                <p className="text-[#11412A] font-medium">{formData.name}</p>
                            </div>
                            <div>
                                <p className="text-[#A8812A] text-xs uppercase tracking-wide">
                                    Email
                                </p>
                                <p className="text-[#11412A] font-medium">{formData.email}</p>
                            </div>
                            <div>
                                <p className="text-[#A8812A] text-xs uppercase tracking-wide">
                                    Default Status
                                </p>
                                <p className="text-[#11412A] font-medium">Active (Unblocked)</p>
                            </div>
                            <div>
                                <p className="text-[#A8812A] text-xs uppercase tracking-wide">
                                    Verification
                                </p>
                                <p className="text-[#11412A] font-medium">Verified</p>
                            </div>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-[#DC2828]/10 border border-[#DC2828]/30 rounded-lg p-3 mb-6">
                            <p className="text-[#11412A] text-sm">
                                <strong>⚠️ Warning:</strong> Double-check the email address.
                                Make sure all details are correct before proceeding.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-[#FFFFFF] border border-[#E3DAC8] text-[#11412A] rounded-lg font-medium hover:bg-[#FDF9F2] disabled:opacity-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCreateStaff}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-linear-to-r from-[#A8812A] to-[#11412A] text-[#FFFFFF] rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Creating...' : 'Confirm & Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
