import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ugycrdps';
    const apiKey = process.env.CLOUDINARY_API_KEY || '622877224394382';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'WeuUsXuVoUK8-JsuYITOWydQZSo';

    if (!file && !base64Data) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'typetunes_newspaper_studio';

    // Generate SHA1 signature
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const cloudinaryFormData = new FormData();
    if (file) {
      cloudinaryFormData.append('file', file);
    } else if (base64Data) {
      cloudinaryFormData.append('file', base64Data);
    }

    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('signature', signature);
    cloudinaryFormData.append('folder', folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.warn('[Cloudinary Upload Error]:', errorText);
      // Fallback: If network issue, use local object URL or placeholder
      return NextResponse.json({
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
        fallback: true,
      });
    }

    const data = await uploadResponse.json();
    return NextResponse.json({
      url: data.secure_url || data.url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    });
  } catch (err: any) {
    console.error('[Cloudinary API Route Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during upload' },
      { status: 500 }
    );
  }
}
