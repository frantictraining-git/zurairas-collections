'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Tabs: 'orders', 'products', 'todo'
  const [activeTab, setActiveTab] = useState('orders');
  
  // Orders State
  const [orders, setOrders] = useState([]);
  
  // Products State
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // To-Do State (using localStorage for prototype)
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    const savedTodos = localStorage.getItem('zuraira_todos');
    if (savedTodos) {
      try { setTodos(JSON.parse(savedTodos)); } catch(e) {}
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ORDER ACTIONS
  const handleOrderAction = async (id, action) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.status === 401) return router.push('/admin/login');
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Action failed');
        return;
      }
      fetchOrders();
    } catch (err) { alert('Network error'); }
  };

  // PRODUCT ACTIONS
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id').toLowerCase().replace(/\s+/g, '-');
    const productData = {
      id: id,
      title: formData.get('title'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      images: [formData.get('image1')],
      story: formData.get('story'),
      fabric: formData.get('fabric'),
      care: formData.get('care'),
      inventory: {
        S: parseInt(formData.get('invS')) || 0,
        M: parseInt(formData.get('invM')) || 0,
        L: parseInt(formData.get('invL')) || 0,
        XL: parseInt(formData.get('invXL')) || 0,
      }
    };

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Failed to save product');
        return;
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {}
  };

  // TODO ACTIONS
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: Date.now(), text: newTodo }];
    setTodos(updated);
    localStorage.setItem('zuraira_todos', JSON.stringify(updated));
    setNewTodo('');
  };

  const handleDeleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    localStorage.setItem('zuraira_todos', JSON.stringify(updated));
  };


  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={styles.adminContainer}>
      
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>Zuraira's</h1>
        <nav>
          <div 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Recent Orders
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            👗 Products
          </div>
          <div 
            className={`${styles.navItem} ${activeTab === 'todo' ? styles.active : ''}`}
            onClick={() => setActiveTab('todo')}
          >
            📝 To-Do List
          </div>
        </nav>
        
        <div className={styles.logoutWrapper}>
          <button className={styles.logoutBtn} onClick={() => {
            document.cookie = 'admin_token=; Max-Age=0; path=/';
            router.push('/admin/login');
          }}>Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        {error && <p className={styles.error}>{error}</p>}

        {/* ─── ORDERS TAB ─── */}
        {activeTab === 'orders' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Recent Orders</h2>
              <span className={styles.orderCount}>{orders.length} total orders</span>
            </div>
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
                      <p><strong>Customer:</strong> {order.email}</p>
                      <p><strong>Payment:</strong> {order.paymentMethod === 'etransfer' ? '🍁 E-Transfer' : '💳 Stripe'}</p>
                      <p><strong>Total:</strong> CAD {order.total.toFixed(2)}</p>
                    </div>

                    <div className={styles.itemsList}>
                      <h4>Items</h4>
                      <ul>
                        {order.cartItems.map((item, idx) => (
                          <li key={idx}>{item.quantity}x {item.title} (Size: {item.size})</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {order.status === 'awaiting_payment' && (
                    <div className={styles.orderActions}>
                      <button className={styles.confirmBtn} onClick={() => handleOrderAction(order._id, 'confirm')}>
                        Confirm Payment Received
                      </button>
                      <button className={styles.cancelBtn} onClick={() => {
                        if(window.confirm('Cancel order and release inventory?')) handleOrderAction(order._id, 'cancel');
                      }}>
                        Cancel & Release Stock
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {orders.length === 0 && <div className={styles.emptyState}>No orders found.</div>}
            </div>
          </div>
        )}

        {/* ─── PRODUCTS TAB ─── */}
        {activeTab === 'products' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Product Inventory</h2>
              <button className={styles.addBtn} onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
                + Add New Product
              </button>
            </div>
            
            <div className={styles.tableWrapper}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Inventory (S/M/L/XL)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.id}>
                      <td>
                        {prod.images?.[0] && (
                          <img src={prod.images[0]} alt={prod.title} className={styles.productImg} />
                        )}
                      </td>
                      <td><strong>{prod.title}</strong><br/><span style={{color: '#666', fontSize: '0.8rem'}}>{prod.category}</span></td>
                      <td>CAD {prod.price.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.stockBadge} ${prod.inventory.S === 0 ? styles.soldOut : ''}`}>S: {prod.inventory.S}</span>
                        <span className={`${styles.stockBadge} ${prod.inventory.M === 0 ? styles.soldOut : ''}`}>M: {prod.inventory.M}</span>
                        <span className={`${styles.stockBadge} ${prod.inventory.L === 0 ? styles.soldOut : ''}`}>L: {prod.inventory.L}</span>
                        <span className={`${styles.stockBadge} ${prod.inventory.XL === 0 ? styles.soldOut : ''}`}>XL: {prod.inventory.XL}</span>
                      </td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => { setEditingProduct(prod); setIsModalOpen(true); }}>Edit</button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div className={styles.emptyState} style={{border: 'none'}}>No products found. Add one above!</div>}
            </div>
          </div>
        )}

        {/* ─── TO-DO LIST TAB ─── */}
        {activeTab === 'todo' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Boutique To-Do List</h2>
            </div>
            <div className={styles.todoList}>
              <form onSubmit={handleAddTodo} className={styles.todoForm}>
                <input 
                  type="text" 
                  value={newTodo} 
                  onChange={(e) => setNewTodo(e.target.value)} 
                  placeholder="e.g. Call vendor tomorrow" 
                  className={styles.todoInput}
                />
                <button type="submit" className={styles.todoBtn}>Add</button>
              </form>
              
              <div>
                {todos.map(todo => (
                  <div key={todo.id} className={styles.todoItem}>
                    <span>{todo.text}</span>
                    <button className={styles.actionBtn} onClick={() => handleDeleteTodo(todo.id)}>Done</button>
                  </div>
                ))}
                {todos.length === 0 && <p style={{color: '#666', textAlign: 'center', marginTop: '2rem'}}>You're all caught up!</p>}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PRODUCT MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveProduct}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input type="text" name="title" defaultValue={editingProduct?.title} required />
                </div>
                {!editingProduct && (
                  <div className={styles.formGroup}>
                    <label>ID (URL Slug)</label>
                    <input type="text" name="id" placeholder="e.g. green-silk-dress" required />
                  </div>
                )}
                {editingProduct && (
                  <input type="hidden" name="id" value={editingProduct.id} />
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price (CAD)</label>
                  <input type="number" step="0.01" name="price" defaultValue={editingProduct?.price} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select name="category" defaultValue={editingProduct?.category || 'Dresses'}>
                    <option value="Dresses">Dresses</option>
                    <option value="Sets">Sets</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Image URL</label>
                <input type="text" name="image1" placeholder="https://..." defaultValue={editingProduct?.images?.[0]} required />
                <small style={{color: '#666'}}>For now, paste a direct link to an image (e.g. from Shopify, Instagram, or Imgur)</small>
              </div>

              <div className={styles.formGroup}>
                <label>Story / Description</label>
                <textarea name="story" rows="3" defaultValue={editingProduct?.story}></textarea>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fabric</label>
                  <input type="text" name="fabric" defaultValue={editingProduct?.fabric} />
                </div>
                <div className={styles.formGroup}>
                  <label>Care</label>
                  <input type="text" name="care" defaultValue={editingProduct?.care} />
                </div>
              </div>

              <h4 style={{marginTop: '1rem', marginBottom: '0.5rem'}}>Inventory Quantities</h4>
              <div className={styles.inventoryGrid}>
                <div className={styles.formGroup}>
                  <label>Size S</label>
                  <input type="number" min="0" name="invS" defaultValue={editingProduct?.inventory?.S || 0} />
                </div>
                <div className={styles.formGroup}>
                  <label>Size M</label>
                  <input type="number" min="0" name="invM" defaultValue={editingProduct?.inventory?.M || 0} />
                </div>
                <div className={styles.formGroup}>
                  <label>Size L</label>
                  <input type="number" min="0" name="invL" defaultValue={editingProduct?.inventory?.L || 0} />
                </div>
                <div className={styles.formGroup}>
                  <label>Size XL</label>
                  <input type="number" min="0" name="invXL" defaultValue={editingProduct?.inventory?.XL || 0} />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
