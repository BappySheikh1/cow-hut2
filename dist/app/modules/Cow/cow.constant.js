"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowsSearchableFields = exports.CowsFilterableFields = exports.CowCategories = exports.CowLevel = exports.CowBreed = exports.CowLocations = void 0;
exports.CowLocations = ["Dhaka",
    "Chronogram",
    "Barishal",
    "Rajshahi",
    "Sylhet",
    "Comilla", "Rangpur", "Mymensingh"];
exports.CowBreed = ["Brahman", "Nellore", "Sahiwal", "Gir", "Indigenous", "Tharparkar", "Kankrej"];
exports.CowLevel = ["for sale", "sold out"];
exports.CowCategories = ['Dairy', 'Beef', 'Dual Purpose'];
exports.CowsFilterableFields = [
    'searchTerm',
    'location',
    'name',
    'price',
    'breed'
];
exports.CowsSearchableFields = ['location', 'price', 'name', 'breed'];
