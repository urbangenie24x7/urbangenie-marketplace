import { useState, useEffect } from "react";
import { Search, Eye, Trash2, UserCheck, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  disabled: boolean;
  creationTime: string;
  lastSignInTime: string | null;
  providerData: any[];
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState<{isOpen: boolean, user: AuthUser | null}>({isOpen: false, user: null});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: Firebase Admin SDK is required to list all users
      // For now, we'll show current user info only
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData: AuthUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            disabled: false,
            creationTime: user.metadata.creationTime || '',
            lastSignInTime: user.metadata.lastSignInTime || null,
            providerData: user.providerData
          };
          setUsers([userData]);
        } else {
          setUsers([]);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleViewUser = (user: AuthUser) => {
    setViewModal({isOpen: true, user});
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // Note: Requires Firebase Admin SDK
      toast.info('User deletion requires Firebase Admin SDK');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleUser = async (uid: string, disabled: boolean) => {
    try {
      // Note: Requires Firebase Admin SDK
      toast.info(`User ${disabled ? 'enable' : 'disable'} requires Firebase Admin SDK`);
    } catch (error) {
      console.error('Error toggling user:', error);
      toast.error('Failed to update user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Users</h1>
        <p className="text-gray-600">Manage Firebase Authentication users (requires Firebase Admin SDK to list all users)</p>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by email, name, or UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">UID</th>
                <th className="text-left p-4 font-semibold text-gray-900">Email</th>
                <th className="text-left p-4 font-semibold text-gray-900">Display Name</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Email Verified</th>
                <th className="text-left p-4 font-semibold text-gray-900">Created</th>
                <th className="text-left p-4 font-semibold text-gray-900">Last Sign In</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-mono text-sm text-blue-600">{user.uid.substring(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{user.email || 'No email'}</div>
                  </td>
                  <td className="p-4">
                    <div>{user.displayName || 'No name'}</div>
                  </td>
                  <td className="p-4">
                    <Badge className={user.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                      {user.disabled ? 'Disabled' : 'Active'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={user.emailVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">
                      {user.creationTime ? new Date(user.creationTime).toLocaleDateString() : 'Unknown'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">
                      {user.lastSignInTime ? new Date(user.lastSignInTime).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                        title="View User"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleUser(user.uid, user.disabled)}
                        title={user.disabled ? "Enable User" : "Disable User"}
                      >
                        {user.disabled ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.uid)}
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
        
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {users.length === 0 ? (
              <div>
                <p>No authenticated users found.</p>
                <p className="text-sm mt-2">Only the current user is shown. Firebase Admin SDK is required to list all users.</p>
              </div>
            ) : (
              'No users match your search criteria.'
            )}
          </div>
        )}
      </Card>

      {/* View User Dialog */}
      <Dialog open={viewModal.isOpen} onOpenChange={() => setViewModal({isOpen: false, user: null})}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewModal.user && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">UID</label>
                  <p className="text-gray-900 font-mono text-sm">{viewModal.user.uid}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{viewModal.user.email || 'No email'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Display Name</label>
                  <p className="text-gray-900">{viewModal.user.displayName || 'No name'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Verified</label>
                  <Badge className={viewModal.user.emailVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {viewModal.user.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Status</label>
                  <Badge className={viewModal.user.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                    {viewModal.user.disabled ? 'Disabled' : 'Active'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">
                    {viewModal.user.creationTime ? new Date(viewModal.user.creationTime).toLocaleString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Sign In</label>
                  <p className="text-gray-900">
                    {viewModal.user.lastSignInTime ? new Date(viewModal.user.lastSignInTime).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Providers</label>
                  <p className="text-gray-900">
                    {viewModal.user.providerData.map(p => p.providerId).join(', ') || 'None'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;