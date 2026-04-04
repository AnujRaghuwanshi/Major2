const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the ProductCategory schema
const ProductCategorySchema = new Schema({
    category_name: { type: String, required: true },    
});

// Create and export the model
const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);
module.exports = ProductCategory;
