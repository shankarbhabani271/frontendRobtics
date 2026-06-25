import React, { useEffect, useState } from "react";
import { useAuth, API_BASE_URL } from "../../context/AuthContext";
import Swal from "sweetalert2";
import logo2 from "../../assets/logo2.png";
import { 
  Shield, Users, BookOpen, ShoppingBag, Settings, Activity, 
  Plus, Edit, Power, Trash2, Save, RefreshCw, BarChart2,
  ChevronUp, ChevronDown, Upload, X, DollarSign, ListOrdered, 
  ShoppingCart, MessageSquare, FileText, Info, TrendingUp, 
  AlertTriangle, Star, Menu, Search, Eye, ArrowUpDown, 
  ChevronLeft, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ProductFormState {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  brand: string;
  sku: string;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  tax: number;
  lowStockThreshold: number;
  badgeText?: string;
  cartButtonText?: string;
  viewButtonText?: string;
}

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const SuperAdminDashboard: React.FC = () => {
  const { authFetch } = useAuth();
  
  // Custom navigation state based on Sidebar structure
  const [activeMenu, setActiveMenu] = useState<string>("dashboard_overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Data States
  const [reportData, setReportData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms States
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editAdminData, setEditAdminData] = useState({ name: "", email: "", password: "" });
  
  const [courseForm, setCourseForm] = useState({ title: "", description: "", category: "Robotics", price: 0, image: "", instructor: "SakRobotix Team" });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "product",
    isActive: true,
    description: "",
    image: "",
    bannerImage: "",
    isFeatured: false,
    showOnHomepage: true,
    displayOrder: 0,
    buttonText: ""
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Category management table states
  const [catSearch, setCatSearch] = useState("");
  const [catStatusFilter, setCatStatusFilter] = useState("all"); // all, active, inactive
  const [catSortField, setCatSortField] = useState("displayOrder"); // name, createdAt, displayOrder
  const [catSortDir, setCatSortDir] = useState<"asc" | "desc">("asc");
  const [catPage, setCatPage] = useState(1);
  const [viewingCategory, setViewingCategory] = useState<any | null>(null);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [productForm, setProductForm] = useState<ProductFormState>({
    name: "",
    description: "",
    category: "robotics-kits",
    price: 0,
    image: "",
    stock: 25,
    brand: "",
    sku: "",
    originalPrice: 0,
    discount: 0,
    rating: 5,
    reviewCount: 0,
    images: [],
    isFeatured: false,
    isActive: true,
    orderIndex: 0,
    tax: 18,
    lowStockThreshold: 5,
    badgeText: "",
    cartButtonText: "Add to Cart",
    viewButtonText: "View Details",
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch report analytics
      const reportRes = await authFetch(`${API_BASE_URL}/superadmin/reports`);
      if (reportRes.ok) {
        const rData = await reportRes.json();
        setReportData(rData);
      }

      // Fetch users
      const usersRes = await authFetch(`${API_BASE_URL}/superadmin/users`);
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setAllUsers(uData);
      }

      // Fetch settings
      const settingsRes = await authFetch(`${API_BASE_URL}/superadmin/settings`);
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        setSettings(sData);
      }

      // Fetch courses list
      const coursesRes = await fetch(`${API_BASE_URL}/content/courses`);
      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        setCourses(cData);
      }

      // Fetch products list (superadmin endpoint to include all products, not just active)
      const productsRes = await authFetch(`${API_BASE_URL}/superadmin/products`);
      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(Array.isArray(pData) ? pData : (pData.products || []));
      }

      // Fetch categories list
      const catRes = await authFetch(`${API_BASE_URL}/categories`);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }

    } catch (error) {
      console.error("Failed to load superadmin dashboard data", error);
      Swal.fire("Error", "Could not synchronize dashboard state.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ADMIN ACTIONS ---
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      Swal.fire("Warning", "Fill in all credentials.", "warning");
      return;
    }

    try {
      const res = await authFetch(`${API_BASE_URL}/superadmin/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Admin Created", `Account for ${data.name} is now active.`, "success");
        setNewAdmin({ name: "", email: "", password: "" });
        fetchData();
      } else {
        Swal.fire("Failure", data.message || "Could not register admin", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error.", "error");
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminId) return;

    try {
      const res = await authFetch(`${API_BASE_URL}/superadmin/admins/${editingAdminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAdminData),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Admin Updated", "Admin credentials successfully modified.", "success");
        setEditingAdminId(null);
        setEditAdminData({ name: "", email: "", password: "" });
        fetchData();
      } else {
        Swal.fire("Failure", data.message || "Failed to update details", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error.", "error");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean, name: string) => {
    Swal.fire({
      title: `${currentStatus ? "Deactivate" : "Activate"} Account?`,
      text: `Are you sure you want to change activation for ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#201064",
      confirmButtonText: "Yes, Proceed",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/superadmin/users/${userId}/toggle-status`, {
            method: "PUT",
          });
          const data = await res.json();
          if (res.ok) {
            Swal.fire("Success", `${name} has been ${data.isActive ? "activated" : "deactivated"}.`, "success");
            fetchData();
          } else {
            Swal.fire("Forbidden", data.message || "Action blocked.", "error");
          }
        } catch (err) {
          Swal.fire("Error", "Could not complete toggle request.", "error");
        }
      }
    });
  };

  // --- CATEGORY CRUD ACTIONS ---
  const handleCategoryCardImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        setCategoryForm(prev => ({
          ...prev,
          image: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryBannerImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        setCategoryForm(prev => ({
          ...prev,
          bannerImage: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      Swal.fire("Warning", "Category name is required.", "warning");
      return;
    }

    try {
      const url = editingCategoryId
        ? `${API_BASE_URL}/categories/${editingCategoryId}`
        : `${API_BASE_URL}/categories`;
      const method = editingCategoryId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        Swal.fire("Category Saved", `Category details successfully ${editingCategoryId ? "updated" : "saved"}.`, "success");
        setCategoryForm({
          name: "",
          type: "product",
          isActive: true,
          description: "",
          image: "",
          bannerImage: "",
          isFeatured: false,
          showOnHomepage: true,
          displayOrder: 0,
          buttonText: ""
        });
        setEditingCategoryId(null);
        fetchData();
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to edit category", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Connection error.", "error");
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    Swal.fire({
      title: "Remove Category?",
      text: "This action will delete this category. Products referencing this category will remain, but category sorting may reset.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Category",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/categories/${catId}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted", "Category successfully deleted.", "success");
            fetchData();
          } else {
            Swal.fire("Error", "Failed to delete category.", "error");
          }
        } catch (e) {
          Swal.fire("Error", "Connection error.", "error");
        }
      }
    });
  };

  const handleToggleCategoryActive = async (cat: any) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, isActive: !cat.isActive }),
      });
      if (res.ok) {
        Swal.fire("Success", `Category accessibility has been updated.`, "success");
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", "Could not complete toggle request.", "error");
    }
  };

  // --- WEBSITE SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await authFetch(`${API_BASE_URL}/superadmin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        Swal.fire("Settings Saved", "Global website configs successfully updated.", "success");
        fetchData();
      } else {
        Swal.fire("Error", "Could not save settings.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error.", "error");
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
        Swal.fire("Course Catalog Updated", `Course successfully ${editingCourseId ? "updated" : "created"}.`, "success");
        setCourseForm({ title: "", description: "", category: "Robotics", price: 0, image: "", instructor: "SakRobotix Team" });
        setEditingCourseId(null);
        fetchData();
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to edit course", "error");
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
      text: "This will delete this educational curriculum module permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Course",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/admin/courses/${courseId}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted", "Course successfully expunged.", "success");
            fetchData();
          } else {
            Swal.fire("Error", "Failed to delete.", "error");
          }
        } catch (e) {
          Swal.fire("Error", "Connection error.", "error");
        }
      }
    });
  };

  // --- PRODUCT CRUD ACTIONS ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.image) {
      Swal.fire("Validation Error", "Main product image is required.", "warning");
      return;
    }
    if (productForm.images.length > 8) {
      Swal.fire("Validation Error", "A maximum of 8 gallery images is allowed.", "warning");
      return;
    }

    // Show Loading Spinner during upload
    Swal.fire({
      title: "Publishing Product...",
      text: "Uploading images and saving details to database. Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("category", productForm.category);
      formData.append("price", String(productForm.price));
      formData.append("stock", String(productForm.stock));
      formData.append("brand", productForm.brand || "Generic");
      formData.append("sku", productForm.sku || "");
      formData.append("originalPrice", String(productForm.originalPrice));
      formData.append("discount", String(productForm.discount));
      formData.append("rating", String(productForm.rating));
      formData.append("reviewCount", String(productForm.reviewCount));
      formData.append("isFeatured", String(productForm.isFeatured));
      formData.append("isActive", String(productForm.isActive));
      formData.append("orderIndex", String(productForm.orderIndex));
      formData.append("tax", String(productForm.tax));
      formData.append("lowStockThreshold", String(productForm.lowStockThreshold));

      // Main image file-based check
      if (productForm.image.startsWith("data:image/")) {
        const file = dataURLtoFile(productForm.image, "main-image.jpg");
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire("Validation Error", "Main product image exceeds the 5 MB maximum size limit.", "warning");
          return;
        }
        formData.append("image", file);
      } else {
        formData.append("image", productForm.image);
      }

      const imageOrder: string[] = [];
      let newFileIndex = 0;

      for (let i = 0; i < productForm.images.length; i++) {
        const img = productForm.images[i];
        if (img.startsWith("data:image/")) {
          const file = dataURLtoFile(img, `gallery-${i}.jpg`);
          if (file.size > 5 * 1024 * 1024) {
            Swal.fire("Validation Error", `Image ${i + 1} exceeds the 5 MB maximum size limit.`, "warning");
            return;
          }
          formData.append("gallery", file);
          imageOrder.push(`new-file-${newFileIndex}`);
          newFileIndex++;
        } else {
          imageOrder.push(img);
        }
      }
      formData.append("imageOrder", JSON.stringify(imageOrder));

      const url = editingProductId 
        ? `${API_BASE_URL}/superadmin/products/${editingProductId}` 
        : `${API_BASE_URL}/superadmin/products`;
      const method = editingProductId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        body: formData,
      });

      if (res.status === 413) {
        Swal.fire("Payload Too Large", "Failed to upload: one or more gallery images exceed the 5 MB limit, or total request payload size is too large.", "error");
        return;
      }

      if (res.ok) {
        Swal.fire("Inventory Catalog Updated", `Product successfully ${editingProductId ? "updated" : "created"}.`, "success");
        setProductForm({
          name: "",
          description: "",
          category: "robotics-kits",
          price: 0,
          image: "",
          stock: 25,
          brand: "",
          sku: "",
          originalPrice: 0,
          discount: 0,
          rating: 5,
          reviewCount: 0,
          images: [],
          isFeatured: false,
          isActive: true,
          orderIndex: 0,
          tax: 18,
          lowStockThreshold: 5,
        });
        setEditingProductId(null);
        fetchData();
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to publish product", "error");
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      Swal.fire("Network Error", "Could not connect to the backend server. Please check your network connection and verify that the backend is running.", "error");
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
      brand: product.brand || "",
      sku: product.sku || "",
      originalPrice: product.originalPrice || product.price || 0,
      discount: product.discount || 0,
      rating: product.rating || 5,
      reviewCount: product.reviewCount || 0,
      images: product.images || [],
      isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
      isActive: product.isActive !== undefined ? product.isActive : true,
      orderIndex: product.orderIndex || 0,
      tax: product.tax !== undefined ? product.tax : 18,
      lowStockThreshold: product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5,
    });
    // Open product list catalog
    setActiveMenu("products_manage");
  };

  const handleMoveProduct = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updatedProducts = [...products];
    const temp = updatedProducts[index];
    updatedProducts[index] = updatedProducts[targetIndex];
    updatedProducts[targetIndex] = temp;

    setProducts(updatedProducts);

    try {
      const productsOrder = updatedProducts.map((p, idx) => ({
        id: p._id,
        orderIndex: idx,
      }));

      const res = await authFetch(`${API_BASE_URL}/superadmin/products/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productsOrder }),
      });

      if (!res.ok) {
        Swal.fire("Error", "Failed to save product ordering", "error");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to connect to backend", "error");
      fetchData();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    Swal.fire({
      title: "Remove Product?",
      text: "This will delete this hardware component listing from stock permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Product",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await authFetch(`${API_BASE_URL}/superadmin/products/${productId}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted", "Product inventory list updated.", "success");
            fetchData();
          } else {
            Swal.fire("Error", "Failed to delete.", "error");
          }
        } catch (e) {
          Swal.fire("Error", "Connection error.", "error");
        }
      }
    });
  };

  const handleToggleProductFeatured = async (product: any) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/superadmin/products/${product._id}/toggle-featured`, {
        method: "PUT",
      });
      if (res.ok) {
        Swal.fire("Success", `Product featured status updated.`, "success");
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", "Could not toggle status.", "error");
    }
  };

  const handleToggleProductActive = async (product: any) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/superadmin/products/${product._id}/toggle-status`, {
        method: "PUT",
      });
      if (res.ok) {
        Swal.fire("Success", `Product visibility toggled.`, "success");
        fetchData();
      }
    } catch (err) {
      Swal.fire("Error", "Could not toggle status.", "error");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMainImageFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire("Validation Error", "Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP", "warning");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Validation Error", "Main image exceeds the 5 MB maximum size limit.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        setProductForm(prev => ({
          ...prev,
          image: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImagesFiles = (files: FileList) => {
    const fileList = Array.from(files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (productForm.images.length + fileList.length > 8) {
      Swal.fire("Warning", "Maximum of 8 gallery images allowed.", "warning");
      return;
    }

    for (const file of fileList) {
      if (!validTypes.includes(file.type)) {
        Swal.fire("Validation Error", `${file.name} is in an invalid format. Supported formats: JPG, JPEG, PNG, WEBP`, "warning");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Validation Error", `${file.name} exceeds the 5 MB maximum size limit.`, "warning");
        return;
      }
    }

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Reorder gallery items via native HTML5 drag & drop
  const handleGalleryDragStart = (index: number) => {
    setDraggedGalleryIndex(index);
  };

  const handleGalleryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedGalleryIndex === null || draggedGalleryIndex === index) return;
    const updated = [...productForm.images];
    const draggedItem = updated[draggedGalleryIndex];
    updated.splice(draggedGalleryIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedGalleryIndex(index);
    setProductForm(prev => ({ ...prev, images: updated }));
  };

  const handleGalleryDragEnd = () => {
    setDraggedGalleryIndex(null);
  };

  const handleMoveGalleryItem = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= productForm.images.length) return;
    const updated = [...productForm.images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setProductForm(prev => ({ ...prev, images: updated }));
  };

  // Filter accounts & catalog items
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const adminsList = filteredUsers.filter(u => u.role === "admin");
  const standardUsersList = filteredUsers.filter(u => u.role === "user");

  const activeProductCategories = categories.filter(c => c.type === "product" && c.isActive);
  const activeCourseCategories = categories.filter(c => c.type === "course" && c.isActive);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <RefreshCw className="animate-spin text-[#201064] mx-auto" size={40} />
          <p className="text-slate-500 font-bold">Synchronizing Super Admin logs & databases...</p>
        </div>
      </div>
    );
  }

  // Sidebar Menu categories
  const sidebarSections = [
    {
      title: "Dashboard",
      items: [
        { id: "dashboard_overview", label: "Overview & Analytics", icon: <BarChart2 size={16} /> },
        { id: "category_management", label: "Category Management", icon: <ListOrdered size={16} /> }
      ]
    },
    {
      title: "User Management",
      items: [
        { id: "users_manage", label: "Manage Users", icon: <Users size={16} /> },
        { id: "users_details", label: "User Details", icon: <Info size={16} /> },
        { id: "users_activity", label: "User Activity", icon: <Activity size={16} /> }
      ]
    },
    {
      title: "Admin Management",
      items: [
        { id: "admins_manage", label: "Manage Admins", icon: <Shield size={16} /> },
        { id: "admins_create", label: "Create Admin", icon: <Plus size={16} /> }
      ]
    },
    {
      title: "Course Management",
      items: [
        { id: "courses_categories", label: "Course Categories", icon: <ListOrdered size={16} /> },
        { id: "courses_catalog", label: "Course Catalog", icon: <BookOpen size={16} /> },
        { id: "courses_reviews", label: "Course Reviews", icon: <MessageSquare size={16} /> }
      ]
    },
    {
      title: "Product Management",
      items: [
        { id: "products_categories", label: "Product Categories", icon: <ListOrdered size={16} /> },
        { id: "categories_create", label: "Create Category", icon: <Plus size={16} /> },
        { id: "categories_manage", label: "Manage Categories", icon: <ListOrdered size={16} /> },
        { id: "products_create", label: "Create Product", icon: <Plus size={16} /> },
        { id: "products_manage", label: "Products", icon: <ShoppingBag size={16} /> },
        { id: "products_featured", label: "Featured Products", icon: <Star size={16} /> }
      ]
    },
    {
      title: "Order Management",
      items: [
        { id: "orders_manage", label: "Orders", icon: <ShoppingCart size={16} /> },
        { id: "orders_refunds", label: "Refund Requests", icon: <AlertTriangle size={16} /> }
      ]
    },
    {
      title: "Revenue & Payments",
      items: [
        { id: "revenue_analytics", label: "Revenue Analytics", icon: <DollarSign size={16} /> },
        { id: "revenue_transactions", label: "Transactions", icon: <FileText size={16} /> }
      ]
    },
    {
      title: "Website Management",
      items: [
        { id: "website_banner", label: "Announcements & Slider", icon: <Upload size={16} /> }
      ]
    },
    {
      title: "Reports",
      items: [
        { id: "reports_sales", label: "Sales & User Reports", icon: <FileText size={16} /> }
      ]
    },
    {
      title: "Settings",
      items: [
        { id: "settings_general", label: "General & SMTP Config", icon: <Settings size={16} /> }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row relative">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1b0d59] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-[#2d1b82]">
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
      <aside className={`fixed inset-y-0 left-0 z-50 transform w-72 bg-[#1b0d59] text-indigo-100 flex flex-col border-r border-[#2d1b82] shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-[#2d1b82] flex flex-col items-center gap-2">
          <img src={logo2} alt="SakRobotix Lab Logo" className="h-12 w-auto object-contain" />
          <div className="text-center">
            <h2 className="font-extrabold text-white leading-none tracking-wide text-base">SakRobotix</h2>
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider mt-1 block">Super Admin Portal</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[75vh] no-scrollbar">
          {sidebarSections.map((sect, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-300/60 block px-2 mb-1.5">{sect.title}</span>
              {sect.items.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSearchQuery("");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${activeMenu === item.id ? "bg-[#2d1b82] text-white shadow-md border-l-4 border-cyan-400" : "hover:bg-white/5 hover:text-white text-indigo-200"}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2d1b82]">
          <button onClick={() => { fetchData(); setIsSidebarOpen(false); }} className="w-full flex items-center justify-center gap-2 py-3 bg-[#2d1b82] text-xs font-bold text-cyan-300 rounded-xl hover:bg-[#3923a1] active:scale-95 transition-all">
            <RefreshCw size={12} /> Sync Dashboard Data
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden w-full min-w-0">
        
        {/* ── SECTION 1: OVERVIEW & ANALYTICS ── */}
        {activeMenu === "dashboard_overview" && reportData && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Overview & Analytics</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Real-time statistics overview and Recharts analytics engines.</p>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Stat Card 1: Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Revenue</span>
                    <p className="text-2xl font-black text-emerald-600 mt-1">₹{(reportData.summary.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><DollarSign size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={10} /> +12.4%
                  </span>
                  {/* Mini Graph SVG */}
                  <svg className="w-20 h-6 text-emerald-500" viewBox="0 0 100 30">
                    <path d="M0 25 Q15 10 30 18 T60 8 T90 20 T100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 2: Orders */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Orders</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalOrdersCount || 0} Orders</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600"><ShoppingCart size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={10} /> +8.2%
                  </span>
                  <svg className="w-20 h-6 text-violet-500" viewBox="0 0 100 30">
                    <path d="M0 20 Q20 5 40 22 T80 12 T100 25" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 3: Products */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Products</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalProducts || 0} Items</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600"><ShoppingBag size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">Static</span>
                  <svg className="w-20 h-6 text-indigo-500" viewBox="0 0 100 30">
                    <path d="M0 15 L25 15 L50 15 L75 15 L100 15" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 4: Courses */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Courses</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalCourses || 0} Programs</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600"><BookOpen size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={10} /> +15.0%
                  </span>
                  <svg className="w-20 h-6 text-cyan-500" viewBox="0 0 100 30">
                    <path d="M0 28 L20 22 L40 16 L65 8 L100 2" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 5: Categories */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Categories</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalCategories || 0} Classes</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600"><ListOrdered size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={10} /> +4.2%
                  </span>
                  <svg className="w-20 h-6 text-rose-500" viewBox="0 0 100 30">
                    <path d="M0 25 L30 18 L60 12 L80 15 L100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 6: Users */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Users</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalUsers || 0} Students</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-pink-50 text-pink-600"><Users size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={10} /> +9.8%
                  </span>
                  <svg className="w-20 h-6 text-pink-500" viewBox="0 0 100 30">
                    <path d="M0 25 Q25 8 50 18 T100 8" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 7: Admins */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Admins</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalAdmins || 0} Staff</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600"><Shield size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Locked</span>
                  <svg className="w-20 h-6 text-blue-500" viewBox="0 0 100 30">
                    <path d="M0 10 L50 10 L100 10" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Stat Card 8: Enrollments */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Enrollments</span>
                    <p className="text-2xl font-black text-[#201064] mt-1">{reportData.summary.totalEnrollments || 0} Modules</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600"><BookOpen size={18} /></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={10} /> +18.2%
                  </span>
                  <svg className="w-20 h-6 text-amber-500" viewBox="0 0 100 30">
                    <path d="M0 25 Q20 20 40 12 T80 5 T100 2" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Recharts Analytics Charts Panel */}
            <div className="space-y-6">
              <h2 className="text-md font-bold text-[#201064] border-b border-slate-200 pb-2">Platform Performance Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Revenue Analytics */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">Revenue Analytics (Monthly)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData.chartsData?.revenueAnalytics || []}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Product vs Course Sales */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">Product vs Course Revenue Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.chartsData?.salesComparison || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                        <Bar dataKey="Products" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Courses" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. User Registrations */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">User Registrations (Weekly Growth)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.chartsData?.userRegistrations || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Order Status Distribution */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">Order Status Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.chartsData?.orderStatus || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#f59e0b" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#06b6d4" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Category Performance */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">Sales Performance by Product/Course Categories</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={reportData.chartsData?.categoryPerformance || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>

            {/* Transactions & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Transactions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">Recent Transactions Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Tx ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.transactions.slice(0, 5).map((tx: any) => (
                        <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-600 font-semibold">
                          <td className="py-3 px-3 font-mono text-indigo-600 font-bold">{tx.paymentDetails.transactionId}</td>
                          <td className="py-3 px-3">
                            <p className="text-slate-800 font-bold">{tx.user?.name || "Anonymous Maker"}</p>
                            <span className="text-[9px] text-slate-400 block font-normal">{tx.user?.email || ""}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-800 font-extrabold">₹{tx.totalAmount}</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${tx.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                              {tx.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Logs */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4">System Event Log</h3>
                <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                  {reportData.activities.map((act: any) => (
                    <div key={act.id} className="text-[11px] border-l-2 border-indigo-500 pl-3 py-1 bg-indigo-50/20 rounded-r-lg">
                      <p className="font-semibold text-slate-700 leading-snug">{act.desc}</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── SECTION 1.5: DYNAMIC CATEGORY MANAGEMENT ── */}
        {activeMenu === "category_management" && (() => {
          // Filtered categories
          const filteredCategories = categories.filter((cat) => {
            const matchesSearch = 
              cat.name.toLowerCase().includes(catSearch.toLowerCase()) ||
              (cat.description || "").toLowerCase().includes(catSearch.toLowerCase());
            
            let matchesStatus = true;
            if (catStatusFilter === "active") {
              matchesStatus = cat.isActive === true;
            } else if (catStatusFilter === "inactive") {
              matchesStatus = cat.isActive === false;
            }
            
            return matchesSearch && matchesStatus;
          });

          // Sorted categories
          const sortedCategories = [...filteredCategories].sort((a, b) => {
            let valA = a[catSortField];
            let valB = b[catSortField];
            
            if (catSortField === "createdAt") {
              valA = new Date(a.createdAt || 0).getTime();
              valB = new Date(b.createdAt || 0).getTime();
            } else if (typeof valA === "string") {
              valA = valA.toLowerCase();
              valB = (valB || "").toLowerCase();
            } else {
              valA = Number(valA) || 0;
              valB = Number(valB) || 0;
            }
            
            if (valA < valB) return catSortDir === "asc" ? -1 : 1;
            if (valA > valB) return catSortDir === "asc" ? 1 : -1;
            return 0;
          });

          // Pagination logic
          const itemsPerPage = 5;
          const totalPages = Math.max(1, Math.ceil(sortedCategories.length / itemsPerPage));
          const startIndex = (catPage - 1) * itemsPerPage;
          const paginatedCategories = sortedCategories.slice(startIndex, startIndex + itemsPerPage);

          return (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Block */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#0A7FE6] mb-1.5 flex items-center gap-1.5">
                    <span>Super Admin</span>
                    <span>/</span>
                    <span>Overview & Analysis</span>
                    <span>/</span>
                    <span className="text-slate-400">Category Management</span>
                  </div>
                  <h1 className="text-2xl font-black text-[#201064] tracking-tight">Category Management</h1>
                  <p className="text-slate-500 text-xs font-semibold mt-0.5">Build premium, responsive product classes dynamically linked to your storefront catalog.</p>
                </div>
                <button 
                  onClick={() => {
                    setCategoryForm({
                      name: "",
                      type: "product",
                      isActive: true,
                      description: "",
                      image: "",
                      bannerImage: "",
                      isFeatured: false,
                      showOnHomepage: true,
                      displayOrder: 0,
                      buttonText: ""
                    });
                    setEditingCategoryId(null);
                    Swal.fire("Reset", "Form fields cleared.", "success");
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#201064] text-xs font-bold rounded-xl transition duration-200 border border-slate-200 cursor-pointer"
                >
                  <RefreshCw size={12} /> Clear Form
                </button>
              </div>

              {/* Creation Form & Live Preview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Form Input Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#201064] uppercase tracking-wider mb-5 border-b border-slate-105 pb-3 flex items-center gap-2">
                      <Plus size={16} className="text-[#0A7FE6]" />
                      {editingCategoryId ? "Edit Product Category" : "Create New Product Category"}
                    </h3>
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!categoryForm.name || !categoryForm.description || !categoryForm.buttonText || !categoryForm.image) {
                          Swal.fire("Warning", "All fields are required.", "warning");
                          return;
                        }
                        setIsSubmittingCategory(true);
                        await handleCategorySubmit(e);
                        setIsSubmittingCategory(false);
                      }} 
                      className="space-y-5"
                    >
                      
                      {/* Title / Name */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Category Title <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. STEM Robotics Kits"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          className={`w-full bg-slate-50 border ${!categoryForm.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-[#0A7FE6]'} rounded-xl px-4 py-3 outline-none focus:bg-white text-xs font-semibold transition`}
                        />
                        {!categoryForm.name && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1">Title is required.</span>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Category Description <span className="text-rose-500">*</span></label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Provide details about the hardware parts, kits, or projects in this category..."
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          className={`w-full bg-slate-50 border ${!categoryForm.description ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-[#0A7FE6]'} rounded-xl px-4 py-3 outline-none focus:bg-white text-xs font-semibold text-slate-700 transition`}
                        />
                        {!categoryForm.description && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1">Description is required.</span>
                        )}
                      </div>

                      {/* Button Text */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Button CTA Text <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Shop Now"
                          value={categoryForm.buttonText}
                          onChange={(e) => setCategoryForm({ ...categoryForm, buttonText: e.target.value })}
                          className={`w-full bg-slate-50 border ${!categoryForm.buttonText ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-[#0A7FE6]'} rounded-xl px-4 py-3 outline-none focus:bg-white text-xs font-semibold transition`}
                        />
                        {!categoryForm.buttonText && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1">Button text is required.</span>
                        )}
                      </div>

                      {/* Image Upload Drop Zone */}
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Category Card Image <span className="text-rose-500">*</span></label>
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleCategoryCardImageFile(file);
                          }}
                          className={`border-2 border-dashed ${!categoryForm.image ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2`}
                        >
                          <Upload size={24} className="text-slate-400" />
                          <span className="text-[11px] text-slate-500 font-bold">Drag & Drop Image Here</span>
                          <span className="text-[9px] text-slate-400">Supports JPG, PNG, WEBP (Max 5MB)</span>
                          <input 
                            type="file" 
                            required={!editingCategoryId}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCategoryCardImageFile(file);
                            }}
                            className="hidden"
                            id="catImageFileInput"
                          />
                          <label htmlFor="catImageFileInput" className="text-[#0A7FE6] font-black text-[11px] hover:underline cursor-pointer">Or Browse files</label>
                        </div>
                        {categoryForm.image && (
                          <div className="mt-3 relative w-32 h-32 border rounded-xl overflow-hidden bg-slate-50 p-2 flex items-center justify-center">
                            <img src={categoryForm.image} alt="Card Preview" className="max-h-full max-w-full object-contain" />
                            <button 
                              type="button" 
                              onClick={() => setCategoryForm(prev => ({ ...prev, image: "" }))}
                              className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        )}
                        {!categoryForm.image && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1.5">Image file is required.</span>
                        )}
                        <button
                          type="button"
                          id="devLoadDemoImage"
                          onClick={() => {
                            setCategoryForm(prev => ({
                              ...prev,
                              image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                            }));
                          }}
                          className="text-[10px] text-[#0A7FE6] font-bold hover:underline cursor-pointer mt-1.5 block"
                        >
                          [Developer Tool: Load Demo Image]
                        </button>
                      </div>

                      <div className="flex gap-4">
                        {/* Active Toggle status */}
                        <div className="flex-1 flex items-center gap-2.5 bg-slate-50 p-3 border border-slate-150 rounded-xl">
                          <input 
                            type="checkbox"
                            id="newCatIsActive"
                            checked={categoryForm.isActive}
                            onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                            className="w-4 h-4 text-[#201064] border-gray-300 rounded cursor-pointer"
                          />
                          <label htmlFor="newCatIsActive" className="text-xs font-bold text-slate-700 cursor-pointer select-none">Active Visibility</label>
                        </div>
                        {/* Display Order */}
                        <div className="w-1/3">
                          <input 
                            type="number"
                            placeholder="Order"
                            value={categoryForm.displayOrder}
                            onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#0A7FE6] text-xs font-semibold text-center"
                            title="Display Order Index"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmittingCategory || !categoryForm.name || !categoryForm.description || !categoryForm.buttonText || !categoryForm.image}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#201064] hover:bg-[#0A7FE6] text-white text-xs font-bold rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-md transition-all duration-300 cursor-pointer"
                      >
                        {isSubmittingCategory ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : editingCategoryId ? (
                          <Save size={14} />
                        ) : (
                          <Plus size={14} />
                        )}
                        {isSubmittingCategory ? "Saving..." : editingCategoryId ? "Update Category Specs" : "Publish Category Node"}
                      </button>
                      {editingCategoryId && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingCategoryId(null);
                            setCategoryForm({
                              name: "",
                              type: "product",
                              isActive: true,
                              description: "",
                              image: "",
                              bannerImage: "",
                              isFeatured: false,
                              showOnHomepage: true,
                              displayOrder: 0,
                              buttonText: ""
                            });
                          }} 
                          className="w-full py-3 bg-slate-100 text-slate-605 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </form>
                  </div>
                </div>

                {/* Real-time Live Preview Card */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="sticky top-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Preview Card</span>
                      <span className="text-[9px] font-bold text-[#0A7FE6] bg-[#0A7FE6]/10 px-2 py-0.5 rounded-full">Interactive</span>
                    </div>
                    
                    {/* CategoryCard replication */}
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-150/80 shadow-lg group hover:shadow-2xl transition-all duration-300 flex flex-col justify-between select-none min-h-[460px] relative">
                      {/* Inner border glow */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#0A7FE6]/20 rounded-3xl transition-all duration-300 pointer-events-none z-10" />

                      <div>
                        {/* Image Container */}
                        <div className="h-56 bg-slate-50/50 relative overflow-hidden flex items-center justify-center p-6 border-b border-slate-100">
                          {categoryForm.image ? (
                            <img 
                              src={categoryForm.image} 
                              alt="Card Image" 
                              className="max-h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                              <Upload size={32} className="opacity-50" />
                              <span className="text-[10px] font-extrabold uppercase">No Image Uploaded</span>
                            </div>
                          )}
                          <span className="absolute top-4 right-4 bg-[#201064] text-white font-black text-[9px] px-3 py-1 rounded-full shadow-sm z-10 tracking-wide">
                            0 Products
                          </span>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-3">
                          <h1 className="text-xl font-black text-[#201064] group-hover:text-[#0A7FE6] transition-colors duration-300 leading-snug">
                            {categoryForm.name || "Category Title Placeholder"}
                          </h1>
                          <p className="text-xs text-slate-500 font-semibold line-clamp-3 leading-relaxed">
                            {categoryForm.description || "Category description context will update automatically as you write."}
                          </p>
                        </div>
                      </div>

                      {/* Action CTA Button */}
                      <div className="p-6 pt-0">
                        <button 
                          type="button" 
                          className="w-full flex items-center justify-center gap-2 bg-[#201064] group-hover:bg-[#0A7FE6] text-white py-3.5 rounded-xl font-black text-xs shadow-md transition-all duration-300 transform group-hover:scale-[1.01]"
                        >
                          <span>{categoryForm.buttonText || "View Category"}</span>
                          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Advanced Management Table Block */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Toolbar Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider flex items-center gap-2">
                      <ListOrdered size={16} className="text-[#0A7FE6]" />
                      Active Categories Directory
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Total: {sortedCategories.length} items</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search input */}
                    <div className="relative w-full sm:w-60">
                      <Search className="absolute left-3 top-3 text-slate-400" size={13} />
                      <input 
                        type="text" 
                        placeholder="Search categories..."
                        value={catSearch}
                        onChange={(e) => {
                          setCatSearch(e.target.value);
                          setCatPage(1);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:border-[#0A7FE6] focus:bg-white text-xs font-semibold shadow-sm"
                      />
                    </div>

                    {/* Status filter */}
                    <select 
                      value={catStatusFilter}
                      onChange={(e) => {
                        setCatStatusFilter(e.target.value);
                        setCatPage(1);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#0A7FE6] shadow-sm cursor-pointer text-slate-700"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>

                    {/* Sort Field */}
                    <select 
                      value={catSortField}
                      onChange={(e) => setCatSortField(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:border-[#0A7FE6] shadow-sm cursor-pointer text-slate-700"
                    >
                      <option value="displayOrder">Sort By displayOrder</option>
                      <option value="name">Sort By Title</option>
                      <option value="createdAt">Sort By Created Date</option>
                    </select>

                    {/* Sort Direction Toggle */}
                    <button 
                      onClick={() => setCatSortDir(prev => prev === "asc" ? "desc" : "asc")}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition shadow-sm cursor-pointer"
                      title={`Sort Direction: ${catSortDir.toUpperCase()}`}
                    >
                      <ArrowUpDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Thumbnail</th>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Button Text</th>
                        <th className="py-3 px-4 text-center">Display Order</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCategories.map((cat: any) => (
                        <tr key={cat._id} className="border-b border-slate-50 hover:bg-slate-50/80 text-slate-650 font-semibold transition duration-150">
                          <td className="py-3 px-4">
                            <img 
                              src={cat.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=300&q=80"} 
                              alt="" 
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 shadow-sm" 
                            />
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-800 truncate max-w-[140px]">{cat.name}</td>
                          <td className="py-3 px-4 max-w-[200px] truncate text-slate-450">{cat.description || "N/A"}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#0A7FE6]">{cat.buttonText || "View Category"}</td>
                          <td className="py-3 px-4 text-center font-black text-[#201064]">{cat.displayOrder || 0}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${cat.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                              {cat.isActive ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-bold">{cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "N/A"}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => setViewingCategory(cat)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 border border-slate-100 rounded-lg transition cursor-pointer"
                                title="Quick View Details"
                              >
                                <Eye size={12} />
                              </button>
                              <button 
                                onClick={() => {
                                  setEditingCategoryId(cat._id);
                                  setCategoryForm({
                                    name: cat.name,
                                    type: cat.type,
                                    isActive: cat.isActive,
                                    description: cat.description || "",
                                    image: cat.image || "",
                                    bannerImage: cat.bannerImage || "",
                                    isFeatured: cat.isFeatured || false,
                                    showOnHomepage: cat.showOnHomepage !== undefined ? cat.showOnHomepage : true,
                                    displayOrder: cat.displayOrder || 0,
                                    buttonText: cat.buttonText || ""
                                  });
                                  // Scroll to form smoothly
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition cursor-pointer"
                                title="Edit Details"
                              >
                                <Edit size={12} />
                              </button>
                              <button 
                                onClick={() => handleToggleCategoryActive(cat)}
                                className={`p-2 rounded-lg border transition cursor-pointer ${cat.isActive ? "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100" : "text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"}`}
                                title={cat.isActive ? "Disable Access" : "Enable Access"}
                              >
                                <Power size={12} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(cat._id)}
                                className="p-2 text-rose-500 hover:bg-rose-55 border border-slate-100 rounded-lg transition cursor-pointer"
                                title="Delete Permanently"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {paginatedCategories.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-slate-400 font-bold">No matching categories found in workspace.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">
                      Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedCategories.length)} of {sortedCategories.length} categories
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button 
                        disabled={catPage === 1}
                        onClick={() => setCatPage(prev => Math.max(1, prev - 1))}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition text-slate-650"
                        title="Previous Page"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setCatPage(idx + 1)}
                          className={`w-7.5 h-7.5 text-xs font-bold rounded-lg border transition cursor-pointer ${catPage === idx + 1 ? 'bg-[#201064] text-white border-[#201064] shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                      <button 
                        disabled={catPage === totalPages}
                        onClick={() => setCatPage(prev => Math.min(totalPages, prev + 1))}
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition text-slate-650"
                        title="Next Page"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom viewingCategory details popup modal */}
              {viewingCategory && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                    
                    {/* Image container header */}
                    <div className="h-56 bg-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100">
                      <img 
                        src={viewingCategory.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=300&q=80"} 
                        alt="" 
                        className="max-h-full object-contain filter drop-shadow-md"
                      />
                      <button 
                        onClick={() => setViewingCategory(null)}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-650 rounded-full p-2 border border-slate-100 cursor-pointer transition hover:scale-105"
                        title="Close"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Modal details */}
                    <div className="p-6 space-y-4 overflow-y-auto">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-[#0A7FE6]/10 text-[#0A7FE6] text-[9px] font-black uppercase rounded-full tracking-wide">
                            {viewingCategory.type} Category
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${viewingCategory.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                            {viewingCategory.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-[#201064] tracking-tight">{viewingCategory.name}</h2>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Description</span>
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-0.5">{viewingCategory.description || "No description catalog context provided."}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Button CTA Text</span>
                            <span className="text-xs text-[#0A7FE6] font-mono font-bold block mt-0.5">{viewingCategory.buttonText || "View Category"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Display Order</span>
                            <span className="text-xs text-[#201064] font-black block mt-0.5">Index #{viewingCategory.displayOrder || 0}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Creation Date</span>
                            <span className="text-xs text-slate-500 font-bold block mt-0.5">{viewingCategory.createdAt ? new Date(viewingCategory.createdAt).toLocaleString() : "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Slug (Auto Generated)</span>
                            <span className="text-xs text-slate-550 font-mono block mt-0.5">{viewingCategory.slug || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Action footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => setViewingCategory(null)}
                        className="px-6 py-2.5 bg-[#201064] hover:bg-[#321d96] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition"
                      >
                        Close Details
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ── SECTION 2: USER MANAGEMENT (Manage Users) ── */}
        {activeMenu === "users_manage" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#201064] tracking-tight">Customer Database</h1>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">Toggle customer access permissions and block/unblock accounts.</p>
              </div>
              <input 
                type="text" 
                placeholder="Search students & customers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-xs font-semibold w-full sm:w-72 shadow-sm"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-5">Student Details</th>
                    <th className="py-3 px-5">Role</th>
                    <th className="py-3 px-5">Courses Enrolled</th>
                    <th className="py-3 px-5">Account Status</th>
                    <th className="py-3 px-5 text-center">Toggle State</th>
                  </tr>
                </thead>
                <tbody>
                  {standardUsersList.map((usr: any) => (
                    <tr key={usr._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-600 font-semibold">
                      <td className="py-4 px-5">
                        <p className="font-extrabold text-slate-800">{usr.name}</p>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{usr.email}</span>
                      </td>
                      <td className="py-4 px-5 uppercase text-[10px] font-black text-slate-400">{usr.role}</td>
                      <td className="py-4 px-5 font-black text-[#201064]">{usr.purchasedCourses?.length || 0} Modules</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${usr.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          {usr.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button 
                          onClick={() => handleToggleStatus(usr._id, usr.isActive, usr.name)}
                          className={`p-2 rounded-lg transition-all border ${usr.isActive ? "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100" : "text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"}`}
                        >
                          <Power size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {standardUsersList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 font-bold">No standard student accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 3: USER DETAILS & ACTIVITY ── */}
        {(activeMenu === "users_details" || activeMenu === "users_activity") && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">User Analytics & Activity Profiles</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Comprehensive audit logs of customer transactions, logins, and settings changes.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto"><Activity size={28} /></div>
              <h3 className="font-extrabold text-[#201064] text-base">Advanced Telemetry Logging Active</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">System is recording API request headers, checkout attempts, course module view completions, and payment callbacks. Select customer records from the database directory to inspect individual trace logs.</p>
            </div>
          </div>
        )}

        {/* ── SECTION 4: ADMIN MANAGEMENT ── */}
        {(activeMenu === "admins_manage" || activeMenu === "admins_create") && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#201064] tracking-tight">Administrative Accounts</h1>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">Register new moderators, customize dashboard privileges, and revoke console permissions.</p>
              </div>
              <input 
                type="text" 
                placeholder="Search console users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-xs font-semibold w-full sm:w-72 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  {editingAdminId ? "Edit Admin Credentials" : "Register Admin Node"}
                </h3>
                <form onSubmit={editingAdminId ? handleUpdateAdmin : handleCreateAdmin} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Manoj Admin"
                      value={editingAdminId ? editAdminData.name : newAdmin.name}
                      onChange={(e) => editingAdminId 
                        ? setEditAdminData({ ...editAdminData, name: e.target.value })
                        : setNewAdmin({ ...newAdmin, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="admin@sakrobotix.com"
                      value={editingAdminId ? editAdminData.email : newAdmin.email}
                      onChange={(e) => editingAdminId 
                        ? setEditAdminData({ ...editAdminData, email: e.target.value })
                        : setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Password</label>
                    <input 
                      type="password" 
                      required={!editingAdminId}
                      placeholder={editingAdminId ? "Leave blank to keep password" : "••••••••"}
                      value={editingAdminId ? editAdminData.password : newAdmin.password}
                      onChange={(e) => editingAdminId 
                        ? setEditAdminData({ ...editAdminData, password: e.target.value })
                        : setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer shadow-md transition-all">
                    {editingAdminId ? <Save size={14} /> : <Plus size={14} />}
                    {editingAdminId ? "Save Configurations" : "Launch Admin Account"}
                  </button>
                  {editingAdminId && (
                    <button type="button" onClick={() => setEditingAdminId(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              {/* Table Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Active Administrators Directory</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsList.map((adm: any) => (
                        <tr key={adm._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-600 font-semibold">
                          <td className="py-3 px-3">
                            <p className="font-extrabold text-slate-800">{adm.name}</p>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{adm.email}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${adm.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                              {adm.isActive ? "Active" : "Suspended"}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditingAdminId(adm._id);
                                  setEditAdminData({ name: adm.name, email: adm.email, password: "" });
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition"
                                title="Edit Credentials"
                              >
                                <Edit size={13} />
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(adm._id, adm.isActive, adm.name)}
                                className={`p-2 rounded-lg border transition ${adm.isActive ? "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100" : "text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"}`}
                                title={adm.isActive ? "Suspend Node" : "Re-activate Node"}
                              >
                                <Power size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {adminsList.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-slate-400 font-bold">No administrative accounts found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 5: CATEGORIES MANAGEMENT (Product & Course Categories) ── */}
        {(activeMenu === "courses_categories" || activeMenu === "products_categories" || activeMenu === "categories_create" || activeMenu === "categories_manage") && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Category Catalog Editor</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Manage dynamic categories dropdown options for courses & products.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  {editingCategoryId ? "Edit Category Details" : "Create Dynamic Category"}
                </h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Category Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Arduino Boards"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Catalog Module Type</label>
                    <select 
                      value={categoryForm.type}
                      onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    >
                      <option value="product">E-Commerce hardware (Product)</option>
                      <option value="course">Education curriculum (Course)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Add simple categorization context..."
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-600"
                    />
                  </div>

                  {/* Card Image upload */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Category Card Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleCategoryCardImageFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs"
                    />
                    {categoryForm.image && (
                      <div className="mt-2 border rounded-xl overflow-hidden bg-slate-50 p-2 flex justify-center max-h-32">
                        <img src={categoryForm.image} alt="Card Preview" className="max-h-28 object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Banner Image upload */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Category Banner Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleCategoryBannerImageFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs"
                    />
                    {categoryForm.bannerImage && (
                      <div className="mt-2 border rounded-xl overflow-hidden bg-slate-50 p-2 flex justify-center max-h-32">
                        <img src={categoryForm.bannerImage} alt="Banner Preview" className="max-h-28 object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Display settings */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Display Order</label>
                      <input 
                        type="number"
                        value={categoryForm.displayOrder}
                        onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      />
                    </div>
                    <div className="flex flex-col justify-end space-y-2 pb-1">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          id="catIsFeatured"
                          checked={categoryForm.isFeatured}
                          onChange={(e) => setCategoryForm({ ...categoryForm, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="catIsFeatured" className="text-[10px] font-bold text-slate-700 cursor-pointer select-none">Featured</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          id="catShowOnHomepage"
                          checked={categoryForm.showOnHomepage}
                          onChange={(e) => setCategoryForm({ ...categoryForm, showOnHomepage: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="catShowOnHomepage" className="text-[10px] font-bold text-slate-700 cursor-pointer select-none">Homepage</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <input 
                      type="checkbox"
                      id="catIsActive"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="catIsActive" className="text-xs font-bold text-slate-700 cursor-pointer select-none">Enable Category Visibility</label>
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer shadow-md">
                    {editingCategoryId ? <Save size={14} /> : <Plus size={14} />}
                    {editingCategoryId ? "Update Category Node" : "Publish Category"}
                  </button>
                  {editingCategoryId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCategoryForm({
                          name: "",
                          type: "product",
                          isActive: true,
                          description: "",
                          image: "",
                          bannerImage: "",
                          isFeatured: false,
                          showOnHomepage: true,
                          displayOrder: 0,
                          buttonText: ""
                        });
                      }} 
                      className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>

              {/* Dynamic List Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Active Platform Categories</h3>
                <div className="space-y-4">
                  {[...categories]
                    .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((cat: any) => (
                      <div key={cat._id} className="flex items-center gap-4 p-3.5 border border-slate-100 rounded-xl hover:shadow-sm transition bg-white">
                        <img 
                          src={cat.image || "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=300&q=80"} 
                          alt="" 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" 
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-800 text-xs">{cat.name}</h4>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full ${cat.type === "product" ? "bg-cyan-50 text-cyan-600" : "bg-indigo-50 text-indigo-600"}`}>{cat.type}</span>
                            {!cat.isActive && <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-slate-100 text-slate-500 rounded-full">Disabled</span>}
                            {cat.isFeatured && <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-amber-50 text-amber-600 rounded-full">Featured</span>}
                            {cat.showOnHomepage && <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 rounded-full">Home</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug">{cat.description || "No description catalog context provided."}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-450">
                            <span>Order: {cat.displayOrder || 0}</span>
                            <span>•</span>
                            <span className="text-[#201064]">{cat.productCount || 0} Products</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => {
                              setEditingCategoryId(cat._id);
                              setCategoryForm({
                                name: cat.name,
                                type: cat.type,
                                isActive: cat.isActive,
                                description: cat.description || "",
                                image: cat.image || "",
                                bannerImage: cat.bannerImage || "",
                                isFeatured: cat.isFeatured || false,
                                showOnHomepage: cat.showOnHomepage !== undefined ? cat.showOnHomepage : true,
                                displayOrder: cat.displayOrder || 0,
                                buttonText: cat.buttonText || ""
                              });
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={() => handleToggleCategoryActive(cat)}
                            className={`p-2 rounded-lg border transition ${cat.isActive ? "text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100" : "text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100"}`}
                            title={cat.isActive ? "Disable Category" : "Enable Category"}
                          >
                            <Power size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-center text-slate-400 py-6 font-semibold">No dynamic categories published.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 6: COURSE CATALOG (Courses) ── */}
        {(activeMenu === "courses_catalog" || activeMenu === "courses_reviews") && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Education Course Catalog</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Publish syllabus guidelines, instructor allocations, and lesson arrays.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Block */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  {editingCourseId ? "Modify Syllabus Details" : "Publish Course Module"}
                </h3>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Course Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. ROS 2 Node Interfacing"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Course Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Overview outline..."
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Category</label>
                      <select 
                        value={courseForm.category}
                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                      >
                        {activeCourseCategories.map((c) => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                        {activeCourseCategories.length === 0 && (
                          <>
                            <option value="Robotics">Robotics</option>
                            <option value="IoT">IoT</option>
                            <option value="Coding">Coding</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Cover Image Link</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Instructor Name</label>
                    <input 
                      type="text" 
                      placeholder="Manoj Kumar"
                      value={courseForm.instructor}
                      onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer shadow-md">
                    {editingCourseId ? <Save size={14} /> : <Plus size={14} />}
                    {editingCourseId ? "Save Curriculum module" : "Publish Syllabus to Catalog"}
                  </button>
                  {editingCourseId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingCourseId(null);
                        setCourseForm({ title: "", description: "", category: "Robotics", price: 0, image: "", instructor: "SakRobotix Team" });
                      }} 
                      className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </div>

              {/* Catalog List */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Academic Offerings</h3>
                <div className="space-y-4">
                  {courses.map((course: any) => (
                    <div key={course._id} className="flex items-center gap-4 p-3.5 border border-slate-100 rounded-xl hover:shadow-sm transition bg-white">
                      <img src={course.image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                      <div className="flex-1">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase">{course.category}</span>
                        <h4 className="font-extrabold text-slate-800 text-xs mt-1.5 leading-snug">{course.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Lead Lecturer: {course.instructor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-slate-800 text-sm">₹{course.price}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleEditCourseClick(course)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition" title="Modify"><Edit size={13} /></button>
                          <button onClick={() => handleDeleteCourse(course._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-lg transition" title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-center text-slate-400 py-6 font-semibold">No educational courses found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 7: PRODUCTS & FEATURED PRODUCTS (Products Catalog) ── */}
        {(activeMenu === "products_manage" || activeMenu === "products_featured" || activeMenu === "products_inventory" || activeMenu === "products_create") && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">
                {activeMenu === "products_featured" ? "Featured Product Positions" : activeMenu === "products_create" ? "Create New Product" : "STEM Hardware Catalog"}
              </h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Control pricing, original/discount values, stock levels, GST tax layers, and gallery uploads.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Product Add/Edit Form - Visible on products_manage and products_create */}
              {(activeMenu === "products_manage" || activeMenu === "products_create") && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    {editingProductId ? "Modify Listing Details" : "Publish E-Commerce Item"}
                  </h3>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Basic Info</h4>
                      
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Product Name (H1 Style)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Arduino Uno R3 SMD Board"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Brand Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="SAKROBOTIX"
                            value={productForm.brand}
                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Item SKU</label>
                          <input 
                            type="text" 
                            required
                            placeholder="SKU-ARD-UNO"
                            value={productForm.sku}
                            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Product Category</label>
                        <select 
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                        >
                          {activeProductCategories.map((c) => (
                            <option key={c._id} value={c.slug}>{c.name}</option>
                          ))}
                          {activeProductCategories.length === 0 && (
                            <>
                              <option value="robotics-kits">Robotics Kits</option>
                              <option value="arduino-boards">Arduino Boards</option>
                              <option value="raspberry-pi">Raspberry Pi</option>
                              <option value="sensors">Sensors</option>
                              <option value="motors">Motors</option>
                              <option value="iot-devices">IoT Devices</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Short Description</label>
                        <textarea 
                          required
                          rows={3}
                          placeholder="Product highlights summary..."
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Pricing & Taxes</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Original Price (₹)</label>
                          <input 
                            type="number" 
                            required
                            value={productForm.originalPrice}
                            onChange={(e) => {
                              const orig = Number(e.target.value);
                              setProductForm(prev => ({
                                ...prev,
                                originalPrice: orig,
                                price: orig - (orig * (prev.discount || 0) / 100)
                              }));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Discount (%)</label>
                          <input 
                            type="number" 
                            required
                            value={productForm.discount}
                            onChange={(e) => {
                              const disc = Number(e.target.value);
                              setProductForm(prev => ({
                                ...prev,
                                discount: disc,
                                price: prev.originalPrice - (prev.originalPrice * (disc || 0) / 100)
                              }));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Tax / GST (%)</label>
                          <input 
                            type="number" 
                            required
                            value={productForm.tax}
                            onChange={(e) => setProductForm({ ...productForm, tax: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 font-bold">Saleprice (Auto)</label>
                          <input 
                            type="number" 
                            disabled
                            value={productForm.price}
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-indigo-700 select-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock & Rating */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Inventory & Rating</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Stock Quantity</label>
                          <input 
                            type="number" 
                            required
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Low Stock Alert</label>
                          <input 
                            type="number" 
                            required
                            value={productForm.lowStockThreshold}
                            onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Initial Rating</label>
                          <input 
                            type="number" 
                            min="1"
                            max="5"
                            step="0.1"
                            required
                            value={productForm.rating}
                            onChange={(e) => setProductForm({ ...productForm, rating: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Reviews Count</label>
                          <input 
                            type="number" 
                            required
                            value={productForm.reviewCount}
                            onChange={(e) => setProductForm({ ...productForm, reviewCount: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Media Files</h4>
                      
                      {/* Main Image Upload Card */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 font-black uppercase tracking-wider text-indigo-700">Main Product Image (Required)</label>
                        {productForm.image ? (
                          <div className="relative group w-full aspect-video border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                            <img src={productForm.image} alt="Main Preview" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-3">
                              <label htmlFor="mainImageReplace" className="bg-white/95 text-slate-800 hover:bg-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg cursor-pointer shadow hover:scale-105 transition">
                                Replace
                              </label>
                              <button 
                                type="button" 
                                onClick={() => setProductForm(prev => ({ ...prev, image: "" }))} 
                                className="bg-rose-600/90 text-white hover:bg-rose-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow hover:scale-105 transition"
                              >
                                Remove
                              </button>
                              <input 
                                type="file" 
                                id="mainImageReplace" 
                                accept="image/jpeg,image/jpg,image/png,image/webp" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleMainImageFile(file);
                                }} 
                                className="hidden" 
                              />
                            </div>
                          </div>
                        ) : (
                          <div 
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleMainImageFile(file);
                            }}
                            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-1.5"
                          >
                            <Upload size={24} className="text-slate-400" />
                            <span className="text-[11px] text-slate-500 font-bold">Drag & Drop Main Image Here</span>
                            <span className="text-[9px] text-slate-400">Supports JPG, JPEG, PNG, WEBP (Max 5MB)</span>
                            <input 
                              type="file" 
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMainImageFile(file);
                              }}
                              className="hidden"
                              id="mainImageFileInput"
                            />
                            <label htmlFor="mainImageFileInput" className="text-indigo-600 font-black text-[11px] hover:underline cursor-pointer">Or Browse files</label>
                          </div>
                        )}
                      </div>

                      {/* Drag & Drop gallery area */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 font-black uppercase tracking-wider text-indigo-700">Gallery Images (Min 5, Max 8)</label>
                        <div 
                          onDragOver={handleDragOver}
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = e.dataTransfer.files;
                            if (files) handleGalleryImagesFiles(files);
                          }}
                          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-1.5"
                        >
                          <Upload size={24} className="text-slate-400" />
                          <span className="text-[11px] text-slate-500 font-bold">Drag & Drop Gallery Images Here</span>
                          <span className="text-[9px] text-slate-400">Supports drag & drop image reordering (Min 5, Max 8)</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) handleGalleryImagesFiles(files);
                            }}
                            className="hidden"
                            id="galleryFileInput"
                          />
                          <label htmlFor="galleryFileInput" className="block text-indigo-600 font-black mt-1 hover:underline cursor-pointer">Or Browse files</label>
                        </div>

                        {/* Gallery Previews with drag-and-drop support */}
                        <div className="grid grid-cols-4 gap-2 mt-3 p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                          {productForm.images.map((gImg, idx) => (
                            <div 
                              key={idx} 
                              draggable
                              onDragStart={() => handleGalleryDragStart(idx)}
                              onDragOver={(e) => handleGalleryDragOver(e, idx)}
                              onDragEnd={handleGalleryDragEnd}
                              className={`relative group aspect-square border border-slate-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between cursor-move hover:shadow transition ${draggedGalleryIndex === idx ? 'opacity-40 border-indigo-500 ring-2 ring-indigo-500/30' : ''}`}
                            >
                              <img src={gImg} alt={`g-${idx}`} className="w-full h-full object-cover flex-grow" draggable={false} />
                              <button
                                type="button"
                                onClick={() => {
                                  setProductForm(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, gIdx) => gIdx !== idx)
                                  }));
                                }}
                                className="absolute top-1 right-1 bg-rose-500/90 text-white rounded-full p-0.5 hover:bg-rose-600 transition cursor-pointer z-10 shadow"
                              >
                                <X size={10} />
                              </button>
                              
                              {/* Reorder controls fallback */}
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white flex justify-between px-1 py-0.5 opacity-0 group-hover:opacity-100 transition z-10">
                                <button type="button" disabled={idx === 0} onClick={() => handleMoveGalleryItem(idx, "left")} className="text-[8px] hover:text-cyan-300 disabled:opacity-30">◀</button>
                                <span className="text-[7px] font-black">Drag to Reorder</span>
                                <button type="button" disabled={idx === productForm.images.length - 1} onClick={() => handleMoveGalleryItem(idx, "right")} className="text-[8px] hover:text-cyan-300 disabled:opacity-30">▶</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-1">{productForm.images.length} of 5-8 images uploaded.</span>
                      </div>
                    </div>

                    {/* Visibility toggles */}
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2.5 bg-slate-50 p-2.5 border border-slate-150 rounded-xl">
                        <input 
                          type="checkbox"
                          id="prodFeatured"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="prodFeatured" className="text-[10px] font-bold text-slate-700 cursor-pointer select-none">Featured</label>
                      </div>

                      <div className="flex-1 flex items-center gap-2.5 bg-slate-50 p-2.5 border border-slate-150 rounded-xl">
                        <input 
                          type="checkbox"
                          id="prodActive"
                          checked={productForm.isActive}
                          onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="prodActive" className="text-[10px] font-bold text-slate-700 cursor-pointer select-none">Active Visible</label>
                      </div>
                    </div>

                    {(!productForm.image || productForm.images.length < 5 || productForm.images.length > 8) && (
                      <span className="text-[9.5px] text-rose-500 font-bold block text-center bg-rose-50 border border-rose-150 py-1.5 px-3 rounded-lg mt-1 select-none">
                        ⚠️ Main image and at least 5 gallery images are required to publish.
                      </span>
                    )}

                    <button 
                      type="submit" 
                      disabled={!productForm.image || productForm.images.length < 5 || productForm.images.length > 8}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 cursor-pointer shadow-md mt-1"
                    >
                      {editingProductId ? <Save size={14} /> : <Plus size={14} />}
                      {editingProductId ? "Save Product Specifications" : "Publish to Store Catalog"}
                    </button>
                    {editingProductId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingProductId(null);
                          setProductForm({
                            name: "",
                            description: "",
                            category: "robotics-kits",
                            price: 0,
                            image: "",
                            stock: 25,
                            brand: "",
                            sku: "",
                            originalPrice: 0,
                            discount: 0,
                            rating: 5,
                            reviewCount: 0,
                            images: [],
                            isFeatured: false,
                            isActive: true,
                            orderIndex: 0,
                            tax: 18,
                            lowStockThreshold: 5,
                          });
                        }} 
                        className="w-full py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              )}

              {/* Product Catalog Grid / Reorder list — hidden on products_create standalone view */}
              <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm ${(activeMenu === "products_manage" || activeMenu === "products_create") ? "lg:col-span-2" : "lg:col-span-3"}`}>
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider">
                    {activeMenu === "products_featured" ? "Featured Products Position Ordering" : "Inventory Stock Ledger"}
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {activeMenu === "products_featured" 
                      ? `${products.filter(p => p.isFeatured).length} Featured`
                      : `${products.length} Products`}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {products
                    .filter(p => activeMenu !== "products_featured" || p.isFeatured)
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((product: any, idx: number) => {
                      const isLowStock = product.stock <= (product.lowStockThreshold || 5);
                      
                      return (
                        <div key={product._id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition bg-white">
                          
                          {/* Reorder Arrows (Always available for Super Admin to arrange product ordering) */}
                          <div className="flex flex-col gap-1 mr-1 shrink-0">
                            <button 
                              type="button"
                              disabled={idx === 0} 
                              onClick={() => handleMoveProduct(idx, "up")}
                              className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                              title="Move Position Up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button 
                              type="button"
                              disabled={idx === products.length - 1} 
                              onClick={() => handleMoveProduct(idx, "down")}
                              className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                              title="Move Position Down"
                            >
                              <ChevronDown size={16} />
                            </button>
                          </div>

                          <img src={product.image || "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80"} alt="" className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[8px] font-black uppercase rounded-full">{product.category.replace("-", " ")}</span>
                              {product.isFeatured && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded-full uppercase">Featured</span>
                              )}
                              {!product.isActive && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black rounded-full uppercase">Inactive</span>
                              )}
                              {isLowStock && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-black rounded-full uppercase flex items-center gap-0.5"><AlertTriangle size={8} /> Low Stock</span>
                              )}
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-xs mt-1.5 leading-snug truncate">{product.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Brand: {product.brand || "Generic"}</span>
                              <span>SKU: {product.sku || "N/A"}</span>
                              <span className={product.stock > 0 ? "text-emerald-600" : "text-rose-500 font-black"}>
                                {product.stock > 0 ? `${product.stock} units` : "Out of Stock"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-slate-800 text-sm">₹{product.price.toLocaleString("en-IN")}</p>
                            {product.originalPrice > product.price && (
                              <p className="text-[10px] line-through text-slate-400 font-bold">₹{product.originalPrice.toLocaleString("en-IN")}</p>
                            )}
                            <div className="flex gap-1.5 mt-2.5 justify-end">
                              <button onClick={() => handleToggleProductFeatured(product)} className={`p-1.5 rounded-lg border transition ${product.isFeatured ? "text-indigo-600 bg-indigo-50 border-indigo-100" : "text-slate-400 bg-white border-slate-200"}`} title="Toggle Featured"><Star size={12} /></button>
                              <button onClick={() => handleToggleProductActive(product)} className={`p-1.5 rounded-lg border transition ${product.isActive ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-white border-slate-200"}`} title="Toggle Visibility"><Power size={12} /></button>
                              <button onClick={() => handleEditProductClick(product)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition" title="Modify Specs"><Edit size={12} /></button>
                              <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-lg transition" title="Delete Listing"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {products.length === 0 && (
                    <p className="text-center text-slate-400 py-6 font-semibold">No hardware listings found in repository.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── SECTION 8: ORDER MANAGEMENT ── */}
        {(activeMenu === "orders_manage" || activeMenu === "orders_refunds") && reportData && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Checkout Orders Ledger</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Track shipment delivery states, fulfill pending carts, and execute refund requests.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Purchased Modules</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Delivery Status</th>
                    <th className="py-3 px-4 text-center">Fulfill State</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.transactions.map((tx: any) => (
                    <tr key={tx._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-600 font-semibold">
                      <td className="py-3.5 px-4 font-mono text-indigo-600 font-bold">{tx.paymentDetails.transactionId}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-slate-800">{tx.user?.name || "Deleted Customer"}</p>
                        <span className="text-[9px] text-slate-400 block font-normal mt-0.5">{tx.user?.email || ""}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">{tx.items?.length || 1} items</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-800">₹{tx.totalAmount.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${tx.orderStatus === "delivered" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                          {tx.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button 
                          onClick={() => {
                            Swal.fire("Order Fulfilled", `Shipment details dispatched to ${tx.user?.email || "customer"}.`, "success");
                          }}
                          className="px-3 py-1 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 cursor-pointer"
                        >
                          Ship Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 9: REVENUE & TRANSACTIONS ── */}
        {(activeMenu === "revenue_analytics" || activeMenu === "revenue_transactions") && reportData && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Revenue Analytics & Payment ledgers</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Audit transaction invoices, gateway settlement status, and net balances.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider mb-2">Revenue summary breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">E-Commerce Gross</span>
                  <p className="text-lg font-black text-[#201064] mt-1">₹{reportData.summary.productRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Course Curriculum Gross</span>
                  <p className="text-lg font-black text-[#201064] mt-1">₹{reportData.summary.courseRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-indigo-50 border-indigo-100">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Net Combined Gross</span>
                  <p className="text-lg font-black text-indigo-700 mt-1">₹{reportData.summary.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 10: WEBSITE MANAGEMENT ── */}
        {activeMenu === "website_banner" && settings && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Website Page Content settings</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Customize homepage alert banners, announcement notifications, and hero image links.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider border-b border-slate-100 pb-2">Announcements</h3>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Alert Banners (One announcement headline per line)</label>
                  <textarea 
                    rows={4}
                    value={settings.banners.join("\n")}
                    onChange={(e) => setSettings({ ...settings, banners: e.target.value.split("\n") })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                  />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 py-3 px-6 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer">
                  <Save size={14} /> Update Content Blocks
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── SECTION 11: REPORTS ── */}
        {activeMenu === "reports_sales" && reportData && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">Platform Sales & User Reports</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Export student database catalogs, course enrollments history, and inventory sheets.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Download User Activity Registry</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Generates excel sheet containing login sessions, logins IP history, and profile creations.</p>
                </div>
                <button onClick={() => Swal.fire("Report Exported", "Student activity log sheet downloaded.", "success")} className="w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition border border-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer">
                  <FileText size={12} /> Export CSV
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Download Sales Invoices</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Generates combined course registrations and STEM DIY parts orders settlement reports.</p>
                </div>
                <button onClick={() => Swal.fire("Report Exported", "Invoice registry ledger downloaded.", "success")} className="w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition border border-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer">
                  <FileText size={12} /> Export CSV
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Download Product Inventory</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Generates current warehouse stock levels sheet, warning logs, and SKU codes.</p>
                </div>
                <button onClick={() => Swal.fire("Report Exported", "Inventory stock ledger sheet downloaded.", "success")} className="w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition border border-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer">
                  <FileText size={12} /> Export CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 12: GENERAL & SMTP CONFIGS ── */}
        {activeMenu === "settings_general" && settings && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-[#201064] tracking-tight">System Settings & Gateway Configs</h1>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">Customize global site name branding, SMTP email servers relay profiles, and test sandbox toggles.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Site Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider border-b border-slate-100 pb-2">System profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Site Branding Name</label>
                    <input 
                      type="text" 
                      required
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Support Contact Email</label>
                    <input 
                      type="email" 
                      required
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Support Hotline Phone</label>
                    <input 
                      type="text" 
                      required
                      value={settings.contactNumber}
                      onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SMTP Settings */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider border-b border-slate-100 pb-2">SMTP Mail Server Configs</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">SMTP Server Host</label>
                    <input 
                      type="text" 
                      value={settings.emailSettings.smtpHost}
                      onChange={(e) => setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpHost: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">SMTP Server Port</label>
                    <input 
                      type="number" 
                      value={settings.emailSettings.smtpPort}
                      onChange={(e) => setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpPort: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 font-bold">Mail Authentication User</label>
                    <input 
                      type="text" 
                      value={settings.emailSettings.smtpUser}
                      onChange={(e) => setSettings({
                        ...settings,
                        emailSettings: { ...settings.emailSettings, smtpUser: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-[#201064] uppercase tracking-wider border-b border-slate-100 pb-2">Payment Settlement config</h3>
                <div className="flex items-center gap-2 bg-indigo-50/50 p-3.5 border border-indigo-100 rounded-xl w-fit">
                  <input 
                    type="checkbox"
                    id="sandboxSetting"
                    checked={settings.paymentGateway.sandboxMode}
                    onChange={(e) => setSettings({
                      ...settings,
                      paymentGateway: { ...settings.paymentGateway, sandboxMode: e.target.checked }
                    })}
                    className="w-4.5 h-4.5 text-indigo-600 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="sandboxSetting" className="text-xs font-extrabold text-[#201064] select-none cursor-pointer">Enable Payment Sandbox mode (Auto-approve checkout transactions)</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 font-bold">Checkout Public Key</label>
                    <input 
                      type="text" 
                      value={settings.paymentGateway.publicKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        paymentGateway: { ...settings.paymentGateway, publicKey: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 font-bold">Secure Settlement Token</label>
                    <input 
                      type="password" 
                      value={settings.paymentGateway.secretKey}
                      onChange={(e) => setSettings({
                        ...settings,
                        paymentGateway: { ...settings.paymentGateway, secretKey: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 py-3.5 px-8 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer shadow-md">
                <Save size={15} /> Save Platform System Configurations
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default SuperAdminDashboard;
