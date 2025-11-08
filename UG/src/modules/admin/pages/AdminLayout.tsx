import { Outlet } from "react-router-dom";
import AdminSidebar from "@/modules/admin/components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;