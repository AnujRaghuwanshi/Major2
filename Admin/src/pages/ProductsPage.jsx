import { useEffect, useState } from 'react';
import * as api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function ProductsPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', categoryID: '', price: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const payload = await api.fetchProducts(session.token);
        if (active) {
          if (Array.isArray(payload)) {
            setProducts(payload.filter(p => p && p.id)); // Ensure all products have id
          } else {
            setProducts([]);
            setError('Invalid products data received from server');
          }
        }
      } catch (err) {
        if (active) setError(`⚠️ Unable to load products: ${err.message || 'Unknown error'}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [session.token]);

  const addProduct = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    
    if (!newProduct.name || !newProduct.categoryID || !newProduct.price || !newProduct.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if product already exists (case-insensitive)
    const productExists = products.some(
      (p) => p.name.toLowerCase() === newProduct.name.toLowerCase()
    );
    if (productExists) {
      setError('❌ Product already exist');
      return;
    }

    const productToCreate = {
      ...newProduct,
      categoryID: Number(newProduct.categoryID),
      price: Number(newProduct.price),
      image_url: newProduct.image_url ? newProduct.image_url.split(',').map(url => url.trim()) : [],
    };

    try {
      const created = await api.createProduct(productToCreate, session.token);
      if (created && created.id) {
        setProducts((current) => [...current, created]);
        setNewProduct({ name: '', categoryID: '', price: '', description: '', image_url: '' });
        setError(''); // Clear form
      } else {
        setError('Product created but response was invalid. Refreshing...');
        // Reload products to sync
        const updated = await api.fetchProducts(session.token);
        setProducts(updated);
      }
    } catch (err) {
      const errorMsg = err.message || 'Unable to add product';
      setError(`❌ ${errorMsg}`);
    }
  };

  const removeProduct = async (id) => {
    if (!id) {
      setError('❌ Invalid product ID');
      return;
    }
    
    try {
      await api.deleteProduct(id, session.token);
      setProducts((current) => current.filter((product) => product.id !== id));
      setError(''); // Clear on success
    } catch (err) {
      const errorMsg = err.message || 'Unable to delete product';
      setError(`❌ ${errorMsg}`);
    }
  };

  return (
<div className="section-grid">
        <section className="form-card">
          <div className="panel-header">
            <div>
              <h3>Add New Product</h3>
              <p className="eyebrow">Eco-friendly item management</p>
            </div>
          </div>
          <form onSubmit={addProduct} className="product-form">
            <div className="form-grid">
              <div className="field">
                <span>Name</span>
                <input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  type="text"
                  placeholder="EcoBamboo Toothbrush"
                  required
                />
              </div>
              <div className="field">
                <span>Category ID</span>
                <input
                  value={newProduct.categoryID}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
                  type="number"
                  placeholder="1"
                  required
                />
              </div>
              <div className="field">
                <span>Price (₹)</span>
                <input
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  type="number"
                  step="0.01"
                  placeholder="25"
                  required
                />
              </div>
              <div className="field">
                <span>Image URLs (comma sep.)</span>
                <input
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  type="text"
                  placeholder="https://example.com/img1.jpg, https://..."
                />
              </div>
            </div>
            <div className="field full-width-field">
              <span>Description</span>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows="4"
                placeholder="Sustainable product details..."
                required
              />
            </div>
            <div className="form-actions">
              <button className="primary-button button-block" type="submit" disabled={loading}>
                Add Product
              </button>
            </div>
            {error && <p className="form-message error">{error}</p>}
          </form>
        </section> <br />

        <section className="panel">
          <div className="panel-header">
            <h2>Products ({products.length})</h2>
            <div className="filter-group">
              <button className="chip">All</button>
              <button className="chip active">Active</button>
            </div>
          </div>

          {loading ? (
            <p className="eyebrow">Loading products…</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.categoryID}</td>
                      <td>{product.description?.substring(0, 60)}...</td>
                      <td>
                        <button 
                          className="table-action" 
                          onClick={() => removeProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
  );
}
