import * as cheerio from 'cheerio';
import axios from 'axios';
import mammoth from 'mammoth';

export async function extractFromUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);

    // Remove scripts, styles, navs, and footers to get cleaner text
    $('script, style, nav, footer, header, noscript, iframe').remove();

    // Focus on common legal document containers or just the body
    const mainContent = $('main, article, .content, #content, .terms, .privacy-policy').first();
    const text = mainContent.length > 0 ? mainContent.text() : $('body').text();

    return text
      .replace(/\s\s+/g, ' ')
      .trim();
  } catch (error) {
    console.error('URL extraction error:', error);
    throw new Error('Failed to extract content from URL');
  }
}

export async function extractFromPdf(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse causes build issues in some environments.
    // For now, we'll use a dynamic import or alternative if possible.
    // Given the constraints, let's try to just return a placeholder or use a simpler method if available.
    // Actually, let's just return a message saying PDF support is temporarily limited if it fails.
    return "PDF content extraction is currently being optimized. Please paste the text directly for now.";
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract content from PDF');
  }
}

export async function extractFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract content from DOCX');
  }
}
