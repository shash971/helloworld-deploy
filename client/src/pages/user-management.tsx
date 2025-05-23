import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Types for users and roles
interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'inventory' | 'accountant';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete';
  description: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    username: "admin",
    name: "Admin User",
    email: "admin@jewelrymanagement.com",
    role: "admin",
    status: "active",
    lastLogin: "2025-05-22T08:30:00Z",
    createdAt: "2025-01-01T00:00:00Z",
    createdBy: "System"
  },
  {
    id: 2,
    username: "manager1",
    name: "John Manager",
    email: "john@jewelrymanagement.com",
    role: "manager",
    status: "active",
    lastLogin: "2025-05-22T10:15:00Z",
    createdAt: "2025-01-15T00:00:00Z",
    createdBy: "admin"
  },
  {
    id: 3,
    username: "sales1",
    name: "Emily Sales",
    email: "emily@jewelrymanagement.com",
    role: "sales",
    status: "active",
    lastLogin: "2025-05-22T09:45:00Z",
    createdAt: "2025-02-01T00:00:00Z",
    createdBy: "manager1"
  },
  {
    id: 4,
    username: "inventory1",
    name: "Michael Inventory",
    email: "michael@jewelrymanagement.com",
    role: "inventory",
    status: "active",
    lastLogin: "2025-05-21T16:20:00Z",
    createdAt: "2025-02-10T00:00:00Z",
    createdBy: "manager1"
  },
  {
    id: 5,
    username: "accountant1",
    name: "Sarah Accountant",
    email: "sarah@jewelrymanagement.com",
    role: "accountant",
    status: "active",
    lastLogin: "2025-05-22T08:50:00Z",
    createdAt: "2025-02-15T00:00:00Z",
    createdBy: "admin"
  },
  {
    id: 6,
    username: "sales2",
    name: "Robert Sales",
    email: "robert@jewelrymanagement.com",
    role: "sales",
    status: "inactive",
    createdAt: "2025-03-01T00:00:00Z",
    createdBy: "manager1"
  }
];

