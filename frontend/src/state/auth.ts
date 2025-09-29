import { atom } from 'jotai';

export type User = {
  _id: string;
  name: string;
  email: string;
  provider: 'otp' | 'google';
  dob?: string;
};

export const tokenAtom = atom<string | null>(
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
);

export const userAtom = atom<User | null>(null);

export const setAuthAtom = atom(null, (_get, set, auth: { token: string; user: User }) => {
  localStorage.setItem('token', auth.token);
  set(tokenAtom, auth.token);
  set(userAtom, auth.user);
});

export const clearAuthAtom = atom(null, (_get, set) => {
  localStorage.removeItem('token');
  set(tokenAtom, null);
  set(userAtom, null);
});


