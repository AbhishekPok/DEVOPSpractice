import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Download, FileText, Calendar } from 'lucide-react';
import transactionService from '../../services/transaction';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Reports() {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('all');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getAll();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const matchesDateRange = transactionDate >= start && transactionDate <= end;
    const matchesType = reportType === 'all' || t.type === reportType;
    return matchesDateRange && matchesType;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  const handleGenerateReport = () => {
    setReportGenerated(true);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Notes'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.merchant,
      t.category,
      t.type,
      t.amount.toString(),
      t.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('FinTrack Financial Report', 14, 22);

    // Date Range
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text('Summary', 14, 40);

    doc.setFontSize(10);
    doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 14, 48);
    doc.text(`Total Expenses: ${totalExpenses.toFixed(2)}`, 14, 54);
    doc.text(`Net Amount: ${netAmount.toFixed(2)}`, 14, 60);

    // Table
    const tableColumn = ["Date", "Merchant", "Category", "Type", "Amount", "Notes"];
    const tableRows = [];

    filteredTransactions.forEach(transaction => {
      const transactionData = [
        transaction.date,
        transaction.merchant,
        transaction.category,
        transaction.type,
        parseFloat(transaction.amount).toFixed(2),
        transaction.notes || ''
      ];
      tableRows.push(transactionData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] } // Green-600
    });

    doc.save(`fintrack-report-${startDate}-to-${endDate}.pdf`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1>Reports</h1>
        <p className="text-slate-600 mt-1">Generate and export financial reports</p>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Transaction Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleGenerateReport} className="flex-1">
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={!reportGenerated}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={!reportGenerated}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportGenerated && (
        <>
          {/* Report Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-600">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600">{filteredTransactions.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-600">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-green-600">रु {totalIncome.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-600">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-red-600">रु {totalExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-600">Net Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={netAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  रु {netAmount.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <p className="text-slate-600 mt-2">
                Showing {filteredTransactions.length} transactions from {startDate} to {endDate}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.merchant}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}रु {parseFloat(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {transaction.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No transactions found for the selected criteria</p>
                </div>
              )}

              {filteredTransactions.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-600">Total Income</p>
                      <p className="text-green-600 mt-1">रु {totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-600">Total Expenses</p>
                      <p className="text-red-600 mt-1">रु {totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-600">Net Amount</p>
                      <p className={`mt-1 ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        रु {netAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Report Insights */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Report Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <p className="text-green-900">Financial Health</p>
                <p className="text-slate-700 mt-2">
                  {netAmount >= 0
                    ? `You have a positive balance of रु${netAmount.toFixed(2)} for this period. Great job managing your finances!`
                    : `You have a deficit of रु${Math.abs(netAmount).toFixed(2)} for this period. Consider reviewing your expenses.`
                  }
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-100">
                <p className="text-green-900">Spending Ratio</p>
                <p className="text-slate-700 mt-2">
                  {totalIncome > 0
                    ? `You're spending ${((totalExpenses / totalIncome) * 100).toFixed(1)}% of your income. ${(totalExpenses / totalIncome) < 0.8 ? 'You have good spending habits!' : 'Consider reducing expenses.'}`
                    : 'Add income transactions to see spending ratio.'
                  }
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-100">
                <p className="text-green-900">Transaction Activity</p>
                <p className="text-slate-700 mt-2">
                  You have {filteredTransactions.length} transactions in this period, averaging {(filteredTransactions.length / ((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)).toFixed(1)} transactions per day.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
