import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';
import { User, Auth0User } from '@/shared/types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth0User?: Auth0User;
    }
  }
}

export interface JWTPayload {
  sub: string;
  email: string;
  'https://aura-commerce.com/brand'?: string;
  'https://aura-commerce.com/roles'?: string[];
  'https://aura-commerce.com/organization_id'?: string;
  'https://aura-commerce.com/is_premium'?: boolean;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401);
    }

    // Placeholder for Auth0 JWT verification
    // In a real implementation, this would verify the JWT with Auth0's public key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload;
    
    // Convert Auth0 user to our User type
    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      firstName: decoded.email.split('@')[0], // Placeholder
      lastName: 'User', // Placeholder
      brand: decoded['https://aura-commerce.com/brand'] as any || 'luxeloom',
      roles: decoded['https://aura-commerce.com/roles'] || ['customer'],
      organizationId: decoded['https://aura-commerce.com/organization_id'],
      isPremium: decoded['https://aura-commerce.com/is_premium'] || false,
      linkedAccounts: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    req.user = user;
    req.auth0User = decoded as Auth0User;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(createError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(createError('Authentication required', 401));
  }
  next();
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    if (!req.user.roles.includes(role)) {
      return next(createError(`Role '${role}' required`, 403));
    }

    next();
  };
};

export const requireAnyRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    const hasRole = req.user.roles.some(role => roles.includes(role));
    if (!hasRole) {
      return next(createError(`One of roles [${roles.join(', ')}] required`, 403));
    }

    next();
  };
};

// Fine-Grained Authorization (FGA) middleware
export const requireFGA = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    try {
      // Placeholder for FGA check
      // In a real implementation, this would call Auth0 FGA or similar service
      const hasPermission = await checkFGAPermission(req.user, resource, action, req.params);
      
      if (!hasPermission) {
        return next(createError(`Permission denied for ${action} on ${resource}`, 403));
      }

      next();
    } catch (error) {
      next(createError('Authorization check failed', 500));
    }
  };
};

// Placeholder FGA permission check
const checkFGAPermission = async (
  user: User,
  resource: string,
  action: string,
  params: any
): Promise<boolean> => {
  // Simulate FGA check based on user roles and context
  console.log(`FGA Check: User ${user.id} requesting ${action} on ${resource}`);
  
  // Example FGA policies
  if (resource === 'orders' && action === 'read') {
    // Users can read their own orders
    return true;
  }
  
  if (resource === 'orders' && action === 'write') {
    // Only admins can write orders in B2B context
    return user.roles.includes('admin');
  }
  
  if (resource === 'users' && action === 'write') {
    // Only admins can manage users
    return user.roles.includes('admin');
  }
  
  if (resource === 'vip-lounge' && action === 'read') {
    // Only premium members can access VIP lounge
    return user.isPremium || user.roles.includes('premium-member');
  }
  
  // Default deny
  return false;
};

// Brand-specific middleware
export const requireBrand = (brand: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    if (req.user.brand !== brand) {
      return next(createError(`Access denied for brand '${brand}'`, 403));
    }

    next();
  };
};

// B2B specific middleware
export const requireB2B = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(createError('Authentication required', 401));
  }

  if (req.user.brand !== 'aura-wholesale') {
    return next(createError('B2B access required', 403));
  }

  next();
};

// Organization-specific middleware for B2B
export const requireSameOrganization = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(createError('Authentication required', 401));
  }

  const targetOrgId = req.params.organizationId || req.body.organizationId;
  
  if (req.user.organizationId !== targetOrgId) {
    return next(createError('Access denied: different organization', 403));
  }

  next();
};
