import { Request, Response, NextFunction } from 'express';
import { Product, ApiResponse, PaginatedResponse } from '@/shared/types';
import { products, getProductsByBrand, getProductById, searchProducts } from '../../data/products';
import { createError } from '../middleware/errorHandler';

export class ProductController {
  /**
   * Get all products with optional filtering
   */
  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        brand,
        category,
        search,
        minPrice,
        maxPrice,
        inStock,
        page = 1,
        limit = 20,
      } = req.query;

      let filteredProducts = products;

      // Filter by brand
      if (brand && typeof brand === 'string') {
        filteredProducts = getProductsByBrand(brand);
      }

      // Filter by category
      if (category && typeof category === 'string') {
        filteredProducts = filteredProducts.filter(
          product => product.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Search in name and description
      if (search && typeof search === 'string') {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Filter by price range
      if (minPrice && typeof minPrice === 'string') {
        const min = parseFloat(minPrice);
        filteredProducts = filteredProducts.filter(product => product.price >= min);
      }

      if (maxPrice && typeof maxPrice === 'string') {
        const max = parseFloat(maxPrice);
        filteredProducts = filteredProducts.filter(product => product.price <= max);
      }

      // Filter by stock availability
      if (inStock !== undefined) {
        const inStockBool = inStock === 'true';
        filteredProducts = filteredProducts.filter(product => product.inStock === inStockBool);
      }

      // Pagination
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 20;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      const response: PaginatedResponse<Product> = {
        data: paginatedProducts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limitNum),
        },
      };

      res.json({
        success: true,
        ...response,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific product by ID
   */
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = getProductById(id);

      if (!product) {
        return next(createError('Product not found', 404));
      }

      const response: ApiResponse<Product> = {
        success: true,
        data: product,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search products
   */
  searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, brand } = req.query;

      if (!q || typeof q !== 'string') {
        return next(createError('Search query is required', 400));
      }

      const brandFilter = brand && typeof brand === 'string' ? brand : undefined;
      const results = searchProducts(q, brandFilter);

      const response: ApiResponse<Product[]> = {
        success: true,
        data: results,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get product categories
   */
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { brand } = req.query;

      let filteredProducts = products;

      if (brand && typeof brand === 'string') {
        filteredProducts = getProductsByBrand(brand);
      }

      const categories = [...new Set(filteredProducts.map(product => product.category))];

      const response: ApiResponse<string[]> = {
        success: true,
        data: categories,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Add product to wishlist (B2C only)
   */
  addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      if (!user) {
        return next(createError('Authentication required', 401));
      }

      // B2B users cannot use wishlist
      if (user.brand === 'aura-wholesale') {
        return next(createError('Wishlist not available for B2B users', 403));
      }

      const product = getProductById(id);
      if (!product) {
        return next(createError('Product not found', 404));
      }

      // Placeholder: In a real implementation, this would add to user's wishlist in database
      console.log(`Adding product ${id} to wishlist for user ${user.id}`);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Product added to wishlist',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove product from wishlist (B2C only)
   */
  removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      if (!user) {
        return next(createError('Authentication required', 401));
      }

      // B2B users cannot use wishlist
      if (user.brand === 'aura-wholesale') {
        return next(createError('Wishlist not available for B2B users', 403));
      }

      const product = getProductById(id);
      if (!product) {
        return next(createError('Product not found', 404));
      }

      // Placeholder: In a real implementation, this would remove from user's wishlist in database
      console.log(`Removing product ${id} from wishlist for user ${user.id}`);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Product removed from wishlist',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new product (Admin only)
   */
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user) {
        return next(createError('Authentication required', 401));
      }

      // Check if user has admin role
      if (!user.roles.includes('admin')) {
        return next(createError('Admin access required', 403));
      }

      const productData = req.body;

      // Generate new product ID
      const newId = `${productData.brand}-${Date.now()}`;

      const newProduct: Product = {
        id: newId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        brand: productData.brand,
        category: productData.category,
        subcategory: productData.subcategory,
        images: productData.images || [],
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        inStock: true,
        stockQuantity: 0,
        tags: productData.tags || [],
        features: productData.features || [],
        careInstructions: productData.careInstructions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Placeholder: In a real implementation, this would save to database
      console.log('Creating new product:', newProduct);

      const response: ApiResponse<Product> = {
        success: true,
        data: newProduct,
        message: 'Product created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a product (Admin only)
   */
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;
      const updateData = req.body;

      if (!user) {
        return next(createError('Authentication required', 401));
      }

      // Check if user has admin role
      if (!user.roles.includes('admin')) {
        return next(createError('Admin access required', 403));
      }

      const product = getProductById(id);
      if (!product) {
        return next(createError('Product not found', 404));
      }

      // Update product with new data
      const updatedProduct: Product = {
        ...product,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      // Placeholder: In a real implementation, this would update in database
      console.log('Updating product:', updatedProduct);

      const response: ApiResponse<Product> = {
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a product (Admin only)
   */
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      if (!user) {
        return next(createError('Authentication required', 401));
      }

      // Check if user has admin role
      if (!user.roles.includes('admin')) {
        return next(createError('Admin access required', 403));
      }

      const product = getProductById(id);
      if (!product) {
        return next(createError('Product not found', 404));
      }

      // Placeholder: In a real implementation, this would delete from database
      console.log('Deleting product:', id);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Product deleted successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
