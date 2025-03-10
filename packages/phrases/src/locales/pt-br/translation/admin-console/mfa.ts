const mfa = {
  title: 'Autenticação de múltipiplos fatores',
  description:
    'Adicione autenticação de múltiplos fatores para aumentar a segurança da sua experiência de login.',
  factors: 'Fatores',
  multi_factors: 'Múltiplos fatores',
  multi_factors_description:
    'Os usuários precisam verificar um dos fatores habilitados para verificação em duas etapas.',
  totp: 'OTP do aplicativo autenticador',
  otp_description: 'Vincule o Google Authenticator, etc., para verificar senhas de uso único.',
  webauthn: 'WebAuthn (Senha)',
  webauthn_description:
    'Verifique via método suportado pelo navegador: biometria, digitalização de telefone ou chave de segurança, etc.',
  webauthn_native_tip: 'O WebAuthn não é suportado para aplicativos nativos.',
  webauthn_domain_tip:
    'O WebAuthn vincula chaves públicas ao domínio específico. Modificar o domínio do serviço bloqueará os usuários de autenticar através das senhas existentes.',
  backup_code: 'Código de backup',
  backup_code_description:
    'Gere 10 códigos de backup únicos após os usuários configurarem qualquer método MFA.',
  backup_code_setup_hint:
    'Quando os usuários não puderem verificar os fatores MFA acima, use a opção de backup.',
  backup_code_error_hint:
    'Para usar um código de backup, você precisa de pelo menos mais um método MFA para autenticação bem-sucedida do usuário.',
  policy: 'Política',
  policy_description: 'Defina a política MFA para fluxos de login e inscrição.',
  two_step_sign_in_policy: 'Política de verificação em duas etapas no login',
  user_controlled: 'Os usuários podem habilitar ou desabilitar o MFA por conta própria',
  user_controlled_tip:
    'Os usuários podem pular a configuração do MFA na primeira vez do login ou inscrição, ou habilitar/desabilitar nas configurações da conta.',
  mandatory: 'Os usuários sempre precisam usar o MFA no login',
  mandatory_tip:
    'Os usuários devem configurar o MFA na primeira vez do login ou inscrição e usá-lo em todos os logins futuros.',
  /** UNTRANSLATED */
  require_mfa: 'Require MFA',
  /** UNTRANSLATED */
  require_mfa_label:
    'Enable this to make 2-step verification mandatory for accessing your applications. If disabled, users can decide whether to enable MFA for themselves.',
  /** UNTRANSLATED */
  set_up_prompt: 'MFA set-up prompt',
  /** UNTRANSLATED */
  no_prompt: 'Do not ask users to set up MFA',
  /** UNTRANSLATED */
  prompt_at_sign_in_and_sign_up:
    'Ask users to set up MFA during registration (skippable, one-time prompt)',
  /** UNTRANSLATED */
  prompt_only_at_sign_in:
    'Ask users to set up MFA on their next sign-in attempt after registration (skippable, one-time prompt)',
};

export default Object.freeze(mfa);
