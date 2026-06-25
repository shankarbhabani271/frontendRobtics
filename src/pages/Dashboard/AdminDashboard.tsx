import React, { useEffect, useState } from "react";
import { useAuth, API_BASE_URL } from "../../context/AuthContext";
import Swal from "sweetalert2";
import logo2 from "../../assets/logo2.png";
import { 
  BookOpen, ShoppingBag, Truck, Users, MessageSquare, 
  Plus, Edit, Trash2, Save, RefreshCw, BarChart2, Menu 
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "products" | "orders" | "customers" | "blogs">("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Data States
  const [reports, setReports] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms States
  const [courseForm, setCourseForm] = useState({ title: "", description: "", category: "Robotics", price: 0, image: "", instructor: "SakRobotix Team" });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({ name: "", description: "", category: "robotics-kits", price: 0, image: "", stock: 10 });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [blogForm, setBlogForm] = useState({ title: "", content: "" });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch reports
      const repRes = await authFetch(`${API_BASE_URL}/admin/reports`);
      if (repRes.ok) {
        const rData = await repRes.json();
        setReports(rData);
      }

      // Fetch orders
      const ordRes = await authFetch(`${API_BASE_URL}/admin/orders`);
      if (ordRes.ok) {
        const oData = await ordRes.json();
        setOrders(oData);
      }

      // Fetch customers
      const custRes = await authFetch(`${API_BASE_URL}/admin/customers`);
      if (custRes.ok) {
        const cData = await custRes.json();
        setCustomers(cData);
      }

      // Fetch courses
      const coursesRes = await fetch(`${API_BASE_URL}/content/courses`);
      if (coursesRes.ok) {
        const crsData = await coursesRes.json();
        setCourses(crsData);
      }

      // Fetch products
      const prodsRes = await fetch(`${API_BASE_URL}/content/products`);
      if (prodsRes.ok) {
        const pData = await prodsRes.json();
        setProducts(pData);
      }

      // Fetch blogs
      const blogsRes = await fetch(`${API_BASE_URL}/content/blogs`);
      if (blogsRes.ok) {
        const bData = await blogsRes.json();
        setBlogs(bData);
      }

      // Fetch categories
      const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        setCategories(catData.filter((c: any) => c.type === "product" && c.isActive));
      }

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not load administrative details.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ORDER STATUS ACTIONS ---
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        Swal.fire("Order Modified", `Shipping state changed to ${status}.`, "success");
        fetchData();
      } else {
        Swal.fire("Error", "Failed to update order status.", "error");
      }
    } catch (e) {
      Swal.fire("Error", "Connection error.", "error");
    }
  };

  // --- COURSE CRUD ACTIONS ---
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCourseId 
        ? `${API_BASE_URL}/admin/courses/${editingCourseId}` 
        : `${API_BASE_URL}/admin/courses`;
      const method = editingCourseId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });

      if (res.ok) {
        Swal.fire("Course Catalog Updated", `Course successfully ${editingCourseId ? "updated" : "published"}.`, "success");
        setCourseForm({ title: "", description: "", category: "Robotics", price: 0, image: "", instructor: "SakRobotix Team" });
        setEditingCourseId(null);
        fetchData();
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to update course catalog", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Connection error.", "error");
    }
  };

  const handleEditCourseClick = (course: any) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      image: course.image,
      instructor: course.instructor,
    });
  };

  const handleDeleteCourse = async (courseId: string) => {
    Swal.fire({
      title: "Remove Course?",
      text: "Delete this course module permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/admin/courses/${courseId}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted", "Course removed.", "success");
            fetchData();
          }
        } catch (e) {
          Swal.fire("Error", "Failed to delete.", "error");
        }
      }
    });
  };

  // --- PRODUCT CRUD ACTIONS ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProductId 
        ? `${API_BASE_URL}/admin/products/${editingProductId}` 
        : `${API_BASE_URL}/admin/products`;
      const method = editingProductId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        Swal.fire("Product Inventory Updated", `Product listing successfully ${editingProductId ? "updated" : "published"}.`, "success");
        setProductForm({ name: "", description: "", category: "Electronics", price: 0, image: "", stock: 10 });
        setEditingProductId(null);
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", "Connection error.", "error");
    }
  };

  const handleEditProductClick = (product: any) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    Swal.fire({
      title: "Remove Product?",
      text: "Delete this e-store hardware listing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/admin/products/${productId}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted", "Listing deleted.", "success");
            fetchData();
          }
        } catch (e) {
          Swal.fire("Error", "Failed to delete.", "error");
        }
      }
    });
  };

  // --- BLOG ACTIONS ---
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBlogId 
        ? `${API_BASE_URL}/admin/blogs/${editingBlogId}` 
        : `${API_BASE_URL}/admin/blogs`;
      const method = editingBlogId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogForm),
      });

      if (res.ok) {
        Swal.fire("Blog Published", `Article successfully ${editingBlogId ? "updated" : "created"}.`, "success");
        setBlogForm({ title: "", content: "" });
        setEditingBlogId(null);
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", "Connection error.", "error");
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    Swal.fire({
      title: "Remove Blog?",
      text: "Are you sure you want to delete this blog post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/admin/blogs/${blogId}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted", "Blog post removed.", "success");
            fetchData();
          }
        } catch (e) {
          Swal.fire("Error", "Failed to delete.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <RefreshCw className="animate-spin text-[#201064] mx-auto" size={40} />
          <p className="text-slate-500 font-bold">Synchronizing administrative services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#201064] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-indigo-900/50">
        <button 
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="text-white p-1.5 hover:bg-white/10 rounded-lg transition focus:outline-none cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>
        <img src={logo2} alt="SakRobotix Lab Logo" className="h-8 w-auto object-contain" />
        <div className="w-6 h-6"></div> {/* Spacer to center title */}
      </div>

      {/* Sidebar Backdrop Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden"
        />
      )}

      {/* Side Control Bar */}
      <aside className={`fixed inset-y-0 left-0 z-50 transform w-72 bg-[#201064] text-indigo-100 flex flex-col border-r border-slate-200 shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-indigo-900/50 flex flex-col items-center gap-2">
          <img src={logo2} alt="SakRobotix Lab Logo" className="h-12 w-auto object-contain" />
          <div className="text-center">
            <h2 className="font-extrabold text-white leading-none tracking-wide text-base font-sans">Admin Console</h2>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider mt-1 block">Staff Portal</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab("overview"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "overview" ? "bg-indigo-900/40 text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white"}`}
          >
            <BarChart2 size={18} /> Performance Overview
          </button>
          
          <button 
            onClick={() => { setActiveTab("courses"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "courses" ? "bg-indigo-900/40 text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white"}`}
          >
            <BookOpen size={18} /> Manage Courses
          </button>

          <button 
            onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "products" ? "bg-indigo-900/40 text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white"}`}
          >
            <ShoppingBag size={18} /> Manage Products
          </button>

          <button 
            onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "orders" ? "bg-indigo-900/40 text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white"}`}
          >
            <Truck size={18} /> Order Deliveries
          </button>

          <button 
            onClick={() => { setActiveTab("customers"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "customers" ? "bg-indigo-900/40 text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white"}`}
          >
            <Users size={18} /> Student Catalog
          </button>

          <button 
            onClick={() => { setActiveTab("blogs"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "blogs" ? "bg-indigo-900/40 text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white"}`}
          >
            <MessageSquare size={18} /> blogs & announcements
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-900/50">
          <button onClick={() => { fetchData(); setIsSidebarOpen(false); }} className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-900/40 text-xs font-bold text-cyan-300 rounded-xl hover:bg-indigo-900/60 active:scale-95 transition-all">
            <RefreshCw size={12} /> Sync Databases
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 overflow-y-auto overflow-x-hidden max-w-7xl mx-auto w-full min-w-0">

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && reports && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#201064] tracking-tight">Staff Overview Panel</h1>
              <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Review operational statistics, pending orders, and course enrollment summaries.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Deliveries</p>
                  <p className="text-2xl font-black text-rose-600 mt-2">{reports.orders.pending} orders</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Truck size={24} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Course Enrollments</p>
                  <p className="text-2xl font-black text-indigo-600 mt-2">{reports.counts.totalEnrollments} students</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users size={24} /></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Listings</p>
                  <p className="text-2xl font-black text-cyan-600 mt-2">{reports.counts.courses} courses / {reports.counts.products} products</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><BookOpen size={24} /></div>
              </div>
            </div>

            {/* Simple Progress tracker */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#201064] mb-4">Delivery pipeline status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-2xl font-black text-[#201064]">{reports.orders.pending}</span>
                  <p className="text-xs text-slate-500 font-bold mt-1">Pending Checkout</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-2xl font-black text-amber-600">{reports.orders.processing}</span>
                  <p className="text-xs text-amber-700 font-bold mt-1">In Processing</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-2xl font-black text-blue-600">{reports.orders.shipped}</span>
                  <p className="text-xs text-blue-700 font-bold mt-1">Shipped/Dispatched</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-2xl font-black text-emerald-600">{reports.orders.delivered}</span>
                  <p className="text-xs text-emerald-700 font-bold mt-1">Successfully Delivered</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Courses Catalog Builder</h1>
              <p className="text-slate-500 font-medium mt-1">CRUD courses inventory list and configure lectures curricula details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Block */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-extrabold text-[#201064] mb-4">
                  {editingCourseId ? "Modify Course Module" : "Publish Course Curriculum"}
                </h3>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Course Title</label>
                    <input 
                      type="text" required
                      placeholder="Introduction to Robotics"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                    <textarea 
                      required rows={3}
                      placeholder="Detailed course description..."
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Price (₹)</label>
                      <input 
                        type="number" required
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Category</label>
                      <select 
                        value={courseForm.category}
                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      >
                        <option value="Robotics">Robotics</option>
                        <option value="IoT">IoT</option>
                        <option value="Coding">Coding</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Cover Image Link</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer">
                    {editingCourseId ? <Save size={14} /> : <Plus size={14} />}
                    {editingCourseId ? "Save Catalog Course" : "Publish to Catalog"}
                  </button>
                  {editingCourseId && (
                    <button type="button" onClick={() => {
                      setEditingCourseId(null);
                      setCourseForm({ title: "", description: "", category: "Robotics", price: 0, image: "", instructor: "SakRobotix Team" });
                    }} className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Catalog List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-extrabold text-[#201064] mb-4">Course Catalog listings</h3>
                <div className="space-y-4">
                  {courses.map((course: any) => (
                    <div key={course._id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition">
                      <img src={course.image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">{course.category}</span>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-1">{course.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-800 text-sm">₹{course.price}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleEditCourseClick(course)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteCourse(course._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Products Catalog Builder</h1>
              <p className="text-slate-500 font-medium mt-1">Publish hardware listings, configure DIY maker boards, and adjust quantities.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Block */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-extrabold text-[#201064] mb-4">
                  {editingProductId ? "Modify Hardware specs" : "Add Hardware Listing"}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Product Name</label>
                    <input 
                      type="text" required
                      placeholder="Raspberry Pi 4 Model B"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                    <textarea 
                      required rows={3}
                      placeholder="Detailed specifications..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    >
                      {categories.map((c: any) => (
                        <option key={c._id} value={c.slug}>{c.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="robotics-kits">Robotics Kits</option>
                          <option value="arduino-boards">Arduino Boards</option>
                          <option value="raspberry-pi">Raspberry Pi</option>
                          <option value="sensors">Sensors</option>
                          <option value="motors">Motors</option>
                          <option value="iot-devices">IoT Devices</option>
                          <option value="drones">Drones</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-600 block mb-1">Price (₹)</label>
                      <input 
                        type="number" required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Stock</label>
                      <input 
                        type="number" required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Product Image Link</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/product.jpg"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer">
                    {editingProductId ? <Save size={14} /> : <Plus size={14} />}
                    {editingProductId ? "Save Product Specifications" : "Publish to E-Store"}
                  </button>
                  {editingProductId && (
                    <button type="button" onClick={() => {
                      setEditingProductId(null);
                      setProductForm({ name: "", description: "", category: "Electronics", price: 0, image: "", stock: 10 });
                    }} className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Catalog List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-extrabold text-[#201064] mb-4">Stock Inventory list</h3>
                <div className="space-y-4">
                  {products.map((product: any) => (
                    <div key={product._id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition">
                      <img src={product.image || "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80"} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded-full">{product.category}</span>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-1">{product.name}</h4>
                        <p className={`text-[10px] font-extrabold mt-1 ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                          {product.stock > 0 ? `${product.stock} units in stock` : "Out of Stock"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-800 text-sm">₹{product.price}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleEditProductClick(product)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDER DELIVERIES */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Order Fulfilment ledgers</h1>
              <p className="text-slate-500 font-medium mt-1">Review checkout orders, audit payment transaction IDs, and modify delivery states.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Total Price</th>
                      <th className="py-3 px-4">Fulfillment State</th>
                      <th className="py-3 px-4 text-center font-bold">Update State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-600 font-medium">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{order.paymentDetails.transactionId}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{order.user?.name || "Customer"}</p>
                          <span className="text-[10px] text-slate-450 block mt-0.5">{order.user?.email || ""}</span>
                        </td>
                        <td className="py-3.5 px-4 truncate max-w-[180px] font-medium text-slate-400">{order.shippingAddress || "Digital Course Access"}</td>
                        <td className="py-3.5 px-4 font-black text-slate-800">₹{order.totalAmount}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            order.orderStatus === "delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            order.orderStatus === "shipped" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            order.orderStatus === "processing" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <select 
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-700 outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400 font-bold">No orders placed on the platform.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STUDENT DIRECTORY */}
        {activeTab === "customers" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Student Catalog Registry</h1>
              <p className="text-slate-500 font-medium mt-1">Access registered customer accounts list and review purchased enrollment history.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Contact Email</th>
                      <th className="py-3 px-4">Enrolled Course IDs count</th>
                      <th className="py-3 px-4">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust: any) => (
                      <tr key={cust._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-650 font-medium">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{cust.name}</td>
                        <td className="py-3.5 px-4">{cust.email}</td>
                        <td className="py-3.5 px-4 font-extrabold text-indigo-650">{cust.purchasedCourses?.length || 0} modules unlocked</td>
                        <td className="py-3.5 px-4 text-slate-400 font-semibold">{new Date(cust.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-slate-400 font-bold">No student accounts registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BLOGS & BANNERS */}
        {activeTab === "blogs" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Blogs & Announcement Articles</h1>
              <p className="text-slate-500 font-medium mt-1">Publish promotional blogs, review customer feedback, and post learning guidelines.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Block */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-extrabold text-[#201064] mb-4">
                  {editingBlogId ? "Modify Blog Article" : "Create Blog Article"}
                </h3>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Blog Title</label>
                    <input 
                      type="text" required
                      placeholder="Why Robotics is critical for School Kids"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Article Content</label>
                    <textarea 
                      required rows={5}
                      placeholder="Write your article copy here..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer">
                    {editingBlogId ? <Save size={14} /> : <Plus size={14} />}
                    {editingBlogId ? "Save Article" : "Publish Article"}
                  </button>
                  {editingBlogId && (
                    <button type="button" onClick={() => {
                      setEditingBlogId(null);
                      setBlogForm({ title: "", content: "" });
                    }} className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Listings Block */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-extrabold text-[#201064] mb-4">Published Articles</h3>
                <div className="space-y-4">
                  {blogs.map((blog: any) => (
                    <div key={blog._id} className="p-4 border border-slate-100 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-805 text-sm">{blog.title}</h4>
                          <span className="text-[10px] font-semibold text-slate-400">Published by: {blog.author}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setEditingBlogId(blog._id);
                            setBlogForm({ title: blog.title, content: blog.content });
                          }} className="p-1.5 text-indigo-650 hover:bg-indigo-50 rounded-lg"><Edit size={13} /></button>
                          <button onClick={() => handleDeleteBlog(blog._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{blog.content}</p>
                    </div>
                  ))}
                  {blogs.length === 0 && (
                    <p className="text-center text-slate-400 py-6 font-semibold">No articles published.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
