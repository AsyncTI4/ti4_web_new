import { attachments } from "@/entities/data/attachments";
import { AttachmentData } from "@/entities/data/types";

/**
 * Look up attachment data by ID
 */
export const getAttachmentData = (
  attachmentId: string
): AttachmentData | undefined => {
  return attachments.find((attachment) => attachment.id === attachmentId);
};

/**
 * Get the image path for an attachment by ID
 */
export const getAttachmentImagePath = (attachmentId: string): string | null => {
  const attachmentData = getAttachmentData(attachmentId);
  if (!attachmentData) return null;

  return `/attachment_token/${attachmentData?.imagePath}`;
};