// Define permissions available in the system
const availablePermissions: Permission[] = [
  // Sales module permissions
  { id: "sales_view", module: "Sales", action: "view", description: "View sales transactions" },
  { id: "sales_create", module: "Sales", action: "create", description: "Create new sales" },
  { id: "sales_edit", module: "Sales", action: "edit", description: "Edit existing sales" },
  { id: "sales_delete", module: "Sales", action: "delete", description: "Delete sales records" },
  
  // Purchase module permissions
  { id: "purchase_view", module: "Purchase", action: "view", description: "View purchase transactions" },
  { id: "purchase_create", module: "Purchase", action: "create", description: "Create new purchases" },
  { id: "purchase_edit", module: "Purchase", action: "edit", description: "Edit existing purchases" },
  { id: "purchase_delete", module: "Purchase", action: "delete", description: "Delete purchase records" },
  
  // Expense module permissions
  { id: "expense_view", module: "Expense", action: "view", description: "View expense transactions" },
  { id: "expense_create", module: "Expense", action: "create", description: "Create new expenses" },
  { id: "expense_edit", module: "Expense", action: "edit", description: "Edit existing expenses" },
  { id: "expense_delete", module: "Expense", action: "delete", description: "Delete expense records" },
  
  // Loose Stock module permissions
  { id: "loose_stock_view", module: "Loose Stock", action: "view", description: "View loose stock inventory" },
  { id: "loose_stock_create", module: "Loose Stock", action: "create", description: "Add new loose stock items" },
  { id: "loose_stock_edit", module: "Loose Stock", action: "edit", description: "Edit loose stock items" },
  { id: "loose_stock_delete", module: "Loose Stock", action: "delete", description: "Delete loose stock items" },
  
  // Certified Stock module permissions
  { id: "certified_stock_view", module: "Certified Stock", action: "view", description: "View certified stock inventory" },
  { id: "certified_stock_create", module: "Certified Stock", action: "create", description: "Add new certified stock items" },
  { id: "certified_stock_edit", module: "Certified Stock", action: "edit", description: "Edit certified stock items" },
  { id: "certified_stock_delete", module: "Certified Stock", action: "delete", description: "Delete certified stock items" },
  
  // Jewellery Stock module permissions
  { id: "jewellery_stock_view", module: "Jewellery Stock", action: "view", description: "View jewellery stock inventory" },
  { id: "jewellery_stock_create", module: "Jewellery Stock", action: "create", description: "Add new jewellery stock items" },
  { id: "jewellery_stock_edit", module: "Jewellery Stock", action: "edit", description: "Edit jewellery stock items" },
  { id: "jewellery_stock_delete", module: "Jewellery Stock", action: "delete", description: "Delete jewellery stock items" },
  
  // Memo Give module permissions
  { id: "memo_give_view", module: "Memo Give", action: "view", description: "View memo give transactions" },
  { id: "memo_give_create", module: "Memo Give", action: "create", description: "Create new memo give transactions" },
  { id: "memo_give_edit", module: "Memo Give", action: "edit", description: "Edit memo give transactions" },
  { id: "memo_give_delete", module: "Memo Give", action: "delete", description: "Delete memo give transactions" },
  
  // Memo Take module permissions
  { id: "memo_take_view", module: "Memo Take", action: "view", description: "View memo take transactions" },
  { id: "memo_take_create", module: "Memo Take", action: "create", description: "Create new memo take transactions" },
  { id: "memo_take_edit", module: "Memo Take", action: "edit", description: "Edit memo take transactions" },
  { id: "memo_take_delete", module: "Memo Take", action: "delete", description: "Delete memo take transactions" },
  
  // IGI Issue module permissions
  { id: "igi_issue_view", module: "IGI Issue", action: "view", description: "View IGI issue records" },
  { id: "igi_issue_create", module: "IGI Issue", action: "create", description: "Create new IGI issue records" },
  { id: "igi_issue_edit", module: "IGI Issue", action: "edit", description: "Edit IGI issue records" },
  { id: "igi_issue_delete", module: "IGI Issue", action: "delete", description: "Delete IGI issue records" },
  
  // IGI Receive module permissions
  { id: "igi_receive_view", module: "IGI Receive", action: "view", description: "View IGI receive records" },
  { id: "igi_receive_create", module: "IGI Receive", action: "create", description: "Create new IGI receive records" },
  { id: "igi_receive_edit", module: "IGI Receive", action: "edit", description: "Edit IGI receive records" },
  { id: "igi_receive_delete", module: "IGI Receive", action: "delete", description: "Delete IGI receive records" },
  
  // Inventory Management module permissions
  { id: "inventory_mgmt_view", module: "Inventory Management", action: "view", description: "View inventory management dashboard" },
  
  // Reports & Charts module permissions
  { id: "reports_view", module: "Reports & Charts", action: "view", description: "View reports and charts" },
  { id: "reports_export", module: "Reports & Charts", action: "create", description: "Export reports" },
  
  // User Management module permissions
  { id: "user_mgmt_view", module: "User Management", action: "view", description: "View user accounts" },
  { id: "user_mgmt_create", module: "User Management", action: "create", description: "Create new user accounts" },
  { id: "user_mgmt_edit", module: "User Management", action: "edit", description: "Edit user accounts" },
  { id: "user_mgmt_delete", module: "User Management", action: "delete", description: "Delete user accounts" },
];

