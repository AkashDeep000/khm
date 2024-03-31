import { z } from "zod";

export const getCreativesSchema = z.coerce
  .number({
    required_error: "offerId is required",
  })
  .int("offerId must be a possitive intiger")
  .positive({
    message: "offerId must be a possitive intiger",
  });
