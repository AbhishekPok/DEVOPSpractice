import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import categoryService from '../../services/category';

// Common emoji icons for categories
const ICON_OPTIONS = ['🍔', '🚗', '🛍️', '💡', '🎬', '⚕️', '💰', '🏠', '📱', '✈️', '🎓', '🎮', '📚', '🏋️', '🍕', '☕'];

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        icon: '📁',
        type: 'expense',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            icon: '📁',
            type: 'expense',
        });
    };

    const handleAddCategory = async () => {
        try {
            await categoryService.create(formData);
            fetchCategories();
            setIsAddDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to add category", error);
            alert("Failed to add category");
        }
    };

    const handleEditCategory = async () => {
        if (!editingCategory) return;

        try {
            await categoryService.update(editingCategory.id, formData);
            fetchCategories();
            setEditingCategory(null);
            resetForm();
        } catch (error) {
            console.error("Failed to update category", error);
            alert("Failed to update category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? This may affect related transactions.")) {
            try {
                await categoryService.delete(id);
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
                alert("Failed to delete category. It may be used in transactions or budgets.");
            }
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            icon: category.icon,
            type: category.type,
        });
    };

    // Filter categories
    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || cat.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1>Categories</h1>
                    <p className="text-slate-600 mt-1">Manage your transaction categories</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter category name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon</Label>
                                <div className="grid grid-cols-8 gap-2">
                                    {ICON_OPTIONS.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`text-2xl p-2 rounded hover:bg-slate-100 ${formData.icon === icon ? 'bg-green-100 ring-2 ring-green-500' : ''}`}
                                            onClick={() => setFormData({ ...formData, icon })}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="expense">Expense</SelectItem>
                                        <SelectItem value="income">Income</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddCategory}>Add Category</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search categories..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{category.icon}</span>
                                        <div>
                                            <h3 className="font-semibold">{category.name}</h3>
                                            <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
                                                {category.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => startEdit(category)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Category</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-name">Category Name</Label>
                                                        <Input
                                                            id="edit-name"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-icon">Icon</Label>
                                                        <div className="grid grid-cols-8 gap-2">
                                                            {ICON_OPTIONS.map(icon => (
                                                                <button
                                                                    key={icon}
                                                                    type="button"
                                                                    className={`text-2xl p-2 rounded hover:bg-slate-100 ${formData.icon === icon ? 'bg-green-100 ring-2 ring-green-500' : ''}`}
                                                                    onClick={() => setFormData({ ...formData, icon })}
                                                                >
                                                                    {icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-type">Type</Label>
                                                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="expense">Expense</SelectItem>
                                                                <SelectItem value="income">Income</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
                                                    <Button onClick={handleEditCategory}>Save Changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No categories found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
