import { NextResponse } from 'next/server';

const USERNAME = process.env.ADMIN_USERNAME || '0';
const PASSWORD = process.env.ADMIN_PASSWORD || '0';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (username === USERNAME && password === PASSWORD) {
    return NextResponse.json({ success: true }, {
      headers: {
        'Set-Cookie': `session=valid; Path=/; HttpOnly; SameSite=Lax`,
      },
    });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
