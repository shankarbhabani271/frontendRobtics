import React, { useEffect, useState } from "react";
import { useAuth, API_BASE_URL } from "../../context/AuthContext";
import Swal from "sweetalert2";
import logo2 from "../../assets/logo2.png";
import { 
  User, BookOpen, ShoppingBag, Lock, Save, Play, ChevronRight, ArrowLeft, Menu 
} from "lucide-react";

interface Lecture {
  _id: string;
  title: string;
  content: string;
  videoUrl: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
}

const UserDashboard: React.FC = () => {
  const { user, updateProfile, authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "courses" | "orders">("courses");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

  // Data States
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  
  // Interactive Course Player State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [loadingLectures, setLoadingLectures] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
      // Filter course items populated on user object
      if (user.purchasedCourses) {
        setMyCourses(user.purchasedCourses as any);
      }
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/content/orders/my`);
      if (res.ok) {
        const data = await res.json();
        setMyOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      Swal.fire("Error", "Please fill in all profile details.", "error");
      return;
    }
    await updateProfile(profileForm.name, profileForm.email);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      Swal.fire("Warning", "Fill in password credentials.", "warning");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      Swal.fire("Warning", "New passwords do not match.", "warning");
      return;
    }
    const success = await updateProfile(profileForm.name, profileForm.email, passwordForm.newPassword);
    if (success) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    }
  };

  // Launch interactive course player
  const handleLaunchCourse = async (course: Course) => {
    setSelectedCourse(course);
    setLoadingLectures(true);
    try {
      // Securely fetch lectures from server. Verification that only purchased courses can access!
      const res = await authFetch(`${API_BASE_URL}/content/courses/${course._id}/lectures`);
      if (res.ok) {
        const data = await res.json();
        setLectures(data);
        if (data.length > 0) {
          setSelectedLecture(data[0]);
        }
      } else {
        Swal.fire("Access Denied", "Could not unlock course modules.", "error");
        setSelectedCourse(null);
      }
    } catch (e) {
      Swal.fire("Error", "Could not connect to player server.", "error");
      setSelectedCourse(null);
    } finally {
      setLoadingLectures(false);
    }
  };

  const handleClosePlayer = () => {
    setSelectedCourse(null);
    setLectures([]);
    setSelectedLecture(null);
  };

  return (
    <div className="min-h-screen bg-slate-55 flex flex-col lg:flex-row relative">
      
      {/* Mobile Top Bar */}
      {!selectedCourse && (
        <div className="lg:hidden bg-white text-slate-800 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-slate-200">
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg transition focus:outline-none cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>
          <img src={logo2} alt="SakRobotix Lab Logo" className="h-8 w-auto object-contain" />
          <div className="w-6 h-6"></div> {/* Spacer to center title */}
        </div>
      )}

      {/* Sidebar Backdrop Overlay for Mobile */}
      {!selectedCourse && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Controls */}
      {!selectedCourse && (
        <aside className={`fixed inset-y-0 left-0 z-50 transform w-72 bg-white text-slate-800 flex flex-col border-r border-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-5 border-b border-slate-100 flex flex-col items-center gap-3">
            <img src={logo2} alt="SakRobotix Lab Logo" className="h-10 w-auto object-contain" />
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#201064] font-extrabold uppercase shadow-inner flex-shrink-0">
                {user?.name.substr(0, 2)}
              </div>
              <div>
                <h2 className="font-extrabold text-[#201064] leading-none text-base">{user?.name}</h2>
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-1 block">Student Portal</span>
              </div>
            </div>
          </div>

          <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
            <button 
              onClick={() => { setActiveTab("courses"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "courses" ? "bg-indigo-50 text-[#201064] shadow-sm border-l-4 border-[#201064]" : "hover:bg-slate-50 text-slate-600"}`}
            >
              <BookOpen size={18} /> My Unlocked Courses
            </button>
            <button 
              onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "orders" ? "bg-indigo-50 text-[#201064] shadow-sm border-l-4 border-[#201064]" : "hover:bg-slate-50 text-slate-600"}`}
            >
              <ShoppingBag size={18} /> Track Orders & History
            </button>
            <button 
              onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left ${activeTab === "profile" ? "bg-indigo-50 text-[#201064] shadow-sm border-l-4 border-[#201064]" : "hover:bg-slate-50 text-slate-600"}`}
            >
              <User size={18} /> Account Profile & Settings
            </button>
          </nav>
        </aside>
      )}

      {/* Main Workspace */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 overflow-y-auto overflow-x-hidden max-w-7xl mx-auto w-full min-w-0">
        
        {/* INTERACTIVE COURSE LECTURE PLAYER VIEW */}
        {selectedCourse ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Header control */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <button 
                onClick={handleClosePlayer}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#201064] transition bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <div className="text-right">
                <span className="text-[10px] bg-indigo-50 text-[#201064] font-extrabold uppercase px-2.5 py-1 rounded-full">Lectures Player</span>
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-[#201064] leading-tight">{selectedCourse.title}</h1>

            {loadingLectures ? (
              <div className="py-20 text-center text-slate-400 font-bold">Unlocking lectures syllabus...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Lectures List */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 font-extrabold text-xs text-[#201064] uppercase tracking-wider">
                    Curriculum Content ({lectures.length} lessons)
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
                    {lectures.map((lec) => (
                      <button 
                        key={lec._id}
                        onClick={() => setSelectedLecture(lec)}
                        className={`w-full text-left p-4 flex items-center justify-between transition hover:bg-slate-50 ${selectedLecture?._id === lec._id ? "bg-indigo-50/50 border-r-4 border-indigo-600" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <Play size={14} className={selectedLecture?._id === lec._id ? "text-indigo-600 fill-indigo-100" : "text-slate-400"} />
                          <span className={`text-xs font-bold ${selectedLecture?._id === lec._id ? "text-indigo-650" : "text-slate-700"}`}>
                            {lec.title}
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-slate-350" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side: Lecture Viewer */}
                <div className="lg:col-span-8 space-y-6">
                  {selectedLecture ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                      <h3 className="text-xl font-extrabold text-slate-800 border-b border-slate-100 pb-3">{selectedLecture.title}</h3>
                      
                      {/* Video Player Mock */}
                      {selectedLecture.videoUrl && (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-md">
                          <iframe 
                            className="w-full h-full"
                            src={selectedLecture.videoUrl} 
                            title={selectedLecture.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      {/* Text Copy Description */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lesson Material</h4>
                        <p className="text-slate-650 text-sm leading-relaxed font-medium">
                          {selectedLecture.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-bold shadow-sm">
                      Select a lecture from the curriculum sidebar to start learning.
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        ) : (
          /* STANDARD PAGES */
          <div className="space-y-8 animate-fadeIn">
            
            {/* TAB: UNLOCKED COURSES */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Unlocked Courses</h1>
                  <p className="text-slate-500 font-medium mt-1">Unlock educational content and hands-on robotics workshops.</p>
                </div>

                {myCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myCourses.map((course) => (
                      <div key={course._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
                        <img 
                          src={course.image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"} 
                          alt="" 
                          className="aspect-video w-full object-cover" 
                        />
                        <div className="p-5 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-extrabold text-slate-800 text-base leading-tight mt-1">{course.title}</h3>
                            <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed font-medium">{course.description}</p>
                          </div>
                          <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-semibold">By: {course.instructor}</span>
                            <button 
                              onClick={() => handleLaunchCourse(course)}
                              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl shadow cursor-pointer active:scale-95 transition"
                            >
                              <Play size={12} fill="white" /> Study Lectures
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <p className="text-slate-400 font-bold">You have not unlocked or purchased any courses yet.</p>
                    <a href="/" className="inline-block px-6 py-2.5 bg-[#201064] text-white text-xs font-bold rounded-xl shadow">
                      Explore Catalog
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TRACK ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Order & Payments History</h1>
                  <p className="text-slate-500 font-medium mt-1">Monitor shipment statuses, review transactions, and track parcels.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold">
                          <th className="py-3 px-4">Transaction ID</th>
                          <th className="py-3 px-4">Items Ordered</th>
                          <th className="py-3 px-4">Shipping Destination</th>
                          <th className="py-3 px-4">Amount Paid</th>
                          <th className="py-3 px-4">Fulfillment Status</th>
                          <th className="py-3 px-4 font-bold">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOrders.map((ord: any) => (
                          <tr key={ord._id} className="border-b border-slate-50 hover:bg-slate-50 text-slate-650 font-medium animate-fadeIn">
                            <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{ord.paymentDetails.transactionId}</td>
                            <td className="py-3.5 px-4">
                              <ul className="list-disc pl-4 space-y-0.5">
                                {ord.items.map((it: any, idx: number) => (
                                  <li key={idx} className="font-bold text-slate-800">
                                    {it.name} <span className="text-slate-450 font-medium text-[10px]">({it.quantity}x)</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="py-3.5 px-4 truncate max-w-[180px] font-medium text-slate-400">{ord.shippingAddress || "Digital Course Access"}</td>
                            <td className="py-3.5 px-4 font-black text-slate-805">₹{ord.totalAmount}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                ord.orderStatus === "delivered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                ord.orderStatus === "shipped" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                ord.orderStatus === "processing" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}>
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-450 font-semibold">{new Date(ord.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {myOrders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-6 text-slate-450 font-bold">You have not placed any orders yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROFILE SETTINGS */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#201064] tracking-tight">Account settings</h1>
                  <p className="text-slate-500 font-medium mt-1">Review contact information details, or update secure log-in password credentials.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Info update */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-extrabold text-[#201064] border-b border-slate-100 pb-2 flex items-center gap-2">
                      <User size={18} className="text-indigo-650" /> Personal Profile
                    </h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-650 block mb-1">Full Name</label>
                        <input 
                          type="text" required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-650 block mb-1">Email Address</label>
                        <input 
                          type="email" required
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <button type="submit" className="flex items-center gap-2 py-3 px-6 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer">
                        <Save size={14} /> Update Info
                      </button>
                    </form>
                  </div>

                  {/* Password update */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-extrabold text-[#201064] border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Lock size={18} className="text-indigo-650" /> Change Security Password
                    </h3>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-650 block mb-1 font-semibold">New Password</label>
                        <input 
                          type="password" required
                          placeholder="••••••••"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-650 block mb-1 font-semibold">Confirm New Password</label>
                        <input 
                          type="password" required
                          placeholder="••••••••"
                          value={passwordForm.confirmNewPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-850"
                        />
                      </div>
                      <button type="submit" className="flex items-center gap-2 py-3 px-6 bg-[#201064] hover:bg-[#321d96] text-xs font-bold text-white rounded-xl cursor-pointer">
                        <Save size={14} /> Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};

export default UserDashboard;
