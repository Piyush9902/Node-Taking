import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, getErrorMessage } from '../lib/api';
import { useSetAtom } from 'jotai';
import { setAuthAtom } from '../state/auth';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const sendSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  dob: z.string().optional(),
});

const verifySchema = z.object({
  email: z.string().email('Valid email required'),
  code: z.string().min(6, 'Enter 6-digit OTP'),
  name: z.string().optional(),
  dob: z.string().optional(),
});

export default function AuthPage() {
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const setAuth = useSetAtom(setAuthAtom);

  const {
    register: registerSend,
    handleSubmit: handleSubmitSend,
    formState: { errors: errorsSend },
    getValues,
  } = useForm<z.infer<typeof sendSchema>>({ resolver: zodResolver(sendSchema) });

  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    formState: { errors: errorsVerify },
  } = useForm<z.infer<typeof verifySchema>>({ resolver: zodResolver(verifySchema) });

  async function onSend(values: z.infer<typeof sendSchema>) {
    setLoading(true);
    setServerMsg(null);
    try {
      const { data } = await api.post('/auth/send-otp', values);
      setServerMsg(data.message || 'OTP sent');
      setStep('verify');
    } catch (e) {
      setServerMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(values: z.infer<typeof verifySchema>) {
    setLoading(true);
    setServerMsg(null);
    try {
      const { data } = await api.post('/auth/verify-otp', values);
      setAuth({ token: data.token, user: data.user });
    } catch (e) {
      setServerMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle(idToken: string) {
    setLoading(true);
    setServerMsg(null);
    try {
      const { data } = await api.post('/auth/google', { idToken });
      setAuth({ token: data.token, user: data.user });
    } catch (e) {
      setServerMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <div className="auth-container">
      <h1>Welcome to Notes</h1>
      {serverMsg && <div className="server-msg">{serverMsg}</div>}
      {step === 'send' ? (
        <form onSubmit={handleSubmitSend(onSend)} className="card">
          <label>
            Name
            <input type="text" {...registerSend('name')} placeholder="Your name" />
            {errorsSend.name && <span>{errorsSend.name.message}</span>}
          </label>
          <label>
            Email
            <input type="email" {...registerSend('email')} placeholder="you@example.com" />
            {errorsSend.email && <span>{errorsSend.email.message}</span>}
          </label>
          <label>
            Date of birth (optional)
            <input type="date" {...registerSend('dob')} />
          </label>
          <button disabled={loading} type="submit">{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitVerify((vals) =>
            onVerify({ ...vals, email: getValues('email'), name: getValues('name'), dob: getValues('dob') })
          )}
          className="card"
        >
          <label>
            OTP Code
            <input type="text" maxLength={6} {...registerVerify('code')} placeholder="6-digit code" />
            {errorsVerify.code && <span>{errorsVerify.code.message}</span>}
          </label>
          <button disabled={loading} type="submit">{loading ? 'Verifying...' : 'Verify OTP'}</button>
        </form>
      )}

      <div className="divider">or</div>

      <GoogleOAuthProvider clientId={googleClientId}>
        <GoogleLogin
          onSuccess={(cred) => cred.credential && onGoogle(cred.credential)}
          onError={() => setServerMsg('Google sign-in failed')}
          useOneTap
        />
      </GoogleOAuthProvider>
    </div>
  );
}


