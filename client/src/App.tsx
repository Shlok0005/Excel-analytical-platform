import React, { useState, useEffect, useRef, createContext, useContext, FC, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, ChartData, type ChartTypeRegistry } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as XLSX from 'xlsx';

// --- Icons ---
const UploadIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const DashboardIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SettingsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UsersIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197" /></svg>;
const ChartIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const AnalyticsIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const FileManagerIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const DeleteIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const MenuIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const GoogleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.222 0-9.641-3.669-11.28-8.584l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.032 35.127 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>;
const AppleIcon: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M15.22 6.095a2.64 2.64 0 0 0-2.31-1.423a2.64 2.64 0 0 0-2.31 1.423c-1.028.02-2.318 1.044-2.318 2.864c0 1.554 1.14 2.228 2.273 2.228c1.028 0 1.5-.724 2.364-.724c.863 0 1.295.724 2.318.724c1.14 0 2.273-.674 2.273-2.228c0-1.82-1.29-2.844-2.318-2.864m-2.738-2.43a.44.44 0 0 1-.437.342a.44.44 0 0 1-.436-.342a1.5 1.5 0 0 1 1.309-1.282a.439.439 0 0 1 .48.512a1.49 1.49 0 0 1-.916.77M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m2.318 16.545c-.772.27-1.545.27-2.318 0c-2.318-.814-3.863-3.4-3.863-6.273c0-3.359 2.045-5.38 4.045-5.38c.924 0 1.834.618 2.5.618s1.614-.664 2.772-.664c2.046 0 4.046 2.067 4.046 5.426c0 2.227-.864 4.886-2.546 6.136c-.863.63-1.818.86-2.636.86c-.727 0-1.409-.224-2.136-.72Z"/></svg>;


// --- Chart.js Setup ---
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// --- API Configuration ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) { config.headers['x-auth-token'] = token; }
  return config;
});

// --- Type Definitions ---
type ExcelRow = Record<string, string | number>;
type CustomChartType = keyof ChartTypeRegistry | '3dbar';

interface SavedChart {
    _id: string;
    title: string;
    chartType: CustomChartType;
    data: ChartData;
    options?: unknown;
    savedAt: string;
}
interface FileType {
    _id: string;
    fileName: string;
    uploadDate: string;
}
interface User { _id: string; name: string; email: string; isAdmin: boolean; }
interface AuthState { token: string | null; isAuthenticated: boolean | null; loading: boolean; user: User | null; }
interface AppState {
    currentData: { data: ExcelRow[], columns: string[] } | null;
    setCurrentData: (data: { data: ExcelRow[], columns:string[] } | null) => void;
}
interface NavigateFunc { (path: string): void; }

// --- Global State Context ---
const AppContext = createContext<AppState | undefined>(undefined);

const AppProvider: FC<{children: ReactNode}> = ({ children }) => {
    const [currentData, setCurrentData] = useState<{ data: ExcelRow[], columns: string[] } | null>(null);
    return <AppContext.Provider value={{ currentData, setCurrentData }}>{children}</AppContext.Provider>;
};
const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};

// --- Authentication Context ---
interface AuthContextType extends AuthState {
    login: (e:string, p:string)=>Promise<void>;
    register: (n:string, e:string, p:string)=>Promise<void>;
    logout: ()=>void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ token: localStorage.getItem('token'), isAuthenticated: null, loading: true, user: null });

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        try {
          const res = await api.get('/auth');
          setAuth({ token: localStorage.token, isAuthenticated: true, loading: false, user: res.data });
        } catch (err) {
          console.error("Failed to load user:", err);
          localStorage.removeItem('token');
          setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
        }
      } else {
        setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const userRes = await api.get('/auth');
    setAuth({ token: res.data.token, isAuthenticated: true, loading: false, user: userRes.data });
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    const userRes = await api.get('/auth');
    setAuth({ token: res.data.token, isAuthenticated: true, loading: false, user: userRes.data });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
  };

  return <AuthContext.Provider value={{ ...auth, login, logout, register }}>{!auth.loading && children}</AuthContext.Provider>;
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

