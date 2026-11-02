
import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  useNavigate
} from 'react-router-dom';

import {
  Crown,
  BedDouble,
  Utensils,
  Headset,
  BriefcaseBusiness,
  Plus,
  ClipboardList,
  ChartNoAxesCombined,
  LogOut,
  UserRound,
  Menu,
  X
} from 'lucide-react';

import RoomList from './components/RoomList.jsx';
import AddRoom from './components/AddRoom.jsx';
import BookingList from './components/BookingList.jsx';
import Login from './components/Login.jsx';
import DashboardAnalytics from './components/DashboardAnalytics.jsx';
import RestaurantMenu from './components/RestaurantMenu.jsx';
import GuestHelpdesk from './components/GuestHelpdesk.jsx';
import MyBookings from './components/MyBookings.jsx';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setMenuOpen(false);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setMenuOpen(false);

    navigate('/login');
  };

  const handleRoomAdded = () => {
    setRefreshKey((prev) => prev + 1);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <div className="royal-app">

      {/* Premium Resort Navbar */}
      <header className="site-header">

        <div className="header-inner">

          {/* Resort Logo */}
          <Link to="/" className="brand" onClick={closeMenu}>

            <div className="brand-icon">
              <Crown size={25} strokeWidth={1.5} />
            </div>

            <div className="brand-text">
              <span className="brand-name">
                THE ROYAL HAVEN
              </span>

              <span className="brand-subtitle">
                LUXURY RESORT
              </span>
            </div>

          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation */}
          <nav className={`main-navigation ${menuOpen ? 'menu-open' : ''}`}>

            <NavLink to="/" end className={navClass} onClick={closeMenu}>
              <BedDouble size={17} />
              <span>Rooms</span>
            </NavLink>

            <NavLink
              to="/restaurant"
              className={navClass}
              onClick={closeMenu}
            >
              <Utensils size={17} />
              <span>Restaurant</span>
            </NavLink>

            <NavLink
              to="/help"
              className={navClass}
              onClick={closeMenu}
            >
              <Headset size={17} />
              <span>Guest Support</span>
            </NavLink>

            {/* Guest Navigation */}
            {user && user.role === 'Guest' && (
              <NavLink
                to="/my-bookings"
                className={navClass}
                onClick={closeMenu}
              >
                <BriefcaseBusiness size={17} />
                <span>My Bookings</span>
              </NavLink>
            )}

            {/* Admin and Staff Navigation */}
            {user && (user.role === 'Admin' || user.role === 'Staff') && (
              <>
                <NavLink
                  to="/add-room"
                  className={navClass}
                  onClick={closeMenu}
                >
                  <Plus size={17} />
                  <span>Add Room</span>
                </NavLink>

                <NavLink
                  to="/bookings"
                  className={navClass}
                  onClick={closeMenu}
                >
                  <ClipboardList size={17} />
                  <span>Bookings</span>
                </NavLink>

                <NavLink
                  to="/analytics"
                  className={navClass}
                  onClick={closeMenu}
                >
                  <ChartNoAxesCombined size={17} />
                  <span>Analytics</span>
                </NavLink>
              </>
            )}

            {/* User Account */}
            <div className="header-account">

              {user ? (
                <>
                  <div className="user-profile">
                    <div className="user-avatar">
                      <UserRound size={17} />
                    </div>

                    <div className="user-details">
                      <span className="user-name">
                        {user.name}
                      </span>

                      <span className="user-role">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="login-button"
                  onClick={closeMenu}
                >
                  <UserRound size={17} />
                  <span>Login / Sign Up</span>
                </Link>
              )}

            </div>

          </nav>

        </div>
      </header>

      {/* Application Content */}
      <main className="page-content">

        <Routes>

          <Route
            path="/"
            element={<RoomList key={refreshKey} />}
          />

          <Route
            path="/restaurant"
            element={<RestaurantMenu />}
          />

          <Route
            path="/help"
            element={<GuestHelpdesk />}
          />

          <Route
            path="/my-bookings"
            element={
              user ? <MyBookings /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={
              user
                ? <Navigate to="/" />
                : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />

          <Route
            path="/add-room"
            element={
              user && (user.role === 'Admin' || user.role === 'Staff')
                ? <AddRoom onRoomAdded={handleRoomAdded} />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/bookings"
            element={
              user && (user.role === 'Admin' || user.role === 'Staff')
                ? <BookingList />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/analytics"
            element={
              user && (user.role === 'Admin' || user.role === 'Staff')
                ? <DashboardAnalytics />
                : <Navigate to="/login" />
            }
          />

        </Routes>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-brand">
          <Crown size={17} />
          <span>THE ROYAL HAVEN RESORT</span>
        </div>

        <p>
          Experience luxury. Discover tranquility.
        </p>

        <span className="footer-copyright">
          © {new Date().getFullYear()} The Royal Haven Resort.
          All rights reserved.
        </span>
      </footer>

    </div>
  );
}

export default App;
