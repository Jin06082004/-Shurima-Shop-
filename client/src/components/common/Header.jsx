import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, LogIn, LayoutDashboard, LogOut, Package } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
    } else {
      navigate('/products')
    }
  }

  const totalItems = cart?.totalItems || 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight text-primary">
              ShurimaShop
            </span>
          </Link>
          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/products" className="transition-colors hover:text-primary">
              Tất cả
            </Link>
            <Link to="/products?category=nam" className="transition-colors hover:text-primary">
              Nam
            </Link>
            <Link to="/products?category=nu" className="transition-colors hover:text-primary">
              Nữ
            </Link>
            <Link to="/products?category=giay" className="transition-colors hover:text-primary">
              Giày
            </Link>
            <Link to="/products?category=phu-kien" className="transition-colors hover:text-primary">
              Phụ kiện
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-64 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-8 bg-muted/50 border-none rounded-full h-9"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </form>

          {/* Icons & CTA */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Button>

            {/* Profile / Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground outline-none"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=c0df85&color=fff&size=32`}
                    alt="Profile"
                    className="h-7 w-7 rounded-full"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.name || 'Người dùng'}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer py-2">
                    <User className="mr-2 h-4 w-4" />
                    Tài khoản của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer py-2">
                    <Package className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="cursor-pointer py-2 text-primary focus:text-primary focus:bg-primary/10">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Trang Quản Trị (Admin)
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { localStorage.clear(); window.location.href = '/' }} className="cursor-pointer py-2 text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}

            <Button
              size="sm"
              className="hidden sm:inline-flex rounded-full bg-primary text-primary-foreground hover:bg-primary/90 ml-2"
              onClick={() => navigate('/products')}
            >
              Sale 🔥
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
