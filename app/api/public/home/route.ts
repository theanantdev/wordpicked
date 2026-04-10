import { NextRequest, NextResponse } from 'next/server';
import { fetchHomeData } from '@/utils/home-fetcher';

export const revalidate = 600; // 10 minutes cache

export async function GET(request: NextRequest) {
    try {
        const data = await fetchHomeData();

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch home data.' },
            { status: 500 },
        );
    }
}
