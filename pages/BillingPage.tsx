
import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { Student, Invoice } from '../types';

const BillingPage: React.FC = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.getStudentsByParent(user.id).then(data => {
                setStudents(data);
                if (data.length > 0) {
                    setSelectedStudent(data[0]);
                } else {
                    setLoading(false);
                }
            });
        }
    }, [user]);

    useEffect(() => {
        if (selectedStudent) {
            setLoading(true);
            api.getInvoices(selectedStudent.id).then(data => {
                setInvoices(data);
                setLoading(false);
            });
        }
    }, [selectedStudent]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Thanh toán Học phí</h2>

            {students.length > 1 && (
                <div className="mb-4">
                    <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">Chọn học sinh:</label>
                    <select
                        id="student-select"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        value={selectedStudent?.id || ''}
                        onChange={e => setSelectedStudent(students.find(s => s.id === e.target.value) || null)}
                    >
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            )}

            {loading ? <p>Đang tải thông tin học phí...</p> : (
                invoices.length > 0 ? (
                    <div className="space-y-6">
                        {invoices.map(invoice => (
                            <div key={invoice.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className={`p-6 ${invoice.isPaid ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-gray-800">Hóa đơn tháng {invoice.month}/{invoice.year}</h3>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${invoice.isPaid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {invoice.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">Học sinh: {selectedStudent?.name}</p>
                                </div>
                                <div className="p-6">
                                    <table className="w-full mb-4">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 font-medium text-gray-600">Khoản thu</th>
                                                <th className="text-right py-2 font-medium text-gray-600">Số tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoice.items.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-2 text-gray-700">{item.description}</td>
                                                    <td className="py-2 text-right text-gray-800">{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="font-bold">
                                                <td className="py-3 text-right">Tổng cộng</td>
                                                <td className="py-3 text-right text-2xl text-primary-600">{formatCurrency(invoice.total)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    {!invoice.isPaid && (
                                        <div className="flex justify-end space-x-3 mt-4">
                                            <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Xuất biên lai</button>
                                            <button className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Thanh toán ngay</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">Không có hóa đơn nào cho học sinh này.</p>
                )
            )}
        </div>
    );
};

export default BillingPage;
