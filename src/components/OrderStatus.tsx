import { ShoppingCart, CreditCard, Truck, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import React from "react";
import "../styles/components.css";

interface Order {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_way' | 'delivered' | 'failed' | 'delayed';
  paymentStatus: 'pending' | 'success' | 'failed';
  estimatedTime?: string;
}

interface OrderStatusProps {
  order: Order;
}

const OrderStatus = ({ order }: OrderStatusProps) => {
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'status-pending', text: 'Order Pending', description: 'Waiting for confirmation' };
      case 'confirmed':
        return { icon: CheckCircle, color: 'status-confirmed', text: 'Order Confirmed', description: 'Being prepared' };
      case 'preparing':
        return { icon: ShoppingCart, color: 'status-preparing', text: 'Preparing', description: 'Kitchen is working on your order' };
      case 'on_way':
        return { icon: Truck, color: 'status-on-way', text: 'Out for Delivery', description: 'Driver is on the way' };
      case 'delivered':
        return { icon: CheckCircle, color: 'status-delivered', text: 'Delivered', description: 'Enjoy your meal!' };
      case 'failed':
        return { icon: XCircle, color: 'status-failed', text: 'Order Failed', description: 'Something went wrong' };
      case 'delayed':
        return { icon: AlertTriangle, color: 'status-delayed', text: 'Delayed', description: 'Taking longer than expected' };
      default:
        return { icon: Clock, color: 'status-unknown', text: 'Unknown', description: '' };
    }
  };

  const getPaymentStatusConfig = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return { color: 'payment-pending', text: 'Payment Pending' };
      case 'success':
        return { color: 'payment-success', text: 'Payment Successful' };
      case 'failed':
        return { color: 'payment-failed', text: 'Payment Failed' };
      default:
        return { color: 'payment-unknown', text: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="order-status">
      <div className="order-status-content">
        <div className="order-status-left">
          <div className={`order-status-icon ${statusConfig.color}`}>
            <StatusIcon />
          </div>
          <div className="order-status-info">
            <div className="order-status-title-row">
              <h3 className="order-status-title">Order #{order.id}</h3>
              <span className="badge outline">
                {order.restaurant}
              </span>
            </div>
            <p className="order-status-desc">{statusConfig.description}</p>
            {order.estimatedTime && (
              <p className="order-status-time">Est. delivery: {order.estimatedTime}</p>
            )}
          </div>
        </div>
        
        <div className="order-status-right">
          <div className="order-status-payment-row">
            <span className={`badge ${paymentConfig.color}`}>
              <CreditCard className="order-status-payment-icon" />
              {paymentConfig.text}
            </span>
          </div>
          <p className="order-status-total">${order.total}</p>
        </div>
      </div>
      
      {order.items.length > 0 && (
        <div className="order-status-items">
          <p>
            <span>Items:</span> {order.items.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
