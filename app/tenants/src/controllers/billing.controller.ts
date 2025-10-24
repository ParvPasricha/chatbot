import { Request, Response } from 'express';
import { calculateSubscription } from '../services/billing.service';

export const billingSummaryHandler = (req: Request, res: Response) => {
  const { plan, conversationCount } = req.body;
  const amount = calculateSubscription(plan, conversationCount ?? 0);
  return res.json({ success: true, amount });
};
