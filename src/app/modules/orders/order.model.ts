import { Schema, model } from "mongoose";
import { IOrders, OrdersModel } from "./order.interface";

const ordersSchema =new Schema<IOrders,OrdersModel>({
  cow:{
    type : Schema.Types.ObjectId,
    ref :"Cow",
    required: true
  },
  buyer:{
    type : Schema.Types.ObjectId,
    ref :"User",
    required: true
  }
},{
    timestamps:true,
    toJSON:{
        virtuals : true
    }
})


export const Order =model<IOrders,OrdersModel>('Order', ordersSchema)