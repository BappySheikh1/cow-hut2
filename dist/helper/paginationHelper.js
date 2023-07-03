"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelper = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    const minPrice = options.minPrice || 0;
    const maxPrice = options.maxPrice || 0;
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
    };
};
exports.PaginationHelper = { calculatePagination };
