import { z } from "zod";

export const signupSchema = z.object({
	username: z.string({
		required_error: "Username is required"
	}).trim().max(24).min(1, {
		message: "Username is required"
	}).refine((s) => !s.includes(" "), "No spaces allowed for username"),

	password: z.string().trim().max(24).min(4, {
		message: "Password must be longer than 4 chrecter"
	}).refine((s) => !s.includes(" "), "No spaces allowed for password"),
})

  export const loginSchema = z.object({
	username: z.string({
		required_error: "Username is required"
	}).trim().max(24).min(1, {
		message: "Username is required"
	}).refine((s) => !s.includes(" "), "No spaces allowed for username"),

	password: z.string({
		required_error: "Password is required"
	}).trim().max(24).min(1, {
		message: "Password is required"
	}).refine((s) => !s.includes(" "), "No spaces allowed for password"),
  })