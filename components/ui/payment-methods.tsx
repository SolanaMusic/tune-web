import { Check, CreditCard, Shield, Bitcoin } from "lucide-react";

const PaymentMethods = () => {
  return (
    <div className="mt-16 bg-card border rounded-lg p-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
          <p className="text-muted-foreground mb-6">
            We accept various payment methods to make your subscription process
            seamless and secure.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
              <CreditCard className="h-5 w-5" />
              <span>Credit Card</span>
            </div>
            <div className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border">
              <Bitcoin className="h-5 w-5" />
              <span>Crypto</span>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-background p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Secure Transactions</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              All payments are processed securely. We use industry-standard
              encryption to protect your personal and financial information.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">256-bit SSL encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">PCI DSS compliant</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Fraud protection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
