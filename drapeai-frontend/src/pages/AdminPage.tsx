import React, { useEffect, useState } from 'react';
import { productApi, orderApi } from '../services/api';
import { Product } from '../types';
import { OrderResponsePayload } from '../types/order';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBanner from '../components/TopBanner';
import { Plus, Edit, Trash2, Package, ShoppingBag, CheckCircle2, Clock, Truck, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderResponsePayload[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Create/Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'apparel' | 'footwear'>('apparel');
  const [price, setPrice] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [prodData, orderData] = await Promise.all([
        productApi.getProducts(),
        orderApi.getAllOrdersAdmin().catch(() => []),
      ]);
      setProducts(prodData);
      setOrders(orderData);
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory('apparel');
    setPrice(50);
    setImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productApi.updateProduct(editingProduct.id, { name, description, category, price, imageUrl });
      } else {
        await productApi.createProduct({ name, description, category, price, imageUrl });
      }
      setIsModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert('Failed to save product. Check backend connection.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(id);
        loadAdminData();
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      loadAdminData();
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <TopBanner />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-black/50">Management Console</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black">
              ADMIN PORTAL
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#F0EEED] p-1 rounded-full w-fit">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-black text-white shadow-md' : 'text-black/60 hover:text-black'
              }`}
            >
              Product Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-black text-white shadow-md' : 'text-black/60 hover:text-black'
              }`}
            >
              System Orders ({orders.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Product Inventory Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-black">All Catalog Products</h3>
              <button
                onClick={openCreateModal}
                className="shimmer-btn bg-black text-white text-xs px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black/90 transition shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-yellow-400" /> Add New Product
              </button>
            </div>

            {loading ? (
              <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-black" /></div>
            ) : (
              <div className="bg-[#F0EEED] rounded-[28px] p-6 border border-black/5 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-xs font-black uppercase tracking-wider text-black/60">
                      <th className="pb-4">Product</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-sm font-medium">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-black/5 transition">
                        <td className="py-4 flex items-center gap-3">
                          <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-cover rounded-xl bg-white" />
                          <div>
                            <p className="font-bold text-black">{prod.name}</p>
                            <p className="text-xs text-black/50 truncate max-w-xs">{prod.description}</p>
                          </div>
                        </td>
                        <td className="py-4 font-bold uppercase text-xs text-black/70">{prod.category}</td>
                        <td className="py-4 font-black text-black">${prod.price.toFixed(2)}</td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 rounded-full bg-white hover:bg-black hover:text-white transition shadow-sm"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: System Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight text-black">Customer Orders</h3>

            {orders.length === 0 ? (
              <div className="bg-[#F0EEED] p-12 rounded-[28px] text-center text-black/60 font-semibold">
                No orders registered in system yet.
              </div>
            ) : (
              <div className="bg-[#F0EEED] rounded-[28px] p-6 border border-black/5 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-xs font-black uppercase tracking-wider text-black/60">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Customer</th>
                      <th className="pb-4">Total</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-sm font-medium">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-black/5 transition">
                        <td className="py-4 font-bold text-black">#{ord.id}</td>
                        <td className="py-4 font-semibold text-black/80">{ord.userEmail}</td>
                        <td className="py-4 font-black text-black">${ord.totalAmount.toFixed(2)}</td>
                        <td className="py-4 font-bold text-xs">
                          <span className="px-3 py-1 rounded-full bg-white border border-black/10 text-black font-extrabold">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none focus:border-black cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal for Create / Edit Product */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-2xl border border-black/10 relative space-y-6"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#F0EEED] hover:bg-black hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-2xl font-black uppercase text-black tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-bold text-black focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
                    >
                      <option value="apparel">Apparel</option>
                      <option value="footwear">Footwear</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F0EEED] rounded-xl text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="shimmer-btn w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-black/90 transition shadow-xl active:scale-95 cursor-pointer mt-4"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