// --- Main App Component ---
export default function App() { return <AuthProvider><AppProvider><Router /></AppProvider></AuthProvider>; }

// --- Router and Layout Components ---
const Router: FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [page, setPage] = useState('landing');

  useEffect(() => {
    if (isAuthenticated) { setPage(user?.isAdmin ? 'admin/dashboard' : 'dashboard'); } 
    else { setPage('landing'); }
  }, [isAuthenticated, user]);

  const navigate: NavigateFunc = (path) => setPage(path);

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (page) {
        case 'login': return <LoginPage navigate={navigate} />;
        case 'register': return <RegisterPage navigate={navigate} />;
        default: return <LandingPage navigate={navigate} />;
      }
    } else {
      return <DashboardLayout navigate={navigate} page={page} />;
    }
  };

  return <div className="bg-slate-900 text-white min-h-screen font-sans antialiased"><AnimatePresence mode="wait">{renderPage()}</AnimatePresence></div>;
};

const LandingPage: FC<{navigate: NavigateFunc}> = ({ navigate }) => (
    <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-grid-slate-800/50">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">Excel Analytics Platform</h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">Turn your spreadsheets into stunning 2D & 3D interactive visualizations. Secure, fast, and insightful.</p>
        <div className="flex space-x-4">
            <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.25)" }} whileTap={{ scale: 0.95 }} onClick={() => navigate('login')} className="px-8 py-3 font-semibold text-white bg-indigo-500 rounded-lg shadow-lg">Get Started</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('register')} className="px-8 py-3 font-semibold text-slate-300 bg-slate-700 rounded-lg">Sign Up</motion.button>
        </div>
    </motion.div>
);

const LoginPage: FC<{navigate: NavigateFunc}> = ({ navigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(email, password); } 
    catch (err: unknown) {
        if (err instanceof AxiosError) {
            setError(err.response?.data?.msg || 'Login failed.');
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
        setLoading(false); 
    }
  };

    const handleOAuthLogin = (provider: 'google' | 'apple') => {
      // In a real app, this would redirect to the backend OAuth endpoint
      // e.g., window.location.href = `${API_URL}/auth/${provider}`;
      alert(`Login with ${provider} is not implemented in this demo.`);
  };

  return (
    <motion.div key="login" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-2xl">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Welcome Back</h1>
            <p className="mt-2 text-slate-400">Sign in to unlock your data's potential.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <motion.button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</motion.button>
        </form>
        <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-600"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-slate-600"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <motion.button onClick={() => handleOAuthLogin('google')} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center justify-center w-full py-3 font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg">
                <GoogleIcon /> <span className="ml-2">Google</span>
            </motion.button>
            <motion.button onClick={() => handleOAuthLogin('apple')} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center justify-center w-full py-3 font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg">
                <AppleIcon /> <span className="ml-2">Apple</span>
            </motion.button>
        </div>

        <p className="text-center text-slate-400">No account? <button onClick={() => navigate('register')} className="font-medium text-blue-400 hover:underline">Create one</button></p>
      </div>
    </motion.div>
  );
};