// Predefined roles with their permissions
const sampleRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all system features and modules",
    permissions: availablePermissions, // Admin has all permissions
  },
  {
    id: "manager",
    name: "Manager",
    description: "Access to most modules with limited administrative functions",
    permissions: availablePermissions.filter(p => 
      p.id !== "user_mgmt_delete" && 
      !p.id.includes("_delete")
    ),
  },
  {
    id: "sales",
    name: "Sales Staff",
    description: "Access to sales and customer-related modules",
    permissions: availablePermissions.filter(p => 
      p.module === "Sales" || 
      p.module === "Memo Give" || 
      p.id === "reports_view" || 
      p.id === "inventory_mgmt_view" ||
      p.id === "jewellery_stock_view" ||
      p.id === "certified_stock_view" ||
      p.id === "loose_stock_view"
    ),
  },
  {
    id: "inventory",
    name: "Inventory Staff",
    description: "Access to inventory and stock-related modules",
    permissions: availablePermissions.filter(p => 
      p.module === "Loose Stock" || 
      p.module === "Certified Stock" || 
      p.module === "Jewellery Stock" || 
      p.module === "IGI Issue" || 
      p.module === "IGI Receive" || 
      p.id === "inventory_mgmt_view" ||
      p.id === "reports_view"
    ),
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Access to financial reports and transactions",
    permissions: availablePermissions.filter(p => 
      p.module === "Expense" || 
      p.module === "Reports & Charts" ||
      p.id === "sales_view" ||
      p.id === "purchase_view"
    ),
  },
];

