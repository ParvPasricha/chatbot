import { Response } from 'express';

type SuccessResponse<T> = { success: true; data: T };
type FailureResponse = { success: false; message: string };

export const ok = <T>(res: Response, data: T, status = 200) => res.status(status).json({ success: true, data } as SuccessResponse<T>);

export const fail = (res: Response, message: string, status = 400) => res.status(status).json({ success: false, message } as FailureResponse);
