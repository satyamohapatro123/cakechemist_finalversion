/**
 * Coupon model for the CakeChemist application
 */

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  maxUsage: number;
  maxUsagePerUser: number;
  isActive: boolean;
  categories?: string[];
  products?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CouponUsage {
  couponId: string;
  userId: string;
  orderId: string;
  usedAt: string;
  discountAmount: number;
  orderTotal: number;
  mobileNumber?: string; // Mobile number for tracking usage per customer
}

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount?: number;
}

/**
 * Validates a coupon for a given user and order
 * @param couponCode - The coupon code to validate
 * @param userId - The user ID
 * @param orderTotal - The total order amount
 * @param items - Optional array of product IDs in the order
 * @returns A validation result object
 */
export const validateCoupon = (
  couponCode: string,
  userId: string,
  orderTotal: number,
  mobileNumber?: string,
  items?: string[]
): CouponValidationResult => {
  // Get coupons from localStorage
  const couponsJson = localStorage.getItem('coupons');
  if (!couponsJson) {
    return { valid: false, message: 'Coupon not found' };
  }

  const coupons: Coupon[] = JSON.parse(couponsJson);
  const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());

  if (!coupon) {
    return { valid: false, message: 'Coupon not found' };
  }

  // Check if coupon is active
  if (!coupon.isActive) {
    return { valid: false, message: 'This coupon is no longer active' };
  }

  // Check date validity
  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);

  if (now < startDate) {
    return { valid: false, message: 'This coupon is not yet active' };
  }

  if (now > endDate) {
    return { valid: false, message: 'This coupon has expired' };
  }

  // Check minimum order value
  if (orderTotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
    };
  }

  // Check usage limits
  const usagesJson = localStorage.getItem('couponUsages');
  if (usagesJson) {
    const usages: CouponUsage[] = JSON.parse(usagesJson);

    // Check total usage limit
    const couponUsages = usages.filter(u => u.couponId === coupon.id);
    if (couponUsages.length >= coupon.maxUsage) {
      return { valid: false, message: 'This coupon has reached its usage limit' };
    }

    // Check per-user usage limit
    const userCouponUsages = couponUsages.filter(u => u.userId === userId);
    if (userCouponUsages.length >= coupon.maxUsagePerUser) {
      return { valid: false, message: 'You have already used this coupon the maximum number of times' };
    }

    // Check per-mobile number usage limit if mobile number is provided
    if (mobileNumber) {
      const mobileNumberUsages = couponUsages.filter(u => u.mobileNumber === mobileNumber);
      if (mobileNumberUsages.length >= coupon.maxUsagePerUser) {
        return {
          valid: false,
          message: 'This coupon has already been used the maximum number of times with this mobile number'
        };
      }
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderTotal * coupon.discountValue) / 100;

    // Apply max discount if specified
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    // Fixed discount
    discountAmount = coupon.discountValue;
  }

  return {
    valid: true,
    message: 'Coupon applied successfully',
    coupon,
    discountAmount
  };
};

/**
 * Records the usage of a coupon
 * @param couponId - The coupon ID
 * @param userId - The user ID
 * @param orderId - The order ID
 * @param discountAmount - The discount amount applied
 * @param orderTotal - The total order amount
 */
export const recordCouponUsage = (
  couponId: string,
  userId: string,
  orderId: string,
  discountAmount: number,
  orderTotal: number,
  mobileNumber?: string
): void => {
  const usage: CouponUsage = {
    couponId,
    userId,
    orderId,
    usedAt: new Date().toISOString(),
    discountAmount,
    orderTotal,
    mobileNumber
  };

  // Get existing usages
  const usagesJson = localStorage.getItem('couponUsages');
  let usages: CouponUsage[] = [];

  if (usagesJson) {
    usages = JSON.parse(usagesJson);
  }

  // Add new usage
  usages.push(usage);

  // Save back to localStorage
  localStorage.setItem('couponUsages', JSON.stringify(usages));
};
