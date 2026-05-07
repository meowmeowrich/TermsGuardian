import { NextRequest, NextResponse } from 'next/server';
import { extractFromUrl, extractFromPdf, extractFromDocx } from '@/lib/document-parser';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { url } = await req.json();
      if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

      const content = await extractFromUrl(url);
      return NextResponse.json({ content });
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 });

      const buffer = Buffer.from(await file.arrayBuffer());
      let content = '';

      if (file.name.endsWith('.pdf')) {
        content = await extractFromPdf(buffer);
      } else if (file.name.endsWith('.docx')) {
        content = await extractFromDocx(buffer);
      } else if (file.name.endsWith('.txt')) {
        content = buffer.toString('utf-8');
      } else {
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
      }

      return NextResponse.json({ content });
    }

    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Extraction API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract content' }, { status: 500 });
  }
}
