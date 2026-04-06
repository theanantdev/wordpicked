/**
 * Staff Management Utilities
 * Type definitions and interfaces for staff management
 */

// Type definitions
export interface Staff {
    id: string;
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at?: string;
}

export interface CreateStaffPayload {
    name: string;
    email: string;
    password: string;
}

export interface UpdateStaffPayload {
    id: string;
    is_blocked?: boolean;
    is_verified?: boolean;
    name?: string;
}

/**
 * Form validation result type
 */
export interface FormValidationErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

/**
 * Validate staff form data
 * Can be used on both client and server side
 */
export function validateStaffForm(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}): FormValidationErrors {
    const errors: FormValidationErrors = {};

    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    }

    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

/**
 * Check if email format is valid
 */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sanitize staff input
 */
export function sanitizeStaffInput(staff: Partial<Staff>): Partial<Staff> {
    return {
        ...staff,
        ...(staff.name && { name: staff.name.trim() }),
        ...(staff.email && { email: staff.email.trim().toLowerCase() })
    };
}
