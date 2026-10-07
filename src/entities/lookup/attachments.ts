import { attachments } from "@/entities/data/attachments";
import { indexBy } from "@/entities/lookup/indexBy";
import type { AttachmentData } from "@/entities/data/types";

const attachmentsMap = indexBy(attachments, (attachment) => attachment.id);

export const getAttachmentData = (
  attachmentId: string,
): AttachmentData | undefined => attachmentsMap.get(attachmentId);

export const getAttachmentImagePath = (attachmentId: string): string | null => {
  const attachmentData = getAttachmentData(attachmentId);
  if (!attachmentData) return null;
  return `/attachment_token/${attachmentData.imagePath}`;
};
