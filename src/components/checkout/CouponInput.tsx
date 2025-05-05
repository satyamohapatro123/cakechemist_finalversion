import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { validateCoupon, CouponValidationResult } from "@/models/Coupon";
import { useAuth } from "@/context/AuthContext";
import { validatePhone } from "@/utils/security";

interface CouponInputProps {
  orderTotal: number;
  onApplyCoupon: (result: CouponValidationResult, mobileNumber?: string) => void;
  onRemoveCoupon: () => void;
  appliedCoupon: CouponValidationResult | null;
  productIds?: string[];
  requireMobileNumber?: boolean;
}

const CouponInput = ({
  orderTotal,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  productIds,
  requireMobileNumber = true
}: CouponInputProps) => {
  const { currentUser } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setValidationError("Please enter a coupon code");
      return;
    }

    if (!currentUser) {
      setValidationError("You must be logged in to apply a coupon");
      return;
    }

    // Validate mobile number if required
    if (requireMobileNumber) {
      if (!mobileNumber.trim()) {
        setValidationError("Please enter your mobile number");
        return;
      }

      // Remove any non-digit characters for validation
      const cleanMobileNumber = mobileNumber.replace(/\D/g, '');

      if (!validatePhone(cleanMobileNumber)) {
        setValidationError("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const result = validateCoupon(
        couponCode,
        currentUser.id,
        orderTotal,
        requireMobileNumber ? mobileNumber : undefined,
        productIds
      );

      if (result.valid) {
        onApplyCoupon(result, requireMobileNumber ? mobileNumber : undefined);
        setCouponCode("");
        setMobileNumber("");
      } else {
        setValidationError(result.message);
      }
    } catch (error) {
      setValidationError("An error occurred while validating the coupon");
      console.error("Coupon validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="coupon-code">Coupon Code</Label>

      {appliedCoupon ? (
        <div className="space-y-3">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 flex justify-between items-center">
              <div>
                <span className="font-medium">{appliedCoupon.coupon?.code}</span> applied:
                {" "}
                {appliedCoupon.discountAmount &&
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(appliedCoupon.discountAmount)
                } discount
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveCoupon}
                className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3">
            <div>
              <Input
                id="coupon-code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="uppercase"
                disabled={isValidating}
              />
            </div>

            {requireMobileNumber && (
              <div>
                <Label htmlFor="mobile-number" className="text-sm text-muted-foreground mb-1 block">
                  Mobile Number (for coupon validation)
                </Label>
                <Input
                  id="mobile-number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your 10-digit mobile number"
                  disabled={isValidating}
                  type="tel"
                  maxLength={10}
                />
              </div>
            )}

            <div>
              <Button
                onClick={handleApplyCoupon}
                disabled={isValidating || !couponCode.trim() || (requireMobileNumber && !mobileNumber.trim())}
                className="w-full"
              >
                {isValidating ? "Checking..." : "Apply Coupon"}
              </Button>
            </div>
          </div>

          {validationError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponInput;
