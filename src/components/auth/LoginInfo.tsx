import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const LoginInfo = () => {
  return (
    <Alert className="mb-6">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Test Admin Credentials</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <strong>Admin Account:</strong>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div>Email:</div>
              <div className="font-mono">admin@cakechemist.com</div>
              <div>Password:</div>
              <div className="font-mono">admin123</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Note: For regular users, any email/password combination will work.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default LoginInfo;
