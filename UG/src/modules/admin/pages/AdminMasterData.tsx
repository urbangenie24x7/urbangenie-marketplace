import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder?: number;
}

interface Subcategory {
  id: string;
  name: string;
  categories: string[];
  categoryNames?: string[];
  description?: string;
  sortOrder?: number;
}

const AdminMasterData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', categories: [] as string[], description: '' });
  const [importing, setImporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{categories: Set<string>, subcategoryMap: Map<string, Set<string>>}>({categories: new Set(), subcategoryMap: new Map()});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [updatingServices, setUpdatingServices] = useState(false);
  const [servicePreviewOpen, setServicePreviewOpen] = useState(false);
  const [serviceData, setServiceData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);

      // Fetch subcategories
      const subcategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
      const subcategoriesData = subcategoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subcategory[];
      
      // Add category names to subcategories
      const enrichedSubcategories = subcategoriesData.map(sub => {
        const categoryIds = sub.categories || (sub.category ? [sub.category] : []);
        return {
          ...sub,
          categories: categoryIds,
          categoryNames: categoryIds.map(catId => 
            categoriesData.find(cat => cat.id === catId)?.name || 'Unknown'
          )
        };
      });
      
      setSubcategories(enrichedSubcategories);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    try {
      const categoryId = Date.now().toString();
      await setDoc(doc(db, 'categories', categoryId), {
        name: newCategory.name,
        description: newCategory.description,
        sortOrder: categories.length + 1,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Category added successfully');
      setAddCategoryOpen(false);
      setNewCategory({ name: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.name.trim() || newSubcategory.categories.length === 0) return;
    
    try {
      const subcategoryId = Date.now().toString();
      await setDoc(doc(db, 'subcategories', subcategoryId), {
        name: newSubcategory.name,
        categories: newSubcategory.categories,
        description: newSubcategory.description,
        sortOrder: subcategories.length + 1,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Subcategory added successfully');
      setAddSubcategoryOpen(false);
      setNewSubcategory({ name: '', categories: [], description: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Failed to add subcategory');
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      await updateDoc(doc(db, 'categories', category.id), {
        name: category.name,
        description: category.description,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Category updated successfully');
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleUpdateSubcategory = async (subcategory: Subcategory) => {
    try {
      await updateDoc(doc(db, 'subcategories', subcategory.id), {
        name: subcategory.name,
        categories: subcategory.categories,
        description: subcategory.description,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Subcategory updated successfully');
      setEditingSubcategory(null);
      fetchData();
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Failed to update subcategory');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure? This will also delete all subcategories under this category.')) return;
    
    try {
      // Delete category
      await deleteDoc(doc(db, 'categories', categoryId));
      
      // Delete all subcategories under this category
      const subcategoriesToDelete = subcategories.filter(s => s.category === categoryId);
      for (const sub of subcategoriesToDelete) {
        await deleteDoc(doc(db, 'subcategories', sub.id));
      }
      
      toast.success('Category and subcategories deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      await deleteDoc(doc(db, 'subcategories', subcategoryId));
      toast.success('Subcategory deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Failed to delete subcategory');
    }
  };

  const previewImportData = async () => {
    setImporting(true);
    try {
      // Fetch vendors
      const vendorsSnapshot = await getDocs(collection(db, 'vendors'));
      const vendors = vendorsSnapshot.docs.map(doc => doc.data());
      
      // Fetch services
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const services = servicesSnapshot.docs.map(doc => doc.data());
      
      const categorySet = new Set<string>();
      const subcategoryMap = new Map<string, Set<string>>();
      
      // Extract from vendors
      vendors.forEach(vendor => {
        if (vendor.category) {
          categorySet.add(vendor.category);
          
          if (vendor.subcategory) {
            if (!subcategoryMap.has(vendor.category)) {
              subcategoryMap.set(vendor.category, new Set());
            }
            subcategoryMap.get(vendor.category)?.add(vendor.subcategory);
          }
        }
        
        // Check skills array
        if (vendor.skills && Array.isArray(vendor.skills)) {
          vendor.skills.forEach((skill: any) => {
            if (typeof skill === 'string') {
              // Treat skills as subcategories under a general category
              const generalCategory = 'General Services';
              categorySet.add(generalCategory);
              if (!subcategoryMap.has(generalCategory)) {
                subcategoryMap.set(generalCategory, new Set());
              }
              subcategoryMap.get(generalCategory)?.add(skill);
            } else if (skill.service_name) {
              const generalCategory = 'General Services';
              categorySet.add(generalCategory);
              if (!subcategoryMap.has(generalCategory)) {
                subcategoryMap.set(generalCategory, new Set());
              }
              subcategoryMap.get(generalCategory)?.add(skill.service_name);
            }
          });
        }
      });
      
      // Extract from services
      services.forEach(service => {
        if (service.category) {
          categorySet.add(service.category);
          
          if (service.subcategory) {
            if (!subcategoryMap.has(service.category)) {
              subcategoryMap.set(service.category, new Set());
            }
            subcategoryMap.get(service.category)?.add(service.subcategory);
          }
        }
        
        // Also check service name as potential subcategory
        if (service.name && service.category) {
          if (!subcategoryMap.has(service.category)) {
            subcategoryMap.set(service.category, new Set());
          }
          subcategoryMap.get(service.category)?.add(service.name);
        }
      });
      
      let categoryCount = 0;
      for (const categoryName of categorySet) {
        if (categoryName && categoryName.trim()) {
          const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
          await setDoc(doc(db, 'categories', categoryId), {
            name: categoryName.trim(),
            description: 'Auto-imported from vendor data',
            sortOrder: categoryCount + 1,
            createdAt: new Date().toISOString()
          });
          categoryCount++;
        }
      }
      
      let subcategoryCount = 0;
      for (const [categoryName, subcategories] of subcategoryMap) {
        const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        for (const subcategoryName of subcategories) {
          if (subcategoryName && subcategoryName.trim()) {
            const subcategoryId = `${categoryId}_${subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            await setDoc(doc(db, 'subcategories', subcategoryId), {
              name: subcategoryName.trim(),
              category: categoryId,
              description: 'Auto-imported from vendor data',
              sortOrder: subcategoryCount + 1,
              createdAt: new Date().toISOString()
            });
            subcategoryCount++;
          }
        }
      }
      
      // Store preview data and show dialog
      setPreviewData({categories: categorySet, subcategoryMap});
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error previewing data:', error);
      toast.error('Failed to preview data');
    } finally {
      setImporting(false);
    }
  };

  const confirmImport = async () => {
    setImporting(true);
    try {
      const {categories: categorySet, subcategoryMap} = previewData;
      
      let categoryCount = 0;
      for (const categoryName of categorySet) {
        if (categoryName && categoryName.trim()) {
          const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
          await setDoc(doc(db, 'categories', categoryId), {
            name: categoryName.trim(),
            description: 'Auto-imported from vendor data',
            sortOrder: categoryCount + 1,
            createdAt: new Date().toISOString()
          });
          categoryCount++;
        }
      }
      
      let subcategoryCount = 0;
      for (const [categoryName, subcategories] of subcategoryMap) {
        const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        for (const subcategoryName of subcategories) {
          if (subcategoryName && subcategoryName.trim()) {
            const subcategoryId = `${categoryId}_${subcategoryName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            await setDoc(doc(db, 'subcategories', subcategoryId), {
              name: subcategoryName.trim(),
              category: categoryId,
              description: 'Auto-imported from vendor data',
              sortOrder: subcategoryCount + 1,
              createdAt: new Date().toISOString()
            });
            subcategoryCount++;
          }
        }
      }
      
      toast.success(`Imported ${categoryCount} categories and ${subcategoryCount} subcategories`);
      setPreviewOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const updateServicesWithMasterData = async () => {
    if (!confirm('This will update all services with proper category/subcategory mappings. Continue?')) return;
    
    setUpdatingServices(true);
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`Found ${services.length} services to check`);
      console.log(`Available categories:`, categories.map(c => c.name));
      console.log(`Available subcategories:`, subcategories.map(s => s.name));
      
      const categoryNameToId = new Map();
      const subcategoryNameToId = new Map();
      
      // Create multiple mappings for flexible matching
      categories.forEach(cat => {
        const variations = [
          cat.name.toLowerCase(),
          cat.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
          cat.name.toLowerCase().replace(/\s+/g, '_'),
          cat.name.toLowerCase().replace(/&/g, 'and')
        ];
        variations.forEach(variation => {
          categoryNameToId.set(variation, cat.id);
        });
      });
      
      subcategories.forEach(sub => {
        const variations = [
          sub.name.toLowerCase(),
          sub.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
          sub.name.toLowerCase().replace(/\s+/g, '_'),
          sub.name.toLowerCase().replace(/&/g, 'and')
        ];
        variations.forEach(variation => {
          subcategoryNameToId.set(variation, sub.id);
        });
      });
      
      let updatedCount = 0;
      const updateLog = [];
      
      for (const service of services) {
        let needsUpdate = false;
        const updates: any = {};
        const serviceLog = { id: service.id, name: service.name || service.title, changes: [] };
        
        // Check category mapping
        if (service.category) {
          const currentCategory = String(service.category).toLowerCase();
          const categoryId = categoryNameToId.get(currentCategory) || 
                           categoryNameToId.get(currentCategory.replace(/[^a-z0-9]/g, '')) ||
                           categoryNameToId.get(currentCategory.replace(/\s+/g, '_'));
          
          if (categoryId && categoryId !== service.category) {
            updates.category = categoryId;
            needsUpdate = true;
            serviceLog.changes.push(`category: ${service.category} -> ${categoryId}`);
          }
        }
        
        // Check subcategory mapping
        if (service.subcategory) {
          const currentSubcategory = String(service.subcategory).toLowerCase();
          const subcategoryId = subcategoryNameToId.get(currentSubcategory) ||
                               subcategoryNameToId.get(currentSubcategory.replace(/[^a-z0-9]/g, '')) ||
                               subcategoryNameToId.get(currentSubcategory.replace(/\s+/g, '_'));
          
          if (subcategoryId && subcategoryId !== service.subcategory) {
            updates.subcategory = subcategoryId;
            needsUpdate = true;
            serviceLog.changes.push(`subcategory: ${service.subcategory} -> ${subcategoryId}`);
          }
        }
        
        if (needsUpdate) {
          updates.updatedAt = new Date().toISOString();
          await updateDoc(doc(db, 'services', service.id), updates);
          updatedCount++;
          updateLog.push(serviceLog);
        }
      }
      
      console.log('Update log:', updateLog);
      toast.success(`Updated ${updatedCount} services. Check console for details.`);
      
      if (updatedCount === 0) {
        toast.info('No services needed updating. All services already have proper mappings.');
      }
      
    } catch (error) {
      console.error('Error updating services:', error);
      toast.error('Failed to update services. Check console for details.');
    } finally {
      setUpdatingServices(false);
    }
  };

  const previewServices = async () => {
    setUpdatingServices(true);
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServiceData(services);
      setServicePreviewOpen(true);
      console.log('Services found:', services);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setUpdatingServices(false);
    }
  };

  const forceUpdateAllServices = async () => {
    if (!confirm('This will force update ALL services with available category/subcategory mappings. Continue?')) return;
    
    setUpdatingServices(true);
    try {
      let updatedCount = 0;
      
      for (const service of serviceData) {
        const updates: any = {
          updatedAt: new Date().toISOString()
        };
        
        // Force assign first available category if none exists
        if (!service.category && categories.length > 0) {
          updates.category = categories[0].id;
        }
        
        // Force assign first available subcategory if none exists
        if (!service.subcategory && subcategories.length > 0) {
          updates.subcategory = subcategories[0].id;
        }
        
        await updateDoc(doc(db, 'services', service.id), updates);
        updatedCount++;
      }
      
      toast.success(`Force updated ${updatedCount} services`);
      setServicePreviewOpen(false);
    } catch (error) {
      console.error('Error force updating services:', error);
      toast.error('Failed to force update services');
    } finally {
      setUpdatingServices(false);
    }
  };

  const cleanupInvalidIds = async () => {
    if (!confirm('This will clean up invalid timestamp-based category/subcategory IDs. Continue?')) return;
    
    setUpdatingServices(true);
    try {
      let cleanedCount = 0;
      
      for (const service of serviceData) {
        const updates: any = {};
        let needsUpdate = false;
        
        if (service.category && /^\d+$/.test(service.category)) {
          const properCategoryId = categories.length > 0 ? categories[0].id : null;
          if (properCategoryId) {
            updates.category = properCategoryId;
            needsUpdate = true;
          }
        }
        
        if (service.subcategory && /^\d+$/.test(service.subcategory)) {
          const properSubcategoryId = subcategories.length > 0 ? subcategories[0].id : null;
          if (properSubcategoryId) {
            updates.subcategory = properSubcategoryId;
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          updates.updatedAt = new Date().toISOString();
          await updateDoc(doc(db, 'services', service.id), updates);
          cleanedCount++;
        }
      }
      
      toast.success(`Cleaned up ${cleanedCount} services with invalid IDs`);
      await previewServices();
    } catch (error) {
      console.error('Error cleaning up services:', error);
      toast.error('Failed to clean up services');
    } finally {
      setUpdatingServices(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading master data...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data Management</h1>
            <p className="text-gray-600">Manage categories and subcategories</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={previewImportData}
              disabled={importing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {importing ? 'Loading...' : 'Preview Import Data'}
            </Button>
            <Button 
              onClick={previewServices}
              disabled={updatingServices}
              className="bg-green-600 hover:bg-green-700"
            >
              {updatingServices ? 'Loading...' : 'Preview Services'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button size="sm" onClick={() => setAddCategoryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                {editingCategory?.id === category.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => handleUpdateCategory(editingCategory)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500">{category.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingCategory(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Subcategories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Subcategories</h2>
            <Button size="sm" onClick={() => setAddSubcategoryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subcategory
            </Button>
          </div>
          
          <div className="mb-4">
            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            {subcategories
              .filter(subcategory => selectedCategoryFilter === 'all' || subcategory.categories?.includes(selectedCategoryFilter))
              .map((subcategory) => (
              <div key={subcategory.id} className="flex items-center justify-between p-3 border rounded-lg">
                {editingSubcategory?.id === subcategory.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingSubcategory.name}
                      onChange={(e) => setEditingSubcategory({...editingSubcategory, name: e.target.value})}
                      placeholder="Subcategory name"
                    />
                    <div>
                      <label className="text-sm font-medium">Categories</label>
                      <div className="space-y-2 mt-1 max-h-32 overflow-y-auto border rounded p-2">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editingSubcategory.categories?.includes(cat.id) || false}
                              onChange={(e) => {
                                const currentCategories = editingSubcategory.categories || [];
                                if (e.target.checked) {
                                  setEditingSubcategory({
                                    ...editingSubcategory, 
                                    categories: [...currentCategories, cat.id]
                                  });
                                } else {
                                  setEditingSubcategory({
                                    ...editingSubcategory, 
                                    categories: currentCategories.filter(c => c !== cat.id)
                                  });
                                }
                              }}
                              className="rounded"
                            />
                            <label className="text-sm">{cat.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateSubcategory(editingSubcategory)}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingSubcategory(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-medium">{subcategory.name}</div>
                      <div className="text-sm text-gray-500">
                        {subcategory.categoryNames?.join(', ') || 'No categories'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingSubcategory(subcategory)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteSubcategory(subcategory.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="flex-1">Add Category</Button>
              <Button variant="outline" onClick={() => setAddCategoryOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={addSubcategoryOpen} onOpenChange={setAddSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subcategory Name</label>
              <Input
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                placeholder="Enter subcategory name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categories</label>
              <div className="space-y-2 mt-1 max-h-32 overflow-y-auto border rounded p-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newSubcategory.categories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewSubcategory({
                            ...newSubcategory, 
                            categories: [...newSubcategory.categories, category.id]
                          });
                        } else {
                          setNewSubcategory({
                            ...newSubcategory, 
                            categories: newSubcategory.categories.filter(c => c !== category.id)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <label className="text-sm">{category.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={newSubcategory.description}
                onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAddSubcategory} 
                disabled={!newSubcategory.name.trim() || newSubcategory.categories.length === 0}
                className="flex-1"
              >
                Add Subcategory
              </Button>
              <Button variant="outline" onClick={() => setAddSubcategoryOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Import Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Import Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Found {previewData.categories.size} categories and {Array.from(previewData.subcategoryMap.values()).reduce((sum, set) => sum + set.size, 0)} subcategories
            </p>
            
            <div className="space-y-4">
              {Array.from(previewData.subcategoryMap.entries()).map(([category, subcategories]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array.from(subcategories).map((subcategory) => (
                      <div key={subcategory} className="bg-gray-100 px-3 py-1 rounded text-sm">
                        {subcategory}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Categories without subcategories */}
              {Array.from(previewData.categories).filter(cat => !previewData.subcategoryMap.has(cat)).length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Categories without subcategories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array.from(previewData.categories).filter(cat => !previewData.subcategoryMap.has(cat)).map((category) => (
                      <div key={category} className="bg-gray-100 px-3 py-1 rounded text-sm">
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={confirmImport} disabled={importing} className="flex-1">
                {importing ? 'Importing...' : 'Confirm Import'}
              </Button>
              <Button variant="outline" onClick={() => setPreviewOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Preview Dialog */}
      <Dialog open={servicePreviewOpen} onOpenChange={setServicePreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Services Preview ({serviceData.length} services found)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceData.map((service) => (
                <div key={service.id} className="border rounded-lg p-3">
                  <div className="font-medium">{service.name || service.title || 'Unnamed Service'}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Category: {service.category || 'None'}</div>
                    <div>Subcategory: {service.subcategory || 'None'}</div>
                    <div>Price: ₹{service.basePrice || service.price || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={forceUpdateAllServices} 
                disabled={updatingServices}
                className="bg-red-600 hover:bg-red-700"
              >
                {updatingServices ? 'Updating...' : 'Force Update All Services'}
              </Button>
              <Button 
                onClick={updateServicesWithMasterData}
                disabled={updatingServices}
                className="bg-green-600 hover:bg-green-700"
              >
                {updatingServices ? 'Updating...' : 'Smart Update Services'}
              </Button>
              <Button 
                onClick={cleanupInvalidIds}
                disabled={updatingServices}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {updatingServices ? 'Cleaning...' : 'Cleanup Invalid IDs'}
              </Button>
              <Button variant="outline" onClick={() => setServicePreviewOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMasterData;