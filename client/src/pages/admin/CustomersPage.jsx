import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { getAllUsers } from '../../services/common.service'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllUsers({ limit: 50 })
      setCustomers(data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách khách hàng.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Khách hàng</h2>
          <p className="text-sm text-slate-500">Quản lý danh sách khách hàng và lịch sử mua sắm.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchCustomers} title="Làm mới">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-slate-500">Đang tải...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex items-center gap-2 p-4 rounded-md bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchCustomers} className="ml-auto">
            Thử lại
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead className="text-right">Ngày tham gia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                    Chưa có khách hàng nào.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || customer.email)}&background=c0df85&color=fff`}
                          />
                          <AvatarFallback>{(customer.name || customer.email)?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{customer.name || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        customer.role === 'admin'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {customer.role === 'admin' ? 'Admin' : 'Khách hàng'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString('vi-VN')
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
