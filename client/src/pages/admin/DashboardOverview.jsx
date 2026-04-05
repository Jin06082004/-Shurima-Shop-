import { useState, useEffect } from 'react'
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { getAllOrders } from '../../services/order.service'
import { getAllProducts } from '../../services/product.service'

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { title: 'Doanh thu', value: '...', icon: DollarSign, trend: '', isUp: true },
    { title: 'Số đơn hàng', value: '...', icon: ShoppingBag, trend: '', isUp: true },
    { title: 'Tổng sản phẩm', value: '...', icon: TrendingUp, trend: '', isUp: true },
    { title: 'User mới', value: '+3', icon: Users, trend: 'Đang cập nhật', isUp: true },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          getAllOrders().catch(() => ({ data: [] })),
          getAllProducts({ limit: 1000 }).catch(() => ({ data: [] }))
        ])

        const orders = ordersRes.data || []
        const products = productsRes.data || []

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

        setStats([
          { title: 'Tổng Doanh thu', value: `${totalRevenue.toLocaleString('vi-VN')}đ`, icon: DollarSign, trend: 'Tất cả thời gian', isUp: true },
          { title: 'Số đơn hàng', value: orders.length.toString(), icon: ShoppingBag, trend: 'Tất cả đơn hàng', isUp: true },
          { title: 'Tổng sản phẩm', value: products.length.toString(), icon: TrendingUp, trend: 'Đang mở bán', isUp: true },
          { title: 'User mới', value: '+35', icon: Users, trend: 'Theo tháng', isUp: true },
        ])
      } catch (err) {
        console.error('Error fetching stats', err)
      }
    }
    fetchData()
  }, [])

  const revenueData = [
    { name: 'T2', total: 4000000 },
    { name: 'T3', total: 5500000 },
    { name: 'T4', total: 3200000 },
    { name: 'T5', total: 6800000 },
    { name: 'T6', total: 8500000 },
    { name: 'T7', total: 11000000 },
    { name: 'CN', total: 12500000 },
  ]

  const topProductsData = [
    { name: 'Áo thun tay lỡ', views: 400, sales: 240 },
    { name: 'Quần jean ống rộng', views: 300, sales: 139 },
    { name: 'Túi xách da nữ', views: 200, sales: 980 },
    { name: 'Giày sneaker', views: 278, sales: 390 },
    { name: 'Kính mát uv', views: 189, sales: 480 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Tổng quan</h2>
        <p className="text-slate-500 mt-1">Theo dõi hoạt động kinh doanh của cửa hàng.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-none shadow-sm hover:shadow transition-shadow group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <p className={`text-xs mt-1 font-medium ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend} so với hôm qua
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-slate-700">Biểu đồ doanh thu (Tuần)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip cursor={{full: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="total" stroke="#c0df85" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-slate-700">Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-h-[300px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="sales" fill="#c0df85" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
