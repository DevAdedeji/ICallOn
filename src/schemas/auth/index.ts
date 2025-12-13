import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const signUpSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        username: z.string().min(3, "Username must be at least 3 characters"),
    })

export type SignUpFormInputs = z.infer<typeof signUpSchema>;
