import Cookies from 'js-cookie';

import { UserStoreUserType } from '@/constants/types';
import { LOCAL_STORE } from '@/constants/key';


export const getCookieToken = (): string | '' => {
  const cookieToken = Cookies.get(LOCAL_STORE.LOCAL_TOKEN);
  return cookieToken || ''
};


export const getCookieUser = (): UserStoreUserType | '' => {
  const cookieUser = Cookies.get(LOCAL_STORE.LOCAL_USER);

  try {
    if (cookieUser && cookieUser !== "undefined" && cookieUser !== "null") {
      return JSON.parse(cookieUser) as UserStoreUserType;
    }
  } catch (error) {
    console.error("Failed to parse cookie user:", error);
  }

  return '';
};

export const handleSaveCookieToken = (token: string) => {
  Cookies.set(LOCAL_STORE.LOCAL_TOKEN, token, { expires: 7 });
}

export const handleSaveCookieEmail = (email: string) => {
  Cookies.set(LOCAL_STORE.EMAIL, email, { expires: 7 });
}


export const handleRemoveCookieEmail = () => {
  Cookies.remove(LOCAL_STORE.EMAIL);
}

export const getCookieEmail = (): string | '' => {
  const verifyEmail = Cookies.get(LOCAL_STORE.EMAIL);
  return verifyEmail || ''
};

export const handleSaveCookieUser = (user: string) => {
  Cookies.set(LOCAL_STORE.LOCAL_USER, user, { expires: 7 });
}


export const handleCleanCookie = () => {
  Cookies.remove(LOCAL_STORE.LOCAL_TOKEN);
  Cookies.remove(LOCAL_STORE.LOCAL_USER);
}

export const getUserRollTitle = (roll: number) => {
  switch (roll) {
    case 1:
      return 'Admin';
    case 2:
      return 'Consultant';
    case 3:
      return 'HR';
    case 4:
      return 'Accounts';
    case 5:
      return 'CEO';
    case 6:
      return 'Marketing Manager';
    case 7:
      return 'Branch Manager';
    case 8:
      return 'Oparation Manager';
    case 9:
      return 'Cordinater';
    default:
      return '';
  }
}