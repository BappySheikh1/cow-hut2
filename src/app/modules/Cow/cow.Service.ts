import { SortOrder } from 'mongoose';
import { PaginationHelper } from '../../../helper/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { CowsSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';
import ApiError from '../../../error/ApiError';
import httpStatus from 'http-status';

const createCow = async (cow: ICow): Promise<ICow | null> => {
  const result = await Cow.create(cow);
  return result;
};

const getAllCow = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[] | null>> => {
  // filter start
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: CowsSearchableFields.map(fields => ({
        [fields]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  //  Exact match
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  //  filter end
  //pagination start
  const { limit, page, skip, sortBy, sortOrder, minPrice, maxPrice } =
    PaginationHelper.calculatePagination(paginationOptions);

  if (minPrice !== 0 && maxPrice !== 0) {
    andConditions.push({
      $and: [
        {
          price: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        },
      ],
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // pagination end
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);
  return {
    meta: {
      limit,
      page,
      total,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById({ _id: id }).populate('seller');
  return result;
};

const updateCow = async (
  id: string,
  cow: Partial<ICow>,
  userSeller: string
): Promise<ICow | null> => {

  const sellerData = await Cow.findById(id);
  
  if (sellerData?.seller.toString() !== userSeller) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Access denied. you are not this seller this cow'
    );
  }

  const result = await Cow.findByIdAndUpdate(id, cow, { new: true }).populate(
    'seller'
  );
  return result;
};

const deleteCow = async (id: string,userSeller:string): Promise<ICow | null> => {
    const sellerData = await Cow.findById(id);
    if (sellerData?.seller.toString() !== userSeller) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Access denied. you are not this seller this cow'
      );
    }
  const result = await Cow.findByIdAndDelete({ _id: id }).populate('seller');
  return result;
};

export const CowService = {
  createCow,
  getAllCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
