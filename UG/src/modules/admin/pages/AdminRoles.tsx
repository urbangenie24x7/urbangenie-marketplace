import { useState, useEffect } from "react";
import { Shield, Users, Edit, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { userRoles } from '@/utils/seedUsers';

interface DashboardUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  permissions: string[];
  dashboardAccess: string[];
  isActive: boolean;
}

const AdminRoles = () => {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{isOpen: boolean, user: DashboardUser | null}>({isOpen: false, user: null});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'dashboard_users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DashboardUser[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: DashboardUser) => {
    setEditModal({isOpen: true, user});
  };

  const handleUpdateUser = async (updatedUser: DashboardUser) => {
    try {
      await setDoc(doc(db, 'dashboard_users', updatedUser.id), updatedUser);
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setEditModal({isOpen: false, user: null});
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user role');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-blue-100 text-blue-700", 
      vendor: "bg-green-100 text-green-700",
      customer: "bg-gray-100 text-gray-700"
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Roles & Permissions</h1>
        <p className="text-gray-600">Manage user roles and dashboard access permissions (Firebase data)</p>
      </div>

      {/* Role Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(userRoles).map(([key, role]) => (
          <Card key={key} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold capitalize">{key}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{role.name}</p>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Permissions:</div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map(perm => (
                  <Badge key={perm} variant="secondary" className="text-xs">{perm}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Dashboard Users</h3>
          <p className="text-sm text-gray-600">Users stored in Firestore 'dashboard_users' collection</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">User</th>
                <th className="text-left p-4 font-semibold text-gray-900">Role</th>
                <th className="text-left p-4 font-semibold text-gray-900">Permissions</th>
                <th className="text-left p-4 font-semibold text-gray-900">Dashboard Access</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map(perm => (
                        <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.dashboardAccess.map(dashboard => (
                        <Badge key={dashboard} className="text-xs bg-purple-100 text-purple-700">
                          {dashboard}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            Loading users...
          </div>
        )}
        
        {!loading && users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No dashboard users found in Firestore.</p>
            <p className="text-sm mt-2">Users will appear here after they are added to the 'dashboard_users' collection.</p>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={() => setEditModal({isOpen: false, user: null})}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          {editModal.user && (
            <EditUserForm 
              user={editModal.user} 
              onSave={handleUpdateUser}
              onCancel={() => setEditModal({isOpen: false, user: null})}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EditUserFormProps {
  user: DashboardUser;
  onSave: (user: DashboardUser) => void;
  onCancel: () => void;
}

const EditUserForm = ({ user, onSave, onCancel }: EditUserFormProps) => {
  const [formData, setFormData] = useState({
    role: user.role,
    permissions: user.permissions,
    dashboardAccess: user.dashboardAccess,
    isActive: user.isActive
  });

  const allPermissions = ["all", "orders", "vendors", "customers", "services", "profile", "earnings", "bookings"];
  const allDashboards = ["admin", "vendor", "customer"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const toggleDashboard = (dashboard: string) => {
    setFormData(prev => ({
      ...prev,
      dashboardAccess: prev.dashboardAccess.includes(dashboard)
        ? prev.dashboardAccess.filter(d => d !== dashboard)
        : [...prev.dashboardAccess, dashboard]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Role</label>
        <select 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full mt-1 p-2 border rounded-md"
        >
          {Object.keys(userRoles).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Permissions</label>
        <div className="space-y-2">
          {allPermissions.map(permission => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.permissions.includes(permission)}
                onCheckedChange={() => togglePermission(permission)}
              />
              <label className="text-sm">{permission}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Dashboard Access</label>
        <div className="space-y-2">
          {allDashboards.map(dashboard => (
            <div key={dashboard} className="flex items-center space-x-2">
              <Checkbox 
                checked={formData.dashboardAccess.includes(dashboard)}
                onCheckedChange={() => toggleDashboard(dashboard)}
              />
              <label className="text-sm">{dashboard}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({...formData, isActive: !!checked})}
        />
        <label className="text-sm">Active User</label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};

export default AdminRoles;