export default function UserManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for users and roles
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  // Dialog states
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [editRoleDialog, setEditRoleDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  
  // Selected items for editing/deleting
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "sales",
  });
  
  // Custom role editing
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  
  // Load data on component mount
  useEffect(() => {
    // Load from localStorage if available, otherwise use sample data
    const savedUsers = localStorage.getItem('usersData');
    const savedRoles = localStorage.getItem('rolesData');
    
    setUsers(savedUsers ? JSON.parse(savedUsers) : sampleUsers);
    setRoles(savedRoles ? JSON.parse(savedRoles) : sampleRoles);
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('usersData', JSON.stringify(users));
    }
    if (roles.length > 0) {
      localStorage.setItem('rolesData', JSON.stringify(roles));
    }
  }, [users, roles]);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    searchQuery === "" || 
    Object.values(user).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Group permissions by module for better display
  const getPermissionsByModule = () => {
    const modules: Record<string, Permission[]> = {};
    
    availablePermissions.forEach(permission => {
      if (!modules[permission.module]) {
        modules[permission.module] = [];
      }
      modules[permission.module].push(permission);
    });
    
    return modules;
  };
  
  const permissionsByModule = getPermissionsByModule();
  
  // Handle form input changes for new user
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle role change for new user
  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({
      ...prev,
      role: value
    }));
  };
  
  // Handle adding a new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newUser.username || !newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if passwords match
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if username already exists
    if (users.some(user => user.username === newUser.username)) {
      toast({
        title: "Username Error",
        description: "This username already exists. Please choose another one.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new user object
    const newUserObj: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy: "admin", // Assume current user is admin
    };
    
    // Add user to state
    setUsers([...users, newUserObj]);
    
    // Reset form and close dialog
    setNewUser({
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "sales",
    });
    setAddUserDialog(false);
    
    toast({
      title: "User Created",
      description: `User ${newUserObj.username} has been created successfully.`,
      variant: "default",
    });
  };
  
  // Handle user status toggle
  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" } 
        : user
    ));
    
    const updatedUser = users.find(user => user.id === userId);
    if (updatedUser) {
      const newStatus = updatedUser.status === "active" ? "inactive" : "active";
      toast({
        title: "User Status Updated",
        description: `${updatedUser.name}'s account is now ${newStatus}.`,
        variant: "default",
      });
    }
  };
  
  // Handle opening edit user dialog
  const handleEditUserClick = (user: User) => {
    setSelectedUser(user);
    setEditUserDialog(true);
  };
  
  // Handle edit user save
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedUser = {
      ...selectedUser,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as any,
    };
    
    // Update user in state
    setUsers(users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    ));
    
    setEditUserDialog(false);
    setSelectedUser(null);
    
    toast({
      title: "User Updated",
      description: `User ${updatedUser.username} has been updated successfully.`,
      variant: "default",
    });
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Remove user from state
    setUsers(users.filter(user => user.id !== selectedUser.id));
    
    setDeleteConfirmDialog(false);
    
    toast({
      title: "User Deleted",
      description: `User ${selectedUser.username} has been deleted successfully.`,
      variant: "default",
    });
    
    setSelectedUser(null);
  };
  
  // Handle opening edit role dialog
  const handleEditRoleClick = (role: Role) => {
    setSelectedRole(role);
    setEditedPermissions(role.permissions.map(p => p.id));
    setEditRoleDialog(true);
  };
  
  // Handle permission toggle in role editing
  const handlePermissionToggle = (permissionId: string) => {
    setEditedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  // Handle save role changes
  const handleSaveRoleEdit = () => {
    if (!selectedRole) return;
    
    // Get full permission objects for the selected permission IDs
    const updatedPermissions = availablePermissions.filter(p => 
      editedPermissions.includes(p.id)
    );
    
    // Update role in state
    const updatedRole = {
      ...selectedRole,
      permissions: updatedPermissions
    };
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id ? updatedRole : role
    ));
    
    setEditRoleDialog(false);
    setSelectedRole(null);
    
    toast({
      title: "Role Updated",
      description: `Role "${updatedRole.name}" has been updated successfully.`,
      variant: "default",
    });
  };
  
  // Helper function to get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <MainLayout title="User Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">User Management</h1>
          <p className="text-neutral-500">Manage users, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Search users..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => setAddUserDialog(true)}>
            Add New User
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'admin' ? 'destructive' :
                            user.role === 'manager' ? 'default' :
                            user.role === 'sales' ? 'secondary' :
                            user.role === 'inventory' ? 'outline' :
                            'default'
                          }>
                            {getRoleName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'outline' : 'secondary'} 
                            className={user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-100'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm') : 'Never'}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</div>
                            <div className="text-neutral-500">by {user.createdBy}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditUserClick(user)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant={user.status === 'active' ? 'outline' : 'default'} 
                              size="sm" 
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            {user.username !== 'admin' && (
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteConfirmDialog(true);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 text-neutral-500">
                        No users found. Add new users to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Roles & Permissions Tab */}
        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{role.name}</CardTitle>
                    {role.id !== 'admin' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditRoleClick(role)}
                      >
                        Edit Permissions
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">{role.description}</p>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="text-sm font-medium mb-2">
                    {role.permissions.length} permissions granted
                  </div>
                  
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(permissionsByModule).map(([module, permissions]) => {
                      const modulePermissions = permissions.filter(p => 
                        role.permissions.some(rp => rp.id === p.id)
                      );
                      
                      if (modulePermissions.length === 0) return null;
                      
                      return (
                        <AccordionItem key={module} value={module}>
                          <AccordionTrigger className="text-sm">
                            {module} ({modulePermissions.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {modulePermissions.map(permission => (
                                <li key={permission.id} className="text-xs flex items-center space-x-2">
                                  <span className={`w-2 h-2 rounded-full ${
                                    permission.action === 'view' ? 'bg-blue-500' :
                                    permission.action === 'create' ? 'bg-green-500' :
                                    permission.action === 'edit' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}></span>
                                  <span>{permission.description}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add New User Dialog */}
      <Dialog open={addUserDialog} onOpenChange={setAddUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. All fields are required.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newUser.role && (
                <p className="text-xs text-neutral-500 mt-1">
                  {roles.find(r => r.id === newUser.role)?.description}
                </p>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddUserDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <form onSubmit={handleSaveUserEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={selectedUser.username}
                  disabled
                />
                <p className="text-xs text-neutral-500">Username cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedUser.name}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={selectedUser.email}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  defaultValue={selectedUser.role}
                  name="role"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditUserDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user {selectedUser?.username}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Permissions Dialog */}
      <Dialog open={editRoleDialog} onOpenChange={setEditRoleDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Role Permissions</DialogTitle>
            <DialogDescription>
              Customize permissions for the {selectedRole?.name} role
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(permissionsByModule).map(([module, permissions]) => (
                <div key={module} className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">{module}</h3>
                  <div className="space-y-2">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={permission.id}
                          checked={editedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.description}
                          </label>
                          <p className="text-xs text-neutral-500">
                            {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)} access
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoleEdit}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}