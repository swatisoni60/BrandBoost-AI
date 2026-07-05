"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Package, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  inventory: number;
  sales: number;
  revenue: number;
  status: string;
}

const emptyForm = { name: "", description: "", category: "General", price: 0, inventory: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ products: Product[] }>("/products");
      setProducts(data.products);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, category: p.category, price: p.price, inventory: p.inventory });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/products", form);
        toast.success("Product added");
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="min-h-screen md:pl-64">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-10 md:py-10">
        <div className="mb-8 flex items-center justify-between">
          <Navbar title="Products" />
        </div>

        <div className="mb-4 flex justify-end">
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="glass-card overflow-x-auto p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-white/40">
              <Loader2 size={18} className="animate-spin" /> Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/40">
              <Package size={28} />
              <p>No products yet. Add your first one.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Inventory</th>
                  <th className="px-6 py-4">Sales</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-white/50">{p.category}</td>
                    <td className="px-6 py-4">₹{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">{p.inventory}</td>
                    <td className="px-6 py-4">{p.sales}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-mint-500/15 px-2.5 py-1 text-xs font-medium text-mint-500">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="text-white/40 hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display font-semibold">{editingId ? "Edit Product" : "Add Product"}</h3>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div>
                  <label className="label-text">Name</label>
                  <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label-text">Description</label>
                  <textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Category</label>
                    <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-text">Price (₹)</label>
                    <input type="number" min={0} required className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="label-text">Inventory</label>
                  <input type="number" min={0} className="input-field" value={form.inventory} onChange={(e) => setForm({ ...form, inventory: Number(e.target.value) })} />
                </div>
                <button type="submit" disabled={saving} className="btn-primary mt-2 w-full">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : editingId ? "Save Changes" : "Add Product"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
