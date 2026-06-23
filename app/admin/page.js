'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

import { compressImage } from '@/lib/compressImage';
import { uploadToFirebase } from '@/lib/uploadToFirebase';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Tabs: 'orders', 'products', 'categories', 'todo'
  const [activeTab, setActiveTab] = useState('orders');
  
  // State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [todos, setTodos] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productTitle, setProductTitle] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [productImageURL, setProductImageURL] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Todo Modal State
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [purchasePriceError, setPurchasePriceError] = useState('');
  const [inventoryError, setInventoryError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCategories();
    fetchTodos();
  }, []);

  // API Fetchers
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) setOrders(await res.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) setProducts(await res.json());
    } catch (err) { console.error(err); }
  };
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) setCategories(await res.json());
    } catch (err) { console.error(err); }
  };
  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/admin/todos');
      if (res.ok) setTodos(await res.json());
    } catch (err) { console.error(err); }
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
      if (res.ok) fetchOrders();
      else alert((await res.json()).message || 'Action failed');
    } catch (err) { alert('Network error'); }
  };

  // IMAGE UPLOAD (Compression + Firebase Upload)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);
    setToastMessage('Compressing image...');

    try {
      // 1. Compress the image
      const compressedFile = await compressImage(file);
      
      setToastMessage('Saving to cloud... 0%');

      // 2. Upload to Firebase
      const downloadURL = await uploadToFirebase(compressedFile, (pct) => {
        setUploadProgress(pct);
        setToastMessage(`Saving to cloud... ${pct}%`);
      });

      setProductImageURL(downloadURL);
      setToastMessage('Image uploaded successfully! ✨');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error('Image processing/upload failed:', error);
      setToastMessage(`Image Error: ${error.message || 'Upload failed'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // PRODUCT ACTIONS
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setProductTitle(title);
    if (!editingProduct) {
      // Auto-Slug
      setProductSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const productData = {
      id: id,
      title: productTitle,
      price: parseFloat(formData.get('price')),
      purchasePrice: parseFloat(formData.get('purchasePrice')) || 0,
      discountPercentage: parseFloat(formData.get('discountPercentage')) || 0,
      category: formData.get('category'),
      color: formData.get('color'),
      images: [productImageURL],
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

    if (productData.purchasePrice > productData.price) {
      setPurchasePriceError("Purchase Price cannot be greater than the Selling Price.");
      return;
    }
    setPurchasePriceError('');

    const totalInventory = productData.inventory.S + productData.inventory.M + productData.inventory.L + productData.inventory.XL;
    if (totalInventory === 0) {
      setInventoryError("Please enter stock quantity for at least one size (S, M, L, or XL).");
      return;
    }
    setInventoryError('');

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
      
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Failed to save product');
        return;
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) { alert('Error saving product'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) fetchProducts();
  };

  // CATEGORY ACTIONS
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    if (!name.trim()) return;
    const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) { e.target.reset(); fetchCategories(); }
    else alert((await res.json()).message);
  };
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCategories();
  };

  // TODO ACTIONS
  const handleSaveTodo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const todoData = {
      title: formData.get('title'),
      details: formData.get('details'),
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate')) : null,
      completed: formData.get('completed') === 'true'
    };

    const url = editingTodo ? `/api/admin/todos/${editingTodo._id}` : '/api/admin/todos';
    const method = editingTodo ? 'PUT' : 'POST';
    
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(todoData) });
    if (res.ok) { setIsTodoModalOpen(false); fetchTodos(); }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    const res = await fetch(`/api/admin/todos/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTodos();
  };

  const toggleTodoComplete = async (todo) => {
    await fetch(`/api/admin/todos/${todo._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !todo.completed }) });
    fetchTodos();
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={styles.adminContainer}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>Zuraira's</h1>
        <nav>
          <div className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`} onClick={() => setActiveTab('orders')}>📦 Recent Orders</div>
          <div className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`} onClick={() => setActiveTab('products')}>👗 Products</div>
          <div className={`${styles.navItem} ${activeTab === 'categories' ? styles.active : ''}`} onClick={() => setActiveTab('categories')}>📂 Categories</div>
          <div className={`${styles.navItem} ${activeTab === 'todo' ? styles.active : ''}`} onClick={() => setActiveTab('todo')}>📝 To-Do List</div>
        </nav>
        <div className={styles.logoutWrapper}>
          <button className={styles.logoutBtn} onClick={() => { document.cookie = 'admin_token=; Max-Age=0; path=/'; router.push('/admin/login'); }}>Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        {toastMessage && (
          <div className={styles.glassToast}>
            <span style={{flex: 1}}>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className={styles.closeToast}>✕</button>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}

        {/* ─── ORDERS TAB ─── */}
        {activeTab === 'orders' && (
          <div>
            <div className={styles.sectionHeader}><h2>Recent Orders</h2><span className={styles.orderCount}>{orders.length} orders</span></div>
            <div className={styles.orderList}>
              {orders.map(order => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderMeta}><h3>{order.orderId}</h3><span className={styles.date}>{new Date(order.createdAt).toLocaleString()}</span></div>
                    <div className={`${styles.statusBadge} ${styles[order.status]}`}>{order.status.replace('_', ' ').toUpperCase()}</div>
                  </div>
                  <div className={styles.orderDetails}>
                    <div className={styles.customerInfo}><p><strong>Customer:</strong> {order.email}</p><p><strong>Payment:</strong> {order.paymentMethod === 'etransfer' ? '🍁 E-Transfer' : '💳 Stripe'}</p><p><strong>Total:</strong> CAD {order.total.toFixed(2)}</p></div>
                    <div className={styles.itemsList}><h4>Items</h4><ul>{order.cartItems.map((item, idx) => (<li key={idx}>{item.quantity}x {item.title} (Size: {item.size})</li>))}</ul></div>
                  </div>
                  {order.status === 'awaiting_payment' && (
                    <div className={styles.orderActions}>
                      <button className={styles.confirmBtn} onClick={() => handleOrderAction(order._id, 'confirm')}>Confirm Payment</button>
                      <button className={styles.cancelBtn} onClick={() => window.confirm('Cancel order?') && handleOrderAction(order._id, 'cancel')}>Cancel & Release</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PRODUCTS TAB ─── */}
        {activeTab === 'products' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>Product Inventory</h2>
              <button className={styles.addBtn} onClick={() => { 
                setEditingProduct(null); setProductTitle(''); setProductSlug(''); setProductImageURL(''); setIsModalOpen(true); 
              }}>+ Add Product</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.productTable}>
                <thead><tr><th>Image</th><th>Title</th><th>Price</th><th>Inventory</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.id}>
                      <td>{prod.images?.[0] && <img src={prod.images[0]} alt={prod.title} className={styles.productImg} />}</td>
                      <td><strong>{prod.title}</strong><br/><span style={{color: '#666', fontSize: '0.8rem'}}>{prod.category}</span>
                        {prod.discountPercentage > 0 && <span style={{marginLeft: '8px', color: '#dc3545', fontSize: '0.8rem', fontWeight: 'bold'}}>-{prod.discountPercentage}% OFF</span>}
                      </td>
                      <td>CAD {prod.price.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.stockBadge} ${prod.inventory.S === 0 ? styles.soldOut : ''}`}>S: {prod.inventory.S}</span>
                        <span className={`${styles.stockBadge} ${prod.inventory.M === 0 ? styles.soldOut : ''}`}>M: {prod.inventory.M}</span>
                        <span className={`${styles.stockBadge} ${prod.inventory.L === 0 ? styles.soldOut : ''}`}>L: {prod.inventory.L}</span>
                        <span className={`${styles.stockBadge} ${prod.inventory.XL === 0 ? styles.soldOut : ''}`}>XL: {prod.inventory.XL}</span>
                      </td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => { 
                          setEditingProduct(prod); setProductTitle(prod.title); setProductSlug(prod.id); setProductImageURL(prod.images[0] || ''); setIsModalOpen(true); 
                        }}>Edit</button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── CATEGORIES TAB ─── */}
        {activeTab === 'categories' && (
          <div>
            <div className={styles.sectionHeader}><h2>Manage Categories</h2></div>
            <div className={styles.todoList}>
              <form onSubmit={handleAddCategory} className={styles.todoForm}>
                <input type="text" name="name" placeholder="e.g. Summer Collection" className={styles.todoInput} required />
                <button type="submit" className={styles.todoBtn}>Add Category</button>
              </form>
              <div>
                {categories.map(cat => (
                  <div key={cat._id} className={styles.todoItem}>
                    <span style={{fontWeight: 'bold'}}>{cat.name}</span>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteCategory(cat._id)}>Delete</button>
                  </div>
                ))}
                {categories.length === 0 && <p style={{textAlign: 'center', marginTop: '2rem'}}>No categories yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ─── TO-DO LIST TAB ─── */}
        {activeTab === 'todo' && (
          <div>
            {todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000)).length > 0 && (
              <div style={{ background: '#ffeeba', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ffeeba', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔔</span>
                <div>
                  <h4 style={{ margin: 0 }}>Reminder!</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>You have tasks that are overdue or due within the next 24 hours.</p>
                </div>
              </div>
            )}
            <div className={styles.sectionHeader}>
              <h2>Reminders & To-Dos</h2>
              <button className={styles.addBtn} onClick={() => { setEditingTodo(null); setIsTodoModalOpen(true); }}>+ Add Task</button>
            </div>
            <div className={styles.todoList}>
              {todos.map(todo => (
                <div key={todo._id} className={styles.todoItem} style={{opacity: todo.completed ? 0.6 : 1}}>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleTodoComplete(todo)} style={{width: '20px', height: '20px', cursor: 'pointer'}} />
                    <div>
                      <h4 style={{margin: '0', textDecoration: todo.completed ? 'line-through' : 'none'}}>{todo.title}</h4>
                      {todo.details && <p style={{margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#666'}}>{todo.details}</p>}
                      {todo.dueDate && <span style={{fontSize: '0.8rem', color: '#dc3545', fontWeight: 'bold'}}>Due: {new Date(todo.dueDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>}
                    </div>
                  </div>
                  <div>
                    <button className={styles.actionBtn} onClick={() => { setEditingTodo(todo); setIsTodoModalOpen(true); }}>Edit</button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                  </div>
                </div>
              ))}
              {todos.length === 0 && <p style={{textAlign: 'center', marginTop: '2rem'}}>You're all caught up!</p>}
            </div>
          </div>
        )}

      </main>

      {/* ─── PRODUCT MODAL ─── */}
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
                  <input type="text" name="title" value={productTitle} onChange={handleTitleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Slug / ID (Unique)</label>
                  <input type="text" name="id" value={productSlug} onChange={(e) => setProductSlug(e.target.value)} required readOnly={!!editingProduct} style={{backgroundColor: editingProduct ? '#f8f9fa' : '#fff'}} />
                  <small style={{color: '#666'}}>Auto-generated from title. Must be unique.</small>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Selling Price (CAD)</label>
                  <input type="number" step="0.01" name="price" defaultValue={editingProduct?.price || ''} onFocus={(e) => e.target.select()} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Purchase Price (Hidden)</label>
                  <input type="number" step="0.01" name="purchasePrice" defaultValue={editingProduct?.purchasePrice || ''} onFocus={(e) => e.target.select()} style={{ borderColor: purchasePriceError ? '#dc3545' : '', borderWidth: purchasePriceError ? '2px' : '1px' }} />
                  {purchasePriceError && (
                    <div style={{ marginTop: '0.5rem', padding: '0.4rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb', fontSize: '0.8rem' }}>
                      <strong>⚠️</strong> {purchasePriceError}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Discount (%)</label>
                  <input type="number" min="0" max="100" name="discountPercentage" defaultValue={editingProduct?.discountPercentage || ''} onFocus={(e) => e.target.select()} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  {categories.length === 0 ? (
                    <div style={{ padding: '0.8rem', background: '#fff3cd', color: '#856404', borderRadius: '4px', border: '1px solid #ffeeba', fontSize: '0.9rem' }}>
                      <strong>No Categories Found.</strong> You must go to the "📂 Categories" tab on the left sidebar and create a category first before you can add products.
                    </div>
                  ) : (
                    <select name="category" defaultValue={editingProduct?.category || ''} required>
                      <option value="" disabled>Select a Category...</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Primary Color</label>
                  <input type="text" name="color" list="colorSuggestions" defaultValue={editingProduct?.color || ''} placeholder="e.g. Red, Rose Gold, Teal" />
                  <datalist id="colorSuggestions">
                    <option value="Black" />
                    <option value="White" />
                    <option value="Beige / Nude" />
                    <option value="Grey" />
                    <option value="Red" />
                    <option value="Maroon / Burgundy" />
                    <option value="Blue" />
                    <option value="Navy" />
                    <option value="Green" />
                    <option value="Olive / Emerald" />
                    <option value="Yellow / Mustard" />
                    <option value="Pink" />
                    <option value="Purple" />
                    <option value="Orange" />
                    <option value="Brown" />
                    <option value="Gold" />
                    <option value="Silver" />
                    <option value="Multi-Color" />
                  </datalist>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Upload Photo (Use Camera or Gallery)</label>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  {/* HTML5 capture attribute removed to allow Photo Library access on iOS */}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{flex: 1}} disabled={uploadingImage} />
                  {uploadingImage && <span style={{fontWeight: 'bold', color: '#c4956a'}}>Uploading... {Math.round(uploadProgress)}%</span>}
                </div>
                {productImageURL && (
                  <div style={{marginTop: '1rem'}}>
                    <img src={productImageURL} alt="Preview" style={{height: '100px', borderRadius: '4px', border: '1px solid #ccc'}} />
                  </div>
                )}
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
              {inventoryError && (
                <div style={{ marginBottom: '1rem', padding: '0.6rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb', fontSize: '0.9rem' }}>
                  <strong>⚠️ Error:</strong> {inventoryError}
                </div>
              )}
              <div className={styles.inventoryGrid}>
                <div className={styles.formGroup}><label>Size S</label><input type="number" min="0" name="invS" defaultValue={editingProduct?.inventory?.S ?? ''} onFocus={(e) => e.target.select()} style={{ borderColor: inventoryError ? '#dc3545' : '' }} /></div>
                <div className={styles.formGroup}><label>Size M</label><input type="number" min="0" name="invM" defaultValue={editingProduct?.inventory?.M ?? ''} onFocus={(e) => e.target.select()} style={{ borderColor: inventoryError ? '#dc3545' : '' }} /></div>
                <div className={styles.formGroup}><label>Size L</label><input type="number" min="0" name="invL" defaultValue={editingProduct?.inventory?.L ?? ''} onFocus={(e) => e.target.select()} style={{ borderColor: inventoryError ? '#dc3545' : '' }} /></div>
                <div className={styles.formGroup}><label>Size XL</label><input type="number" min="0" name="invXL" defaultValue={editingProduct?.inventory?.XL ?? ''} onFocus={(e) => e.target.select()} style={{ borderColor: inventoryError ? '#dc3545' : '' }} /></div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={uploadingImage}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TODO MODAL ─── */}
      {isTodoModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{maxWidth: '500px'}}>
            <div className={styles.modalHeader}>
              <h3>{editingTodo ? 'Edit Task' : 'Add Task'}</h3>
              <button className={styles.closeModal} onClick={() => setIsTodoModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveTodo}>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input type="text" name="title" defaultValue={editingTodo?.title} required />
              </div>
              <div className={styles.formGroup}>
                <label>Details / Notes</label>
                <textarea name="details" rows="3" defaultValue={editingTodo?.details}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Due Date & Time (Optional)</label>
                <input type="datetime-local" name="dueDate" defaultValue={editingTodo?.dueDate ? new Date(new Date(editingTodo.dueDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} />
              </div>
              <div className={styles.formGroup} style={{display: 'none'}}>
                <input type="hidden" name="completed" value={editingTodo?.completed ? 'true' : 'false'} />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsTodoModalOpen(false)} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
