import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Cài đặt</h2>
        <p className="text-sm text-slate-500">Quản lý thông tin cửa hàng của bạn.</p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Thông tin công khai</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Tên cửa hàng</Label>
              <Input id="shopName" defaultValue="ShurimaShop" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopEmail">Email liên hệ</Label>
              <Input id="shopEmail" type="email" defaultValue="contact@shurimashop.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopPhone">Số điện thoại</Label>
              <Input id="shopPhone" defaultValue="0123456789" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopAddress">Địa chỉ</Label>
              <Input id="shopAddress" defaultValue="Quận 1, TP Hồ Chí Minh" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg border-b pb-2">Giao diện</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Hero</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex justify-center flex-col items-center text-sm text-muted-foreground bg-muted/30">
                <p>Kéo thả hoặc click để thay đổi ảnh</p>
                <Button variant="outline" size="sm" className="mt-4">Tải ảnh lên</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  )
}
