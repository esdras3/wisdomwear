/**
 * Resolução de variáveis de ambiente com aliases multi-tenant.
 * Prefixo canônico: WISDOMWEAR_* — aliases legados aceitos.
 */
export function pickEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined && value !== '') {
      return value;
    }
  }
  return '';
}

export function hasEnv(...keys: string[]): boolean {
  return pickEnv(...keys) !== '';
}

export const wisdomEnv = {
  appUrl: () =>
    pickEnv('WISDOMWEAR_APP_URL', 'NEXT_PUBLIC_APP_URL') || 'https://wisdomwear.com.br',

  tenantId: () => pickEnv('WISDOMWEAR_TENANT_ID', 'NEXT_PUBLIC_TENANT_ID') || 'wisdomwear',

  adminEmail: () =>
    pickEnv('WISDOMWEAR_ADMIN_EMAIL', 'ADMIN_EMAIL') || 'admin@wisdomwear.com.br',

  adminPassword: () => pickEnv('WISDOMWEAR_ADMIN_PASSWORD', 'ADMIN_PASSWORD'),

  databaseUrl: () => pickEnv('WISDOMWEAR_DATABASE_URL', 'DATABASE_URL'),

  asaasApiUrl: () =>
    pickEnv('WISDOMWEAR_ASAAS_API_URL', 'ASAAS_API_URL') ||
    'https://sandbox.asaas.com/api/v3',

  asaasApiKey: () =>
    pickEnv('WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY', 'ASAAS_SUBACCOUNT_API_KEY'),

  asaasWebhookSecret: () =>
    pickEnv('WISDOMWEAR_ASAAS_WEBHOOK_SECRET', 'ASAAS_WEBHOOK_SECRET'),

  melhorEnvioApiUrl: () =>
    pickEnv('WISDOMWEAR_MELHOR_ENVIO_API_URL', 'MELHOR_ENVIO_API_URL') ||
    'https://sandbox.melhorenvio.com.br/api/v2',

  melhorEnvioToken: () =>
    pickEnv('WISDOMWEAR_MELHOR_ENVIO_TOKEN', 'MELHOR_ENVIO_TOKEN'),

  melhorEnvioOriginPostal: () =>
    pickEnv('WISDOMWEAR_MELHOR_ENVIO_POSTAL_CODE_ORIGIN', 'MELHOR_ENVIO_POSTAL_CODE_ORIGIN') ||
    '01001000',
};
