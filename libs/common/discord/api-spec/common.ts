import { UserFlags, UserPremiumType } from 'discord-api-types/v10';
import { z } from 'zod';

export const userFlagsSchema: z.ZodType<UserFlags> = z.nativeEnum(UserFlags);

export const userPremiumTypeSchema: z.ZodType<UserPremiumType> = z.nativeEnum(UserPremiumType);

// export const APIUserSchema: z.ZodType<APIUser> = z.object({
//   id: snowflakeSchema,
//   username: z.string(),
//   discriminator: z.string(),
//   global_name: z.string().nullable(),
//   avatar: z.string().nullable(),
//   bot: z.boolean().optional(),
//   system: z.boolean().optional(),
//   mfa_enabled: z.boolean().optional(),
//   banner: z.string().optional().nullable(),
//   accent_color: z.number().optional().nullable(),
//   locale: z.string().optional(),
//   verified: z.boolean().optional(),
//   email: z.string().optional().nullable(),
//   flags: userFlagsSchema.optional(),
//   premium_type: userPremiumTypeSchema.optional(),
//   public_flags: userFlagsSchema.optional(),
//   avatar_decoration: z.string().optional().nullable(),
// });
