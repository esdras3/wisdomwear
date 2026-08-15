import { NextResponse } from 'next/server';
import { wisdomEnv } from '@/lib/env';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = wisdomEnv.adminEmail();
    const adminPassword = wisdomEnv.adminPassword();

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin não configurado' }, { status: 503 });
    }

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
