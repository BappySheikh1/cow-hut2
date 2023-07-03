import { Model, Types } from 'mongoose';
import { IUser } from '../Users/user.interface';

type CowLocations =
  | 'Dhaka'
  | 'Chronogram'
  | 'Barishal'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Comilla'
  | 'Rangpur'
  | 'Mymensingh';
type CowBreed =
  | 'Brahman'
  | 'Nellore'
  | 'Sahiwal'
  | 'Gir'
  | 'Indigenous'
  | 'Tharparkar'
  | 'Kankrej';
type CowLabel = 'for sale' | 'sold out';
type CowCategories = 'Dairy' | 'Beef' | 'Dual Purpose';

export type ICow = {
  name: string;
  age: string;
  price: string;
  location: CowLocations;
  breed: CowBreed;
  weight: string;
  label: CowLabel;
  category: CowCategories;
  seller: Types.ObjectId | IUser;
};

export type CowModel = Model<ICow, Record<string, unknown>>;

export type ICowFilters = {
  searchTerm?: string;
  location?: string;
};
