import {  Schema, model } from "mongoose"
import { CowModel, ICow } from "./cow.interface"
import { CowBreed, CowCategories, CowLevel, CowLocations } from "./cow.constant"



const cowSchema = new Schema<ICow, CowModel>({
    name: {
        type: String,
        required : true
    },
    age: {
        type: String,
        required : true
    },
    price: {
        type: String,
        required : true
    },
    location: {
        type: String,
        enum : CowLocations,
        required : true
    },
    breed: {
        type: String,
        enum : CowBreed, 
        required : true
    },
    weight: {
        type: String,
        required : true,
    },
    label: {
        type: String,
        enum : CowLevel,
        required : true,
        default : "for sale"
    },
    category: {
        type: String,
        enum : CowCategories ,
        required : true
    },
    seller: {
        type: Schema.Types.ObjectId, // seller User ---> _id
        ref : "User",  
        required : true
    },
    
},
{
    timestamps : true,
    toJSON :{
      virtuals : true
    }
  }
)

// pre hook
// cowSchema.pre('save', async function (next) {
//     const isExist = await Cow.findOne({
//         category: this.category,
//         breed: this.breed,
        
//     });
//     if (isExist) {
//       throw new ApiError(httpStatus.CONFLICT, 'This Cow is already exist !');
//     }
//     next();
//   });

export const Cow  = model<ICow, CowModel>('Cow', cowSchema)