const RegisterPage: FC<{navigate: NavigateFunc}> = ({ navigate }) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try { await register(name, email, password); } 
        catch (err: unknown) { 
            if (err instanceof AxiosError) {
                setError(err.response?.data?.msg || 'Registration failed.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false); 
        }
    };
    
    const handleOAuthLogin = (provider: 'google' | 'apple') => {
        alert(`Sign up with ${provider} is not implemented in this demo.`);
    };

    return (
        <motion.div key="register" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">Create Account</h1>
                    <p className="mt-2 text-slate-400">Join and start visualizing.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <motion.button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">{loading ? 'Creating Account...' : 'Register'}</motion.button>
                </form>

                 <div className="relative flex items-center">
                    <div className="flex-grow border-t border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-sm">OR SIGN UP WITH</span>
                    <div className="flex-grow border-t border-slate-600"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <motion.button onClick={() => handleOAuthLogin('google')} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center justify-center w-full py-3 font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg">
                        <GoogleIcon /> <span className="ml-2">Google</span>
                    </motion.button>
                    <motion.button onClick={() => handleOAuthLogin('apple')} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className="flex items-center justify-center w-full py-3 font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg">
                        <AppleIcon /> <span className="ml-2">Apple</span>
                    </motion.button>
                </div>

              <p className="text-center text-slate-400">Already have an account? <button onClick={() => navigate('login')} className="font-medium text-green-400 hover:underline">Log In</button></p>
          </div>
      </motion.div>
    );
};

