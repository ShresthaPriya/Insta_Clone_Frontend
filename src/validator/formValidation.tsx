import {z} from 'zod';

export const registrationSchema = z.object({
  fullname: z.string().nonempty("All field required").min(3, "Full name must be 3 characters long"),
  username: z.string().nonempty("All field required").min(3, "Username must be 3 characters long"),
  phoneNumber: z.string().regex(/^(98|97|91)\d{8}$/,"Invalid phone number").length(10),
  password: z.string().nonempty( "All fields required" ).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ), 
});

export type RegisterFormInput = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
      phoneNumber: z.string().regex(/^(98|97|91)\d{8}$/, "Invalid phone number").length(10),
  password: z.string().nonempty( "All fields required" ).min(8),

})

export type LoginInput = z.infer<typeof loginSchema>;


export const resetPasswordSchema = z.object({
      email: z.string().email("Invalid email address"),
})

export type ResetFormInputs = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
    fullname: z.string().nonempty("All field required").min(3, "Full name must be 3 characters long"),
  username: z.string().nonempty("All field required").min(3, "Username must be 3 characters long"),
 phoneNumber: z.string().regex(/^(98|97|91)\d{8}$/, "Invalid phone number").length(10),
  email: z.email().optional(),
  bio: z.string().max(150).optional(),
  gender: z.enum(["M","F", "Prefer not to say"])


})

export type profileInput = z.infer<typeof profileSchema>;