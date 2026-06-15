import { z } from "zod";

export const uploadReceiptSchema = z.object({
  transactionId: z.string().uuid(),
});

export type UploadReceiptRequest =
  z.infer<typeof uploadReceiptSchema>;