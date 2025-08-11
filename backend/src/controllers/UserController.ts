import { Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse } from '@/shared/types';

export class UserController {
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user) {
        return next(createError('User not found', 404));
      }

      const response: ApiResponse<any> = {
        success: true,
        data: user,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const updateData = req.body;

      if (!user) {
        return next(createError('User not found', 404));
      }

      // Placeholder for profile update
      console.log('Updating profile for user:', user.id);

      const updatedUser = { ...user, ...updateData };

      const response: ApiResponse<any> = {
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getOrganizationUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { role, page = 1, limit = 20 } = req.query;

      if (!user) {
        return next(createError('User not found', 404));
      }

      // Placeholder for getting organization users
      console.log('Getting organization users for:', user.organizationId);

      const mockUsers = [
        {
          id: 'user_456',
          email: 'john@company.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'buyer',
          organizationId: user.organizationId,
        },
        {
          id: 'user_789',
          email: 'jane@company.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'admin',
          organizationId: user.organizationId,
        },
      ];

      const response: PaginatedResponse<any> = {
        data: mockUsers,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: mockUsers.length,
          totalPages: 1,
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

  createOrganizationUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const userData = req.body;

      if (!user) {
        return next(createError('User not found', 404));
      }

      // Placeholder for creating organization user
      console.log('Creating organization user:', userData.email);

      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        organizationId: user.organizationId,
        createdAt: new Date().toISOString(),
      };

      const response: ApiResponse<any> = {
        success: true,
        data: newUser,
        message: 'User created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateOrganizationUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;
      const updateData = req.body;

      if (!user) {
        return next(createError('User not found', 404));
      }

      // Placeholder for updating organization user
      console.log('Updating organization user:', id);

      const updatedUser = {
        id,
        ...updateData,
        organizationId: user.organizationId,
        updatedAt: new Date().toISOString(),
      };

      const response: ApiResponse<any> = {
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  deactivateOrganizationUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { user } = req;

      if (!user) {
        return next(createError('User not found', 404));
      }

      // Placeholder for deactivating organization user
      console.log('Deactivating organization user:', id);

      const response: ApiResponse<null> = {
        success: true,
        message: 'User deactivated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
