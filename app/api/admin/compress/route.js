import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { cookies } from 'next/headers';

export async function POST(request) {
  // Security: only admins can compress
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (token?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress using Sharp
    const compressedBuffer = await sharp(buffer)
      .resize({
        width: 1080,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 }) // WebP is incredibly efficient
      .toBuffer();

    // Convert to base64 so we can easily send it back to the client to upload to Firebase
    const base64 = `data:image/webp;base64,${compressedBuffer.toString('base64')}`;

    return NextResponse.json({ base64 });
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json({ message: 'Error compressing image on server' }, { status: 500 });
  }
}
