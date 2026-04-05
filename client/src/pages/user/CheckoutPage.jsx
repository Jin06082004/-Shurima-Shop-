import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Phone, User, ShoppingBag, AlertCircle,
  CheckCircle, CreditCard, ChevronRight, Truck
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../lib/apiClient'
import { checkDiscountByCode, applyDiscountToOrder } from '../../services/discount.service'

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&q=70'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, totalPrice, fetchCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    note: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [discountPreview, setDiscountPreview] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
        <Button onClick={() => navigate('/login')} className="mt-4">Đăng nhập</Button>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-14 w-14 mx-auto text-muted mb-4" />
        <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-6">Thêm sản phẩm vào giỏ trước khi thanh toán.</p>
        <Button onClick={() => navigate('/products')}>Mua sắm ngay</Button>
      </div>
    )
  }

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })

  const handleApplyDiscount = async () => {
    setError(null)
    if (!discountCode.trim()) {
      setError('Vui lòng nhập mã giảm giá.')
      return
    }

    try {
      setIsApplyingDiscount(true)
      const res = await checkDiscountByCode(discountCode.trim(), totalPrice)
      setDiscountPreview(res.data)
    } catch (err) {
      setDiscountPreview(null)
      setError(err.response?.data?.message || 'Mã giảm giá không hợp lệ.')
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.address.trim() || !form.phone.trim()) {
      setError('Vui lòng điền đầy đủ địa chỉ và số điện thoại.')
      return
    }

    setIsLoading(true)
    try {
      const fullAddress = `${form.address}, ${form.city}`.trim().replace(/,$/, '')
      const orderRes = await apiClient.post('/orders', {
        address: fullAddress,
        status: 'pending',
      })

      const orderId = orderRes.data?.data?._id
      if (!orderId) {
        throw new Error('Không thể tạo đơn hàng')
      }

      // Tạo order items tuần tự để dừng ngay khi gặp lỗi stock/validation.
      for (const item of items) {
        await apiClient.post('/order-items', {
          order: orderId,
          product: typeof item.product === 'object' ? item.product?._id : item.product,
          variant: item.variant ? (typeof item.variant === 'object' ? item.variant?._id : item.variant) : null,
          quantity: item.quantity,
        })
      }

      if (discountPreview?.discount?.code) {
        await applyDiscountToOrder(orderId, discountPreview.discount.code)
      }

      // COD-only payment flow
      await apiClient.post('/payments', {
        orderId,
        method: 'cod',
      })

      await Promise.all(items.map((item) => apiClient.delete(`/cart-items/${item._id}`)))
      await fetchCart()

      setSuccess(true)
    } catch (err) {
      if (err.response?.status === 400) {
        await fetchCart()
      }
      setError(err.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-5 max-w-md px-4">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold">Đặt hàng thành công! 🎉</h2>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã mua sắm tại ShurimaShop! Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => navigate('/orders')} className="rounded-full px-8">
              Xem đơn hàng
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-full px-8">
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const shippingFee = 0
  const discountAmount = Number(discountPreview?.discountAmount || 0)
  const finalTotal = Math.max(0, totalPrice + shippingFee - discountAmount)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Shipping Info + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Thông tin giao hàng
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={handleChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0901234567"
                      value={form.phone}
                      onChange={handleChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Số nhà, tên đường, phường/xã..."
                      value={form.address}
                      onChange={handleChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Tỉnh / Thành phố *</Label>
                  <Input
                    id="city"
                    placeholder="TP. Hồ Chí Minh"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                  <Input
                    id="note"
                    placeholder="Ghi chú cho người giao hàng..."
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Phương thức thanh toán
              </h2>
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5">
                <span className="text-2xl">💵</span>
                <span className="font-medium text-sm">Thanh toán khi nhận hàng (COD)</span>
                <div className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Hệ thống hiện chỉ hỗ trợ hình thức thanh toán COD.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
              <h2 className="text-lg font-bold">Mã giảm giá</h2>
              <div className="flex gap-2">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã giảm giá (VD: SALE10)"
                />
                <Button type="button" variant="outline" onClick={handleApplyDiscount} disabled={isApplyingDiscount}>
                  {isApplyingDiscount ? 'Đang áp...' : 'Áp dụng'}
                </Button>
              </div>
              {discountPreview && (
                <p className="text-sm text-green-600">
                  Đã áp dụng mã {discountPreview.discount?.code}: giảm {Number(discountPreview.discountAmount || 0).toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-5">
              <h2 className="text-lg font-bold">Đơn hàng ({items.length} sản phẩm)</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => {
                  const product = item.product || {}
                  const price = product.price || 0
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={product.image || PLACEHOLDER_IMG}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 leading-snug">{product.name || '—'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold flex-shrink-0">
                        {(price * (item.quantity || 1)).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Giảm giá</span>
                  <span className="text-green-600 font-medium">- {discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-xl">{finalTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-13 rounded-xl text-base bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đặt hàng...' : (
                  <span className="flex items-center gap-2">
                    Đặt hàng ngay <ChevronRight className="h-5 w-5" />
                  </span>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Bằng cách đặt hàng, bạn đồng ý với{' '}
                <span className="text-primary cursor-pointer hover:underline">Điều khoản dịch vụ</span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
