export interface Voucher {
  _id: string;
  code: string;
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  maxUsage: number | null;
  maxUsagePerUser: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  isPublic: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherInput {
  code: string;
  name: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  maxUsage?: number;
  maxUsagePerUser?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  isPublic?: boolean;
}

export interface UpdateVoucherInput extends Partial<CreateVoucherInput> {
  usageCount?: number;
}

export interface VoucherStatistics {
  total: number;
  active: number;
  expired: number;
  upcoming: number;
}
