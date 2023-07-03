import { Model, Types } from "mongoose"
import { ICow } from "../Cow/cow.interface"
import { IUser } from "../Users/user.interface";

export type IOrders ={
    cow : Types.ObjectId | ICow  ;
    buyer : Types.ObjectId | IUser ;
}

export type OrdersModel = Model<IOrders, Record<string,unknown>>