import bcrypt from 'bcrypt';

export const hashData = (password: string): string => {
  const salt = 10
  return bcrypt.hash(password, salt);
};

export const hashCompare = (password: string, hash: string): boolean => {
  return bcrypt.compare(password, hash);
};