const DashboardLayout: FC<{navigate: NavigateFunc, page: string}> = ({ navigate, page }) => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const renderContent = () => {
        const pageName = user?.isAdmin && page.startsWith('admin/') ? page.split('/')[1] : page;
        switch(pageName) {
            case 'dashboard': return <Dashboard navigate={navigate} />;
            case 'upload': return <UploadPage />;
            case 'charts': return <ChartsPage />;
            case 'analytics': return <AnalyticsPage />;
            case 'fileManager': return <FileManagerPage />;
            case 'users': return <UserManagementPage />;
            case 'settings': return <SettingsPage />;
            default: return <Dashboard navigate={navigate} />;
        }
    }

    return (
        <div className="flex h-screen bg-slate-900">
            <Sidebar navigate={(p) => { navigate(p); setMobileMenuOpen(false); }} page={page} user={user} logout={logout} isMobileMenuOpen={isMobileMenuOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                 <header className="flex justify-between items-center p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 md:hidden">
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}><MenuIcon/></button>
                    <div className="flex items-center space-x-4"><span className="text-sm">{user?.name}</span></div>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>{renderContent()}</motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

const Sidebar: FC<{navigate: NavigateFunc, page: string, user: User | null, logout: ()=>void, isMobileMenuOpen: boolean}> = ({ navigate, page, user, logout, isMobileMenuOpen }) => {
    const navItems = user?.isAdmin
        ? [ { name: 'Dashboard', path: 'admin/dashboard', icon: <DashboardIcon/> }, { name: 'Upload Files', path: 'upload', icon: <UploadIcon/> }, { name: 'Charts', path: 'charts', icon: <ChartIcon/> }, { name: 'Analytics', path: 'analytics', icon: <AnalyticsIcon/> }, { name: 'File Manager', path: 'fileManager', icon: <FileManagerIcon/> }, { name: 'Users', path: 'admin/users', icon: <UsersIcon/> }, { name: 'Settings', path: 'settings', icon: <SettingsIcon/> } ]
        : [ { name: 'Dashboard', path: 'dashboard', icon: <DashboardIcon/> }, { name: 'Upload Files', path: 'upload', icon: <UploadIcon/> }, { name: 'Charts', path: 'charts', icon: <ChartIcon/> }, { name: 'Analytics', path: 'analytics', icon: <AnalyticsIcon/> }, { name: 'File Manager', path: 'fileManager', icon: <FileManagerIcon/> }, { name: 'Settings', path: 'settings', icon: <SettingsIcon/> } ];

    return (
      <div className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-slate-800 p-6 flex-col justify-between shadow-2xl flex transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div>
            <div className="mb-10 flex items-center"><h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Excel Analytics</h2></div>
            <nav><ul>{navItems.map(item => (<li key={item.path} className="mb-2"><button onClick={() => navigate(item.path)} className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${ page === item.path ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700' }`}>{item.icon} <span className="ml-3">{item.name}</span></button></li>))}</ul></nav>
        </div>
        <div><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={logout} className="w-full py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">Logout</motion.button></div>
      </div>
    );
};

const StatCardV2: FC<{title:string, value:string|number, percentage:number, icon:ReactNode, color:string}> = ({ title, value, percentage, icon, color }) => (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
            <div className={`text-sm font-bold ${percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>{percentage >= 0 ? `+${percentage}` : percentage}%</div>
        </div>
        <div className="mt-4"><p className="text-3xl font-bold">{value}</p><p className="text-sm text-slate-400">{title}</p></div>
    </div>
);

const Dashboard: FC<{navigate: NavigateFunc}> = ({ navigate }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ files: 0, storage: '0MB', charts: 0 });
    const [recentFiles, setRecentFiles] = useState<FileType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [filesRes, chartsRes] = await Promise.all([
                    api.get('/files/history'),
                    api.get('/charts')
                ]);
                setStats({ files: filesRes.data.length, storage: '0MB', charts: chartsRes.data.length });
                setRecentFiles(filesRes.data.slice(0, 5));
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 mb-8">Here's what's happening with your data analytics today.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCardV2 title="Total Files" value={stats.files} percentage={12} icon={<FileManagerIcon/>} color="bg-blue-500/20 text-blue-300"/>
                <StatCardV2 title="Charts Saved" value={stats.charts} percentage={8} icon={<ChartIcon/>} color="bg-green-500/20 text-green-300"/>
                <StatCardV2 title="Data Points" value="0" percentage={15} icon={<AnalyticsIcon/>} color="bg-purple-500/20 text-purple-300"/>
                <StatCardV2 title="Storage Used" value={stats.storage} percentage={3} icon={<UploadIcon/>} color="bg-orange-500/20 text-orange-300"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="lg:col-span-3 bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Recent Files</h2><button onClick={() => navigate('fileManager')} className="text-sm text-blue-400 hover:underline">View all</button></div>
                     {recentFiles.length > 0 ? (<ul className="divide-y divide-slate-700">{recentFiles.map(file => (<li key={file._id} className="py-3 flex justify-between items-center"><span className="truncate">{file.fileName}</span><span className="text-sm text-slate-400">{new Date(file.uploadDate).toLocaleDateString()}</span></li>))}</ul>) : ( <p className="text-slate-400 text-center py-8">No files uploaded yet.</p> )}
                </div>
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Recent Charts</h2><button onClick={() => navigate('charts')} className="text-sm text-blue-400 hover:underline">View all</button></div>
                    <p className="text-slate-400 text-center py-8">No charts saved to your account yet.</p>
                </div>
            </div>
             <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => navigate('upload')} className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"><h3 className="font-bold text-blue-400">Upload File</h3><p className="text-sm text-slate-400">Add new Excel file</p></button>
                    <button onClick={() => navigate('upload')} className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"><h3 className="font-bold text-green-400">Create Chart</h3><p className="text-sm text-slate-400">Visualize your data</p></button>
                    <button onClick={() => navigate('analytics')} className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"><h3 className="font-bold text-purple-400">View Analytics</h3><p className="text-sm text-slate-400">Data insights</p></button>
                </div>
            </div>
        </div>
    );
};

const UploadPage: FC = () => {
    const { setCurrentData } = useAppContext();
    const [file, setFile] = useState<File | null>(null);
    const [excelData, setExcelData] = useState<ExcelRow[] | null>(null);
    const [columns, setColumns] = useState<string[]>([]);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [chartType, setChartType] = useState<CustomChartType>('bar');
    const [chartTitle, setChartTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setUploadSuccess('');
            setError('');
            setExcelData(null);
            setCurrentData(null);
        }
    };

    const handleUpload = async () => {
        if (!file) { setError('Please select a file first.'); return; }
        setLoading(true);
        setError('');
        setUploadSuccess('');
        const formData = new FormData();
        formData.append('excelFile', file);

        try {
            const res = await api.post<{fileName: string}>('/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setUploadSuccess(`File '${res.data.fileName}' uploaded! Now parsing...`);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
                    
                    setExcelData(jsonData);
                    setCurrentData({data: jsonData, columns: Object.keys(jsonData[0] || {})});
                    if (jsonData.length > 0) {
                        const fileColumns = Object.keys(jsonData[0]);
                        setColumns(fileColumns);
                        setXAxis(fileColumns[0]);
                        setYAxis(fileColumns.length > 1 ? fileColumns[1] : fileColumns[0]);
                        setChartTitle(`${fileColumns.length > 1 ? fileColumns[1] : fileColumns[0]} by ${fileColumns[0]}`);
                    }
                } catch (err: unknown) {
                    console.error("Error parsing Excel file:", err);
                    setError("Failed to parse the Excel file.");
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (err: unknown) { 
            if (err instanceof AxiosError) {
                setError(err.response?.data?.msg || 'File upload failed.');
            } else {
                setError('An unexpected error occurred.');
            }
        } 
        finally { setLoading(false); }
    };

    const handleSaveChart = async () => {
        const chartConfig = { title: chartTitle, chartType: chartType, data: chartData };
        try {
            await api.post('/charts', chartConfig);
            alert('Chart saved! View it on the Charts page.');
        } catch(err: unknown) {
            console.error(err);
            alert('Failed to save chart.');
        }
    };
    
    const chartData: ChartData = {
        labels: excelData ? excelData.map(row => String(row[xAxis])) : [],
        datasets: [{ label: yAxis, data: excelData ? excelData.map(row => parseFloat(String(row[yAxis]))).filter(v => !isNaN(v)) : [], backgroundColor: 'rgba(59, 130, 246, 0.6)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 }],
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Upload & Analyze</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-blue-400">1. Select File</h2>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-300 hover:file:bg-blue-500/20" />
                        <button onClick={handleUpload} disabled={loading || !file} className="mt-4 w-full py-2 font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-50">{loading ? 'Processing...' : 'Upload & Read Data'}</button>
                        {error && <p className="text-red-400 mt-2">{error}</p>}
                        {uploadSuccess && <p className="text-green-400 mt-2">{uploadSuccess}</p>}
                    </div>

                    {excelData && (
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg mt-8">
                        <h2 className="text-xl font-semibold mb-4 text-blue-400">2. Configure Chart</h2>
                         <div className="space-y-4">
                            <div><label className="block mb-2 text-sm font-medium text-slate-300">Chart Title</label><input type="text" value={chartTitle} onChange={e => setChartTitle(e.target.value)} className="w-full p-2 bg-slate-700 rounded-md"/></div>
                            <div><label className="block mb-2 text-sm font-medium text-slate-300">X-Axis (Labels)</label><select value={xAxis} onChange={e => setXAxis(e.target.value)} className="w-full p-2 bg-slate-700 rounded-md">{columns.map(col => <option key={col} value={col}>{col}</option>)}</select></div>
                            <div><label className="block mb-2 text-sm font-medium text-slate-300">Y-Axis (Values)</label><select value={yAxis} onChange={e => setYAxis(e.target.value)} className="w-full p-2 bg-slate-700 rounded-md">{columns.map(col => <option key={col} value={col}>{col}</option>)}</select></div>
                            <div><label className="block mb-2 text-sm font-medium text-slate-300">Chart Type</label><select value={chartType} onChange={e => setChartType(e.target.value as CustomChartType)} className="w-full p-2 bg-slate-700 rounded-md"><option value="bar">Bar Chart</option> <option value="line">Line Chart</option> <option value="pie">Pie Chart</option> <option value="doughnut">Doughnut Chart</option> <option value="3dbar">3D Bar Chart</option></select></div>
                        </div>
                        <button onClick={handleSaveChart} className="mt-4 w-full py-2 font-semibold text-white bg-green-600 rounded-lg">Save Chart</button>
                    </div>
                    )}
                </div>
                
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold text-blue-400">3. Visualization</h2></div>
                    <div className="bg-slate-900 p-4 rounded-lg h-96">
                        {excelData ? (
                            <>
                                {chartType === 'bar' && <Bar data={chartData as ChartData<'bar'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }} />}
                                {chartType === 'line' && <Line data={chartData as ChartData<'line'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }} />}
                                {chartType === 'pie' && <Pie data={chartData as ChartData<'pie'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />}
                                {chartType === 'doughnut' && <Doughnut data={chartData as ChartData<'doughnut'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />}
                                {chartType === '3dbar' && <ThreeDChart data={chartData} />}
                            </>
                        ) : (<div className="flex items-center justify-center h-full text-slate-500">Upload a file to generate a chart.</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChartsPage: FC = () => {
    const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharts = async () => {
            try {
                const res = await api.get('/charts');
                setSavedCharts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCharts();
    }, []);

    if (loading) return <div>Loading charts...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Saved Charts</h1>
            {savedCharts.length === 0 ? (<p className="text-slate-400">You haven't saved any charts yet. Go to the 'Upload' page to create and save one.</p>) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {savedCharts.map(chart => (
                        <div key={chart._id} className="bg-slate-800 p-6 rounded-xl">
                            <h3 className="font-semibold mb-4">{chart.title}</h3>
                            <div className="h-64 bg-slate-900 p-2 rounded-lg">
                                {chart.chartType === 'bar' && <Bar data={chart.data as ChartData<'bar'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }} />}
                                {chart.chartType === 'line' && <Line data={chart.data as ChartData<'line'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } }, scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } } }} />}
                                {chart.chartType === 'pie' && <Pie data={chart.data as ChartData<'pie'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />}
                                {chart.chartType === 'doughnut' && <Doughnut data={chart.data as ChartData<'doughnut'>} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: 'white' } } } }} />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AnalyticsPage: FC = () => {
    const { currentData } = useAppContext();
    const [column, setColumn] = useState('');
    const [stats, setStats] = useState<Record<string, number | string> | null>(null);

    useEffect(() => {
        if (currentData && currentData.columns.length > 0) {
            setColumn(currentData.columns[0]);
        }
    }, [currentData]);

    useEffect(() => {
        if (currentData && column) {
            const numericData = currentData.data.map(row => parseFloat(row[column] as string)).filter(v => !isNaN(v));
            if (numericData.length > 0) {
                const sum = numericData.reduce((a, b) => a + b, 0);
                const mean = sum / numericData.length;
                const sorted = [...numericData].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
                setStats({
                    count: numericData.length,
                    sum: sum.toFixed(2),
                    mean: mean.toFixed(2),
                    median: median.toFixed(2),
                    min: Math.min(...numericData),
                    max: Math.max(...numericData)
                });
            } else {
                setStats(null);
            }
        }
    }, [currentData, column]);

    if (!currentData) {
        return <p className="text-slate-400">Please upload a file on the 'Upload & Analyze' page to generate analytics.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Data Analytics</h1>
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-slate-300">Select Column for Analysis</label>
                    <select value={column} onChange={e => setColumn(e.target.value)} className="w-full md:w-1/3 p-2 bg-slate-700 rounded-md">
                        {currentData.columns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                </div>
                {stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">Count</p><p className="text-2xl font-bold">{stats.count}</p></div>
                        <div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">Sum</p><p className="text-2xl font-bold">{stats.sum}</p></div>
                        <div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">Mean</p><p className="text-2xl font-bold">{stats.mean}</p></div>
                        <div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">Median</p><p className="text-2xl font-bold">{stats.median}</p></div>
                        <div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">Min</p><p className="text-2xl font-bold">{stats.min}</p></div>
                        <div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">Max</p><p className="text-2xl font-bold">{stats.max}</p></div>
                    </div>
                ) : (
                    <p className="text-yellow-400">The selected column does not contain numeric data for analysis.</p>
                )}
            </div>
        </div>
    );
};

const FileManagerPage: FC = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = async () => {
        try { const res = await api.get('/files/history'); setFiles(res.data); } 
        catch (err: unknown) { console.error(err); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchFiles(); }, []);

    const handleDelete = async (fileId: string) => {
        if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
            try {
                await api.delete(`/files/${fileId}`);
                fetchFiles(); // Refresh the list
            } catch (err) {
                console.error(err);
                alert("Failed to delete file.");
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading files...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">File Manager</h1>
            <div className="bg-slate-800 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700">
                        <tr>
                            <th className="p-4">File Name</th>
                            <th className="p-4">Upload Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.length === 0 ? (<tr><td colSpan={3} className="text-center p-8 text-slate-400">No files found.</td></tr>) : (
                            files.map(file => (
                                <tr key={file._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-4">{file.fileName}</td>
                                    <td className="p-4">{new Date(file.uploadDate).toLocaleString()}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete(file._id)} className="text-red-400 hover:text-red-300 p-2 rounded-full"><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UserManagementPage: FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);
    return (
         <div>
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
            <div className="bg-slate-800 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700">
                        <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Admin Status</th></tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-slate-700">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SettingsPage: FC = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg max-w-md">
                <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                <div className="space-y-4">
                    <div><label className="text-sm text-slate-400">Name</label><input type="text" defaultValue={user?.name} disabled className="w-full p-2 bg-slate-700 rounded-md mt-1" /></div>
                    <div><label className="text-sm text-slate-400">Email</label><input type="email" defaultValue={user?.email} disabled className="w-full p-2 bg-slate-700 rounded-md mt-1" /></div>
                    <div><label className="text-sm text-slate-400">Change Password</label><input type="password" placeholder="New Password" className="w-full p-2 bg-slate-700 rounded-md mt-1" /></div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


const ThreeDChart: FC<{data: ChartData}> = ({ data }) => {
    const mountRef = useRef<HTMLDivElement>(null);
 
    useEffect(() => {
      let cleanup = () => {};
      const init = () => {
        const currentMount = mountRef.current;
        if (!currentMount) return;
        try {
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x0f172a);
          const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
          camera.position.set(0, 5, 10);
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
          currentMount.innerHTML = '';
          currentMount.appendChild(renderer.domElement);
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
          scene.add(ambientLight);
          const pointLight = new THREE.PointLight(0xffffff, 0.8);
          pointLight.position.set(5, 10, 5);
          scene.add(pointLight);
          const barData = data.datasets[0].data.filter((d): d is number => typeof d === 'number' && isFinite(d));
          if (barData.length === 0) return;
          const maxValue = Math.max(...barData, 1); // Avoid division by zero
          const barWidth = 0.8;
          const barSpacing = 1.2;
 
          barData.forEach((value, index) => {
            const height = (value / maxValue) * 5 || 0.1;
            const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
            const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(`hsl(${(index / barData.length) * 360}, 100%, 50%)`), metalness: 0.3, roughness: 0.6 });
            const bar = new THREE.Mesh(geometry, material);
            bar.position.set(index * barSpacing - (barData.length * barSpacing) / 2, height / 2, 0);
            scene.add(bar);
          });
 
          let animationFrameId: number;
          const animate = () => { animationFrameId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
          animate();
 
          const handleResize = () => { if (currentMount && renderer) { camera.aspect = currentMount.clientWidth / currentMount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(currentMount.clientWidth, currentMount.clientHeight); } };
          window.addEventListener('resize', handleResize);
 
          cleanup = () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId); if (renderer && currentMount && renderer.domElement) { try { currentMount.removeChild(renderer.domElement); } catch (err: unknown) { console.error("Error removing renderer dom element:", err); } } };
        } catch (error: unknown) { console.error("Failed to load Three.js modules:", error); if (currentMount) { currentMount.innerHTML = '<div class="flex items-center justify-center h-full text-red-400">Error loading 3D chart.</div>'; } }
      };
      init();
      return () => cleanup();
    }, [data]);
 
    return <div ref={mountRef} className="w-full h-full"></div>;
};

