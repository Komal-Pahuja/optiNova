import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Header from './Header';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './api';
//imports 
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container main">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

const backendOrigin = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const getProductImage = (image) => {
  if (!image) return null;
  return image.startsWith('/uploads') ? `${backendOrigin}${image}` : image;
};

const Home = () => {
  const { user } = useAuth();
  const slides = useMemo(
    () => [
      {
        title: 'Find Your Perfect Vision Style',
        description: 'Shop eyeglasses, sunglasses, and contact lenses with easy filters and secure checkout.',
        link: '/products',
        button: 'Browse All Products',
        action: user ? 'Explore Products' : 'Create Account',
      },
      {
        title: 'Autumn Frames Collection',
        description: 'Discover warm-tone frames crafted for comfort, style, and everyday confidence.',
        link: '/products',
        button: 'Explore Frames',
        action: user ? 'Browse Now' : 'Join Now',
      },
      {
        title: 'Premium Lenses, Better Vision',
        description: 'From anti-glare to blue-light filters, customize lenses for your daily routine.',
        link: '/products',
        button: 'Shop Lenses',
        action: user ? 'Shop Now' : 'Get Started',
      },
    ],
    [user]
  );

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((value) => (value + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <section className="hero hero-carousel" aria-label="Featured collections">
        <div className="carousel-slides">
          {slides.map((slide, index) => (
            <article
              key={slide.title}
              className={`carousel-slide slide-${index + 1} ${index === activeSlide ? 'is-active' : ''}`}
              aria-hidden={index !== activeSlide}
            >
              <div className="carousel-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <div className="hero-actions">
                  <NavLink className="btn" to={slide.link}>
                    {slide.button}
                  </NavLink>
                  {user ? (
                    <NavLink className="btn btn-outline" to={slide.link}>
                      {slide.action}
                    </NavLink>
                  ) : (
                    <NavLink className="btn btn-outline" to="/register">
                      {slide.action}
                    </NavLink>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="carousel-control prev" type="button" onClick={() => setActiveSlide((value) => (value - 1 + slides.length) % slides.length)}>
          &#10094;
        </button>
        <button className="carousel-control next" type="button" onClick={() => setActiveSlide((value) => (value + 1) % slides.length)}>
          &#10095;
        </button>

        <div className="carousel-dots" aria-label="Choose slide">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeSlide ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="grid-3">
        <article className="card">
          <h3>Eyeglasses</h3>
          <p>Prescription-ready frames for everyday comfort and style.</p>
          <NavLink to="/products">Shop now</NavLink>
        </article>
        <article className="card">
          <h3>Sunglasses</h3>
          <p>Polarized and fashion-forward options for complete UV protection.</p>
          <NavLink to="/products">Shop now</NavLink>
        </article>
        <article className="card">
          <h3>Contact Lenses</h3>
          <p>Daily and monthly lenses for clear, convenient vision.</p>
          <NavLink to="/products">Shop now</NavLink>
        </article>
      </section>

      <section className="home-showcase" aria-label="Featured highlights">
        <div className="showcase-grid-top">
          <article className="showcase-tile tile-large">
            <img src="/uploads/ss1.jpg" alt="Featured eyeglass collection" />
            <div className="tile-content">
              <h3>Atelier Collection</h3>
              <p>Minimal frames and warm tones for everyday style.</p>
            </div>
          </article>

          <div className="stacked-tiles">
            <article className="showcase-tile tile-small">
              <img src="/uploads/ss2.jpg" alt="Meet an optometrist" />
              <div className="tile-content">
                <h3>Meet an Optometrist</h3>
                <p>Book your next eye-care consultation online.</p>
              </div>
            </article>

            <article className="showcase-tile tile-small">
              <img src="/uploads/ss3.jpg" alt="Newsletter subscription" />
              <div className="tile-content">
                <h3>Join Our Newsletter</h3>
                <p>Get seasonal launches and exclusive offers first.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="showcase-grid-middle">
          <article className="showcase-tile tile-article">
            <img src="/uploads/ss4.jpg" alt="Guide to choosing glasses" />
            <div className="tile-content">
              <h3>Choose Better Glasses</h3>
              <p>A quick guide to finding frames that fit your face and lifestyle.</p>
              <NavLink to="/products">View Article</NavLink>
            </div>
          </article>

          <div className="showcase-side">
            <aside className="showcase-notes">
              <img src="/uploads/ss8.jpg" alt="Tips and trends" className="notes-image" />
              <h4>Tips and Trends</h4>
              <p>Lens care essentials and new frame trends curated by our experts.</p>
              <NavLink to="/products">Visit the Blog</NavLink>
            </aside>

            <div className="showcase-mini-grid">
              <article className="showcase-tile tile-mini">
                <img src="/uploads/ss6.jpg" alt="Eyeglass trend highlight" />
              </article>
              <article className="showcase-tile tile-mini">
                <img src="/uploads/ss7.jpg" alt="Style inspiration for frames" />
              </article>
            </div>
          </div>
        </div>

        <article className="showcase-banner">
          <img src="/uploads/ss5.jpg" alt="Visit our stores" />
          <div className="banner-content">
            <h3>18 Boutiques Nearby</h3>
            <p>Find your closest store and book a fitting.</p>
            <NavLink className="btn" to="/products">
              Find a Store
            </NavLink>
          </div>
        </article>
      </section>
    </>
  );
};

const Products = () => {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    frameTypes: [],
    lensTypes: [],
    genderTypes: [],
  });
  const [query, setQuery] = useState({
    category: '',
    brand: '',
    frameType: '',
    lensType: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadFilters = async () => {
    try {
      const data = await apiGet('/api/products/filters');
      setFilters(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = params.toString() ? `/api/products?${params.toString()}` : '/api/products';
      const data = await apiGet(url);
      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilters();
    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadProducts();
  };

  return (
    <div className="products-page">
      <section className="card filters-section">
        <h2>Filter Products</h2>
        <form onSubmit={handleSubmit} className="filters-form">
          <select name="category" value={query.category} onChange={handleChange}>
            <option value="">All Categories</option>
            {filters.categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="brand" value={query.brand} onChange={handleChange}>
            <option value="">All Brands</option>
            {filters.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select name="frameType" value={query.frameType} onChange={handleChange}>
            <option value="">All Frame Types</option>
            {filters.frameTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select name="lensType" value={query.lensType} onChange={handleChange}>
            <option value="">All Lens Types</option>
            {filters.lensTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select name="gender" value={query.gender} onChange={handleChange}>
            <option value="">All Genders</option>
            {filters.genderTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input type="number" name="minPrice" placeholder="Min Price" value={query.minPrice} onChange={handleChange} />
          <input type="number" name="maxPrice" placeholder="Max Price" value={query.maxPrice} onChange={handleChange} />
          <button className="btn" type="submit">
            Apply
          </button>
        </form>
      </section>
      {message && <p className="error">{message}</p>}
      <section className="products-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found for selected filters.</p>
        ) : (
          products.map((product) => (
            <article className="card product-card" key={product._id}>
              <img src={getProductImage(product.image) || 'https://via.placeholder.com/400x240?text=Eyeglass'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.brand} • {product.category?.name || 'Uncategorized'}</p>
              <p className="price">${Number(product.price).toFixed(2)}</p>
              <NavLink className="btn" to={`/products/${product._id}`}>
                View Details
              </NavLink>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const loadProduct = async () => {
    try {
      const data = await apiGet(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleCart = async () => {
    try {
      await apiPost('/api/customer/cart', { productId: id, quantity });
      navigate('/customer/cart');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleWishlist = async () => {
    try {
      await apiPost('/api/customer/wishlist/toggle', { productId: id });
      navigate('/customer/wishlist');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <section className="card product-detail">
      <img src={getProductImage(product.image) || 'https://via.placeholder.com/500x320?text=Eyeglass'} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Category:</strong> {product.category?.name || 'Uncategorized'}</p>
        <p><strong>Frame:</strong> {product.frameType}</p>
        <p><strong>Lens:</strong> {product.lensType}</p>
        <p><strong>Gender:</strong> {product.gender}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        <p>{product.description}</p>
        {message && <p className="error">{message}</p>}
        {user ? (
          user.role === 'customer' ? (
            <>
              <div className="inline-form">
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                <button className="btn" type="button" onClick={handleCart}>
                  Add to Cart
                </button>
              </div>
              <button className="btn btn-outline" type="button" onClick={handleWishlist}>
                Toggle Wishlist
              </button>
            </>
          ) : (
            <p>Customer purchase actions are not available for admin accounts.</p>
          )
        ) : (
          <p><NavLink to="/login">Login</NavLink> to add items to cart or wishlist.</p>
        )}
      </div>
    </section>
  );
};

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card-split">
        <div className="auth-panel">
          <div className="auth-panel__content">
            <span className="brand-sm">Eyeglass Store</span>
            <h1>Welcome Back</h1>
            <p>Secure sign in for quick access to your account and shopping cart.</p>
            <div className="auth-card-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <h1>Login</h1>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input className="auth-input" type="email" name="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="auth-input" type="password" name="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="auth-button" type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card-split">
        <div className="auth-panel">
          <div className="auth-panel__content">
            <span className="brand-sm">Eyeglass Store</span>
            <h1>Join Eyeglass</h1>
            <p>Create your account to manage orders, wishlist, and profile in one place.</p>
            <div className="auth-card-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <h1>Get Started</h1>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input className="auth-input" type="text" name="name" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="auth-input" type="email" name="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="auth-input" type="password" name="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select className="auth-input" name="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            <button className="auth-button" type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Profile = () => {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (!user) return <p>Loading profile...</p>;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <section className="profile-container">
      <article className="profile-card">
        <div className="profile-card__hero">
          <div className="profile-avatar">{userInitial}</div>
          <h1>{user.name}</h1>
          <p>{user.role}</p>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="profile-detail__icon">@</span>
            <div className="profile-detail__content">
              <span className="profile-detail__label">Email</span>
              <span className="profile-detail__value">{user.email}</span>
            </div>
          </div>

          <div className="profile-detail">
            <span className="profile-detail__icon">ID</span>
            <div className="profile-detail__content">
              <span className="profile-detail__label">Role</span>
              <span className="profile-detail__value">{user.role}</span>
            </div>
          </div>

          <div className="profile-detail">
            <span className="profile-detail__icon">D</span>
            <div className="profile-detail__content">
              <span className="profile-detail__label">Joined</span>
              <span className="profile-detail__value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [message, setMessage] = useState('');

  const loadCart = async () => {
    try {
      const data = await apiGet('/api/customer/cart');
      setCartData(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantity = async (productId, quantity) => {
    try {
      await apiPut('/api/customer/cart', { productId, quantity });
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await apiDelete(`/api/customer/cart/${productId}`);
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    try {
      await apiPost('/api/customer/orders/place', { shippingAddress });
      setShippingAddress('');
      loadCart();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Home / Shopping Cart</p>
      </div>
      <div className="cart-grid">
        <section className="cart-card">
          <h2>Items</h2>
          {message && <p className="error">{message}</p>}
          {!cartData ? (
            <p>Loading cart...</p>
          ) : cartData.cart.items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartData.cart.items.map((item) => (
              <div className="cart-item" key={item.product?._id || item.product}>
                <img className="cart-item-image" src={getProductImage(item.product?.image) || 'https://via.placeholder.com/120?text=Item'} alt={item.product?.name || 'Product'} />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product?.name || 'Unavailable product'}</h3>
                  <p className="cart-item-price">${Number(item.product?.price || 0).toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <input className="quantity-input" type="number" min="1" value={item.quantity} onChange={(e) => handleQuantity(item.product?._id || item.product, Number(e.target.value))} />
                  <button className="btn" type="button" onClick={() => handleQuantity(item.product?._id || item.product, Number(item.quantity))}>
                    Update
                  </button>
                </div>
                <button className="btn btn-danger remove-button" type="button" onClick={() => handleRemove(item.product?._id || item.product)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </section>

        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <strong>{cartData?.cart.items.length || 0}</strong>
          </div>
          <div className="summary-row">
            <span>Sub Total</span>
            <strong>${cartData ? Number(cartData.total).toFixed(2) : '0.00'}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <strong>$0.00</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>${cartData ? Number(cartData.total).toFixed(2) : '0.00'}</strong>
          </div>
          <form onSubmit={handlePlaceOrder} className="order-form">
            <input className="auth-input" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} type="text" placeholder="Shipping Address" required />
            <button className="checkout-button" type="submit">Proceed to Checkout</button>
          </form>
        </aside>
      </div>
    </section>
  );
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [message, setMessage] = useState('');

  const loadWishlist = async () => {
    try {
      const data = await apiGet('/api/customer/wishlist');
      setWishlist(data.wishlist);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleToggle = async (productId) => {
    try {
      await apiPost('/api/customer/wishlist/toggle', { productId });
      loadWishlist();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await apiPost('/api/customer/cart', { productId, quantity: 1 });
      loadWishlist();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="wishlist-page">
      <div className="wishlist-header">
        <h1>Your Wishlist</h1>
      </div>
      <article className="wishlist-card">
        {message && <p className="error">{message}</p>}
        {!wishlist ? (
          <p>Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <h3>Your wishlist is empty</h3>
            <p>Start adding products to keep track of items you love.</p>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((product) => (
              <div className="wishlist-item" key={product._id}>
                <img className="wishlist-item-image" src={getProductImage(product.image) || 'https://via.placeholder.com/120?text=Wishlist'} alt={product.name} />
                <div className="wishlist-item-details">
                  <h3 className="wishlist-item-name">{product.name}</h3>
                  <p className="wishlist-item-price">${Number(product.price).toFixed(2)}</p>
                </div>
                <div className="wishlist-actions">
                  <NavLink className="btn wishlist-btn" to={`/products/${product._id}`}>
                    View
                  </NavLink>
                  <button className="btn wishlist-btn" type="button" onClick={() => handleAddToCart(product._id)}>
                    Add to Cart
                  </button>
                  <button className="btn btn-danger remove-wishlist-btn" type="button" onClick={() => handleToggle(product._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    try {
      const data = await apiGet('/api/customer/orders');
      setOrders(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <section className="card">
      <h1>Order History</h1>
      {message && <p className="error">{message}</p>}
      {!orders ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <article className="line" key={order._id}>
            <h3>Order #{order._id}</h3>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
            <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
          </article>
        ))
      )}
    </section>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiGet('/api/admin/dashboard');
        setStats(data);
      } catch (error) {
        setMessage(error.message);
      }
    };
    loadStats();
  }, []);

  return (
    <>
      <section className="grid-3">
        {stats ? (
          <> 
            <article className="card"><h3>Products</h3><p>{stats.productsCount}</p></article>
            <article className="card"><h3>Orders</h3><p>{stats.ordersCount}</p></article>
            <article className="card"><h3>Users</h3><p>{stats.usersCount}</p></article>
          </>
        ) : (
          <p>Loading dashboard...</p>
        )}
      </section>
      {message && <p className="error">{message}</p>}
      <section className="card">
        <h2>Quick Links</h2>
        <div className="row-actions">
          <NavLink className="btn" to="/admin/products">Product Management</NavLink>
          <NavLink className="btn" to="/admin/categories">Category Management</NavLink>
          <NavLink className="btn" to="/admin/orders">Order Management</NavLink>
          <NavLink className="btn" to="/admin/users">User Management</NavLink>
        </div>
      </section>
    </>
  );
};

const AdminProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', description: '', category: '', frameType: '', lensType: '', gender: '', price: '', stock: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const [categoryData, productData] = await Promise.all([
        apiGet('/api/admin/categories'),
        apiGet('/api/admin/products'),
      ]);
      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setSelectedProduct(null);
    setForm({ name: '', brand: '', description: '', category: '', frameType: '', lensType: '', gender: '', price: '', stock: '' });
    setFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      if (file) formData.append('image', file);
      if (selectedProduct) {
        await apiPut(`/api/admin/products/${selectedProduct._id}`, formData);
      } else {
        await apiPost('/api/admin/products', formData);
      }
      resetForm();
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      category: product.category?._id || '',
      frameType: product.frameType || '',
      lensType: product.lensType || '',
      gender: product.gender || '',
      price: String(product.price || ''),
      stock: String(product.stock || ''),
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/api/admin/products/${id}`);
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <section className="card">
        <h1>Product Management</h1>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="auth-form">
          <input name="name" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input name="brand" placeholder="Brand" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select name="category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <input name="frameType" placeholder="Frame Type" value={form.frameType} onChange={(e) => setForm({ ...form, frameType: e.target.value })} />
          <input name="lensType" placeholder="Lens Type" value={form.lensType} onChange={(e) => setForm({ ...form, lensType: e.target.value })} />
          <input name="gender" placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
          <input type="number" name="price" min="0" step="0.01" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" name="stock" min="0" placeholder="Stock" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input type="file" name="image" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="btn" type="submit">{selectedProduct ? 'Update Product' : 'Add Product'}</button>
          {selectedProduct && <button className="btn btn-outline" type="button" onClick={resetForm}>Cancel Edit</button>}
        </form>
      </section>
      <section className="card">
        <h2>All Products</h2>
        {products.map((product) => (
          <div className="line" key={product._id}>
            <div>
              <strong>{product.name}</strong>
              <p>{product.brand} • ${Number(product.price).toFixed(2)}</p>
            </div>
            <div className="row-actions">
              <button className="btn" type="button" onClick={() => startEdit(product)}>Edit</button>
              <button className="btn btn-danger" type="button" onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [message, setMessage] = useState('');

  const loadCategories = async () => {
    try {
      const data = await apiGet('/api/admin/categories');
      setCategories(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiPost('/api/admin/categories', form);
      setForm({ name: '', slug: '' });
      loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/api/admin/categories/${id}`);
      loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <section className="card">
        <h1>Category Management</h1>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="name" placeholder="Category Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input name="slug" placeholder="category-slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <button className="btn" type="submit">Add Category</button>
        </form>
      </section>
      <section className="card">
        <h2>Existing Categories</h2>
        {!categories ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          categories.map((category) => (
            <div className="row-between line" key={category._id}>
              <p><strong>{category.name}</strong> ({category.slug})</p>
              <button className="btn btn-danger" type="button" onClick={() => handleDelete(category._id)}>Delete</button>
            </div>
          ))
        )}
      </section>
    </>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    try {
      const data = await apiGet('/api/admin/orders');
      setOrders(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatus = async (orderId, status) => {
    try {
      await apiPatch(`/api/admin/orders/${orderId}/status`, { status });
      loadOrders();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="card">
      <h1>Order Management</h1>
      {message && <p className="error">{message}</p>}
      {!orders ? (
        <p>Loading orders...</p>
      ) : orders.map((order) => (
        <article className="line" key={order._id}>
          <h3>Order #{order._id}</h3>
          <p>Customer: {order.user?.name || 'Unknown'} ({order.user?.email || ''})</p>
          <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
          <p>Address: {order.shippingAddress}</p>
          <p>Stock Updated: <strong>{order.stockDeducted ? 'Yes' : 'No'}</strong></p>
          <div className="inline-form">
            <select value={order.status} onChange={(e) => handleStatus(order._id, e.target.value)}>
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="btn" type="button" onClick={() => handleStatus(order._id, order.status)}>
              Update Status
            </button>
          </div>
        </article>
      ))}
    </section>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState(null);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const data = await apiGet('/api/admin/users');
      setUsers(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <section className="card">
      <h1>User Management</h1>
      {message && <p className="error">{message}</p>}
      {!users ? (
        <p>Loading users...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

const NotFound = () => (
  <section className="card">
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </section>
);

function AppContent() {
  return (
    <>
      <Header />
      <main className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/customer/cart" element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
          <Route path="/customer/wishlist" element={<ProtectedRoute role="customer"><Wishlist /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute role="customer"><Orders /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
