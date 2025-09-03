import { nanoid } from 'nanoid';

export const uniqueId = () => `${+new Date()}_${nanoid(8)}`;
