import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Shield, User, LogOut, Menu, X, Zap, Library, Sparkles } from 'lucide-react';
import NavbarSvgIcon from '../assets/navbar-icon.svg';


export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img src={NavbarSvgIcon} alt="ClashTor AI Logo" className="h-8 w-8" />
              <div className="absolute inset-0 blur-xl bg-blue-500/20 group-hover:bg-blue-500/40 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              ClashTor AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/analyzer" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Analizör
            </Link>
            <Link to="/decks" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium flex items-center gap-2">
              <Library className="h-4 w-4" />
              Desteler
            </Link>
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300">
                    <Avatar>
                      <AvatarImage src={user.profile_picture_url} alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.username}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  {!user.is_premium && (
                    <DropdownMenuItem onClick={() => navigate('/premium')}>
                      <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Premium'a Yükselt</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate('/login')} className="hover:text-blue-600">
                  Giriş Yap
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20">
                  Kayıt Ol
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            <Link to="/analyzer" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>
              Analizör
            </Link>
            <Link to="/decks" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>
              Desteler
            </Link>
            {user ? (
              <>
                <Link to={`/profile/${user.username}`} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setMobileMenuOpen(false)}>
                  Profil
                </Link>
                {!user.is_premium && (
                  <Link to="/premium" className="block py-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700" onClick={() => setMobileMenuOpen(false)}>
                    Premium'a Yükselt
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full">
                  Giriş Yap
                </Button>
                <Button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">
                  Kayıt Ol
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
