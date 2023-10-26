import bcrypt from 'bcrypt';

export const hashData = async (password: string): Promise<string> => {
  const salt = 10
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const hashCompare = async (password: string, hash: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash);
  return result;
};