import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '../../components/ui/progress';
import budgetService from '../../services/budget';
import categoryService from '../../services/category';

export default function BudgetPlanning() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        period: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
    });

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
    }, []);

    const fetchBudgets = async () => {
        try {
            const data = await budgetService.getAll();
            setBudgets(data);
        } catch (error) {
            console.error("Failed to fetch budgets", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data.filter(cat => cat.type === 'expense')); // Only expense categories for budgets
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const resetForm = () => {
        setFormData({
            category: '',
            amount: '',
            period: 'monthly',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
        });
    };

    const handleAddBudget = async () => {
        try {
            await budgetService.create(formData);
            fetchBudgets();
            setIsAddDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to add budget", error);
            alert("Failed to add budget");
        }
    };

    const handleDeleteBudget = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await budgetService.delete(id);
                fetchBudgets();
            } catch (error) {
                console.error("Failed to delete budget", error);
                alert("Failed to delete budget");
            }
        }
    };

    const getBudgetStatus = (percentage) => {
        if (percentage >= 100) return { color: 'bg-red-500', text: 'Over Budget', alert: true };
        if (percentage >= 80) return { color: 'bg-yellow-500', text: 'Warning', alert: true };
        return { color: 'bg-green-500', text: 'On Track', alert: false };
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1>Budget Planning</h1>
                    <p className="text-slate-600 mt-1">Track and manage your spending budgets</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Budget
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Budget</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.icon} {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Budget Amount (रु)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="period">Period</Label>
                                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddBudget}>Create Budget</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Budget Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Budgets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{budgets.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Allocated</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            रु {budgets.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0).toFixed(2)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Budgets at Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {budgets.filter(b => b.percentage_used >= 80).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Budget List */}
            <div className="grid grid-cols-1 gap-4">
                {budgets.map((budget) => {
                    const status = getBudgetStatus(budget.percentage_used || 0);

                    return (
                        <Card key={budget.id}>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{budget.category_detail?.icon}</span>
                                            <div>
                                                <h3 className="font-semibold text-lg">{budget.category_detail?.name}</h3>
                                                <p className="text-sm text-slate-600 capitalize">{budget.period}</p>
                                                <p className="text-xs text-slate-500">
                                                    {budget.start_date} to {budget.end_date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">रु {parseFloat(budget.amount).toFixed(2)}</div>
                                            <p className="text-sm text-slate-600">Budget</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                Spent: रु {parseFloat(budget.spent_amount || 0).toFixed(2)}
                                            </span>
                                            <span className={`font-semibold ${status.alert ? 'text-red-600' : 'text-green-600'}`}>
                                                {(budget.percentage_used || 0).toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={Math.min(budget.percentage_used || 0, 100)} className="h-3" />
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {status.alert && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                                        <span className="text-red-600 font-medium">{status.text}</span>
                                                    </div>
                                                )}
                                                {!status.alert && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                                        <span className="text-green-600 font-medium">{status.text}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-600">
                                                Remaining: रु {parseFloat(budget.remaining_amount || budget.amount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteBudget(budget.id)}
                                        >
                                            Delete Budget
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {budgets.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-slate-500">No budgets created yet. Click "Create Budget" to get started!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
