import { z } from "zod";

export const createProjectSchema = z.object({
  projectId: z
    .string()
    .min(1, {
      message: "projectId is required",
    }).toLowerCase()
    .refine((s) => !s.includes(" "), "No spaces allowed"),

  affiliateId: z.coerce
    .number({
      invalid_type_error: "Please select an affiliate",
      required_error: "Please select an affiliate",
    }).int("affiliateId must be an possitive intiger").positive({
      message: "affiliateId must be a possitive intiger",
    }),

  affiliateName: z
    .string({
      required_error: "Please select an affiliate",
    })
    .min(1, {
      message: "Please select an affiliate",
    }),
});

export const deleteProjectSchema = z
    .string()
    .min(1, {
      message: "projectId is required",
    })
    .refine((s) => !s.includes(" "), "No spaces allowed")
