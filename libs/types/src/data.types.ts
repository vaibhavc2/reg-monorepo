import {
  type SelectEmailCredential,
  type SelectPhoneDetail,
  type SelectUser,
} from '@reg/db';

type EmailDetail = Pick<SelectEmailCredential, 'email'>;
type PhoneDetail = Pick<SelectPhoneDetail, 'phone'>;
type PasswordDetail = Pick<SelectEmailCredential, 'password'>;

// user data types
export type UserData = SelectUser & EmailDetail & PhoneDetail;
export type UserWithPhone = SelectUser & PhoneDetail;
export type UserWithEmail = SelectUser & EmailDetail;

// query types
export type QueryUserData = SelectUser & {
  emailCredentials: EmailDetail;
  phoneDetails: PhoneDetail;
};
export type QueryUserWithPhone = SelectUser & {
  phoneDetails: PhoneDetail;
};
export type QueryUserWithEmail = SelectUser & {
  emailCredentials: EmailDetail;
};
export type QueryUserWithPassword = EmailDetail &
  PasswordDetail & {
    user: SelectUser;
  };
