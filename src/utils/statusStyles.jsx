import { Clock, ShoppingBag, Truck, CheckCircle, XCircle } from 'lucide-react';

export const statusConfigs = {
  pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-100', icon: <Clock className="h-5 w-5" /> },
  processing: { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <ShoppingBag className="h-5 w-5" /> },
  shipped: { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: <Truck className="h-5 w-5" /> },
  delivered: { color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle className="h-5 w-5" /> },
  cancelled: { color: 'text-red-600 bg-red-50 border-red-100', icon: <XCircle className="h-5 w-5" /> },
  rejected: { color: 'text-red-600 bg-red-50 border-red-100', icon: <XCircle className="h-5 w-5" /> },
};
