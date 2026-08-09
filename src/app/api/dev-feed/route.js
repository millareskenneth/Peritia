import { NextResponse } from 'next/server';
import { getDevFeed, getLatestDevFeed } from '../../../lib/devFeed';

export const dynamic = 'force-static';

/**
 * Public development feed — populated by .github/workflows/dev-feed.yml on push.
 * GET /api/dev-feed?limit=10
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('limit');
  const limit = raw ? Math.min(Math.max(parseInt(raw, 10) || 0, 1), 60) : null;
  const feed = limit ? getLatestDevFeed(limit) : getDevFeed();

  return NextResponse.json(feed, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
