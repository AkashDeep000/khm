import { z } from "zod";

export const createOfferSchema = z.object({
  projectId: z
    .string()
    .min(1, {
      message: "projectId is required",
    })
    .refine((s) => !s.includes(" "), "No spaces allowed"),

  offerId: z.coerce
    .number({
      invalid_type_error: "Please select a offer",
      required_error: "Please select a offer",
    })
    .int("offerId must be a possitive intiger")
    .positive({
      message: "offerId must be a possitive intiger",
    }),

  offerName: z
    .string({
      required_error: "Please select a offer",
    })
    .min(1, {
      message: "Please select a offer",
    }),

  creativeId: z.coerce
    .number({
      invalid_type_error: "Please select a creative",
      required_error: "Please select a creative",
    })
    .int("creativeId must be a possitive intiger")
    .positive({
      message: "creativeId must be a possitive intiger",
    }),

  creativeName: z
    .string({
      required_error: "Please select a creative",
    })
    .min(1, {
      message: "Please select a creative",
    }),
});

export const deleteOfferSchema = z.coerce
  .number({
    required_error: "offerId is required",
  })
  .int("offerId must be a possitive intiger")
  .positive({
    message: "offerId must be a possitive intiger",
  });
