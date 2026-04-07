import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';

export async function POST(request: NextRequest) {
    try {
        const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'wordpicked/articles';

        if (!cloudName || !apiKey || !apiSecret) {
            return NextResponse.json(
                { success: false, error: 'Cloudinary environment variables are missing.' },
                { status: 500 },
            );
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = createHash('sha1').update(signaturePayload).digest('hex');

        return NextResponse.json({
            success: true,
            timestamp,
            signature,
            apiKey,
            cloudName,
            folder,
            uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate Cloudinary signature.',
            },
            { status: 500 },
        );
    }
}
