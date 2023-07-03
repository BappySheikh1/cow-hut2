import { z } from "zod";
import { CowBreed, CowCategories, CowLevel, CowLocations } from "./cow.constant";

const createCowZodSchema = z.object({
    body: z.object({

      name: z.string({
        required_error: 'name is required',
      }),
      age: z.string({
        required_error: 'age is required',
      }),
      price: z.string({
        required_error: 'price is required',
      }),
      location: z.enum([...CowLocations] as [string, ...string[]], {
        required_error: 'location is required',
      }),
      breed: z.enum([...CowBreed] as [string, ...string[]], {
        required_error: 'breed is required',
      }),
      weight: z.string({
        required_error: 'weight is required',
      }),
      label: z.enum([...CowLevel] as [string, ...string[]], {
        required_error: 'label is required',
      }),
      category: z.enum([...CowCategories] as [string, ...string[]], {
        required_error: 'category is required',
      }),
      seller: z.string({
        required_error: 'seller is required',
      }),
      
    }),
  });


export const CowValidation ={
    createCowZodSchema,
}