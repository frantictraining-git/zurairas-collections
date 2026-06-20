'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Action failed');
        return;
      }

      // Refresh orders
      fetchOrders();
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Zuraira's Collections Admin</h1>
        <button className={styles.logoutBtn} onClick={() => {
          document.cookie = 'admin_token=; Max-Age=0; path=/';
          router.push('/admin/login');
        }}>Logout</button>
      </header>

      <main className={styles.main}>
        <div className={styles.sectionHeader}>
          <h2>Recent Orders</h2>
          <span className={styles.orderCount}>{orders.length} total orders</span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <h3>{order.orderId}</h3>
                  <span className={styles.date}>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.customerInfo}>
                  <p><strong>Customer Email:</strong> {order.email}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod === 'etransfer' ? '🍁 E-Transfer' : '💳 Stripe'}</p>
                  <p><strong>Total:</strong> CAD {order.total.toFixed(2)}</p>
                </div>

                <div className={styles.itemsList}>
                  <h4>Items ({order.cartItems.length})</h4>
                  <ul>
                    {order.cartItems.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity}x {item.title} (Size: {item.size}) - CAD {(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {order.status === 'awaiting_payment' && (
                <div className={styles.orderActions}>
                  <button 
                    className={styles.confirmBtn}
                    onClick={() => handleAction(order._id, 'confirm')}
                  >
                    Confirm Payment Received
                  </button>
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => {
                      if(window.confirm('Are you sure you want to cancel this order? Inventory will be restored.')) {
                        handleAction(order._id, 'cancel');
                      }
                    }}
                  >
                    Cancel & Release Stock
                  </button>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className={styles.emptyState}>No orders found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
