import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wisdomwear.com.br';
    const adminPassword = process.env.ADMIN_PASSWORD || 'wisdom2026';

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Autenticado com sucesso' });
      
      // Cookie de sessão admin seguro de 24 horas
      response.cookies.set('wisdom_admin_session', 'authenticated_admin_token_wisdom_2026', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 dia
        path: '/'
      });

      return response;
    }

    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 });
  } catch (error) {
    console.error('[ADMIN LOGIN ERROR]', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
