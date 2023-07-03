/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { IOrders } from './order.interface';
import { Order } from './order.model';
import { Cow } from '../Cow/cow.model';
import { User } from '../Users/user.model';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';

const createOrder = async (order: IOrders): Promise<IOrders | null> => {
  const session = await mongoose.startSession();

  const cow = await Cow.findById(order.cow).session(session);
  if (!cow) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cow with ID ${order.cow} does not exist!`
    );
  }

  if (cow.label === 'sold out') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'The product is already sold out!'
    );
  }

  const buyer = await User.findById(order.buyer).session(session);
  if (!buyer) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Buyer with ID ${order.buyer} does not exist!`
    );
  }

  if (Number(buyer.budget) < Number(cow.price)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Insufficient funds to buy the cow.'
    );
  }

  const updatedBudget = Number(buyer.budget) - Number(cow.price);
  buyer.budget = updatedBudget;
  await buyer.save();

  if (cow.seller) {
    const seller = await User.findById(cow.seller).session(session);
    if (!seller) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found.');
    }

    const updatedIncome = Number(seller.income) + Number(cow.price);
    seller.income = updatedIncome;
    await seller.save();
  }

  session.startTransaction();

  try {
    cow.label = 'sold out';
    await cow.save();

    const orderData: IOrders = {
      cow: order.cow,
      buyer: order.buyer,
    };
    const confirmOrder = await Order.create([orderData], { session });

    if (!confirmOrder || confirmOrder.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'confirm order not create');
    }

    await session.commitTransaction();
    await session.endSession();

    return confirmOrder[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getAllOrder = async (
  userId: string,
  role: string
): Promise<IOrders[] | null> => {
  // console.log(role, userId, "Admin and UserId");

  let result: IOrders[] = [];

  // Check if the user role is 'admin'
  if (role === 'admin') {
    result = await Order.find({}).populate('buyer').populate({
      path: 'cow',
      populate: 'seller',
    });
  } else if (role === 'buyer') {
    // Retrieve orders for the specific buyer
    result = await Order.find({ buyer: userId }).populate('buyer').populate({
      path: 'cow',
      populate: 'seller',
    });
  } else if (role === 'seller') {
    // Retrieve orders for the specific seller
    result = await Cow.find({ seller: userId }).populate('buyer').populate({
      path: 'cow',
      populate: 'seller',
    });
  }

  return result;
};

// const getSingleOrder = async (id: string, role: string, userId: string) => {
//   // console.log( `mongodb _id ${id}`, role, `auth id ${userId}`, 'SingleOrder get');
//   let singleOrder = null;

//   if (role === 'admin') {
//     singleOrder = await Order.findById(id).populate('buyer').populate({
//       path: 'cow',
//       populate: 'seller',
//     });
//   } else if (role === 'buyer') {
//     singleOrder = await Order.findOne({ _id: id, 'buyer._id': userId })
//       .populate('buyer')
//       .populate({
//         path: 'cow',
//         populate: 'seller',
//       });
//   }
//   else if (role === 'seller') {
//     singleOrder = await Order.findOne({ _id: id, 'cow.seller._id': userId });
//   }
//   console.log(singleOrder);

//   if (!singleOrder) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
//   }

//   return singleOrder;

// };

const getSingleOrder = async (id: string, role: string, userId: string) => {
  let singleOrder: IOrders | null = null;

  if (role === 'buyer') {
    // console.log('Buyer', {'buyer._id': userId});
    const myOrder = await Order.findOne({ _id: id, buyer: userId })
      .populate('buyer')
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .lean();
    if (myOrder) {
      singleOrder = myOrder;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This is not your order Id');
    }
  } else if (role === 'seller') {
    const order = await Order.findOne({ _id: id })
      .populate('buyer')
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .lean();

    if (!order) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found');
    }
    const { cow } = order;
    const sellerCow = await Cow.findOne({ _id: cow }).lean();

    if (!sellerCow) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found');
    }

    const { seller } = sellerCow;
    if (seller.toString() !== userId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'user is no the seller. Access denied'
      );
    }

    singleOrder = order;
  }else if(role === 'admin'){
    singleOrder =await Order.findOne({_id:id}).populate('buyer')
    .populate({
      path: 'cow',
      populate: [
        {
          path: 'seller',
        },
      ],
    })
    .lean();
  
  }

  return singleOrder;
};

export const OrderService = {
  createOrder,
  getAllOrder,
  getSingleOrder,
};
