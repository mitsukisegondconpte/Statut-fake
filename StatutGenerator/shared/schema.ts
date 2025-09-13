import { z } from "zod";

export const generateNamesSchema = z.object({
  count: z.number().min(1).max(50),
  type: z.enum(['french', 'creole', 'international', 'mixed']),
});

export const statusConfigSchema = z.object({
  viewCount: z.number().min(0),
  statusType: z.enum(['text', 'image']).default('text'),
  statusText: z.string().max(500),
  backgroundType: z.string(),
  viewerNames: z.array(z.string()),
  statusImage: z.string().optional(),
  imageName: z.string().optional(),
});

export type GenerateNamesRequest = z.infer<typeof generateNamesSchema>;
export type StatusConfig = z.infer<typeof statusConfigSchema>;

export interface GeneratedName {
  name: string;
  hasReacted: boolean;
  reaction: string;
  timeAgo: string;
  isOnline: boolean;
  avatar: string;
}
