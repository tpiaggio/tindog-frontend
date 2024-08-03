import * as z from "zod";

const DogSchema = z.object({
  name: z
    .string()
    .min(2, {message: "Name must be at least 2 characters."})
    .max(15, {message: "Name must be at most 15 characters."}),
  gender: z.enum(["male", "female"]),
  breed: z.string({message: "Breed is required."}),
  age: z.number().int().min(1, {message: "It should be a valid age"}),
  ageUnit: z.enum(["months", "years"]),
  size: z.enum(["small", "medium", "large"]),
  description: z.string({message: "Description is required."}),
});

export default DogSchema;
