import {
    getActiveStaffCount,
    getBlockedStaffCount,
    getStaffCount
} from '@/utils/server-staff';
import { Users, CheckCircle, Lock, AlertCircle } from 'lucide-react';

interface StaffStats {
    totalStaff: number;
    activeStaff: number;
    blockedStaff: number;
    verifiedStaff: number;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: 'rust' | 'olive' | 'gold' | 'warning';
    description?: string;
}

function StatCard({ icon, label, value, color, description }: StatCardProps) {
    const colorClasses = {
        rust: {
            bg: 'bg-[#B5542A]/10',
            border: 'border-[#B5542A]/30',
            icon: 'text-[#B5542A]'
        },
        olive: {
            bg: 'bg-[#3A6648]/10',
            border: 'border-[#3A6648]/30',
            icon: 'text-[#3A6648]'
        },
        gold: {
            bg: 'bg-[#A8812A]/10',
            border: 'border-[#A8812A]/30',
            icon: 'text-[#A8812A]'
        },
        warning: {
            bg: 'bg-[#8B5A2B]/10',
            border: 'border-[#8B5A2B]/30',
            icon: 'text-[#8B5A2B]'
        }
    };

    const classes = colorClasses[color];

    return (
        <div
            className={`p-6 rounded-lg border ${classes.bg} ${classes.border} backdrop-blur-xl`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${classes.bg}`}>
                    <div className={`w-6 h-6 ${classes.icon}`}>{icon}</div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-[#F5F0E8]">{value}</p>
                    {description && (
                        <p className="text-xs text-[#8B8174] mt-1">{description}</p>
                    )}
                </div>
            </div>
            <p className="text-[#DDD7CC] text-sm font-medium">{label}</p>
        </div>
    );
}

async function getStaffStats(): Promise<StaffStats> {
    try {
        const [totalStaff, activeStaff, blockedStaff] = await Promise.all([
            getStaffCount(),
            getActiveStaffCount(),
            getBlockedStaffCount()
        ]);

        // New staff are created as verified=true, so verified count matches total count.
        const verifiedStaff = totalStaff;

        return {
            totalStaff,
            activeStaff,
            blockedStaff,
            verifiedStaff
        };
    } catch (error) {
        console.error('Error fetching staff stats:', error);
        return {
            totalStaff: 0,
            activeStaff: 0,
            blockedStaff: 0,
            verifiedStaff: 0
        };
    }
}

export async function StaffDashboardWidget() {
    const stats = await getStaffStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={<Users className="w-6 h-6" />}
                label="Total Staff"
                value={stats.totalStaff}
                color="rust"
                description="All staff accounts"
            />
            <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                label="Active Staff"
                value={stats.activeStaff}
                color="olive"
                description="Unblocked & working"
            />
            <StatCard
                icon={<Lock className="w-6 h-6" />}
                label="Blocked Staff"
                value={stats.blockedStaff}
                color="warning"
                description="Temporarily blocked"
            />
            <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                label="Verified Staff"
                value={stats.verifiedStaff}
                color="gold"
                description="Email verified"
            />
        </div>
    );
}
