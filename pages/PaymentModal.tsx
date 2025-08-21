
import React, { useState } from 'react';
import { Invoice } from '../types';
import { api } from '../services/mockApi';

interface PaymentModalProps {
    invoice: Invoice;
    studentName: string;
    onClose: () => void;
    onSuccess: (updatedInvoice: Invoice) => void;
}

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
);

const PaymentModal: React.FC<PaymentModalProps> = ({ invoice, studentName, onClose, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');
        try {
            const updatedInvoice = await api.payInvoice(invoice.id);
            onSuccess(updatedInvoice);
        } catch (err) {
            setError('Thanh toán thất bại. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Xác nhận Thanh toán</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Học sinh</p>
                        <p className="font-semibold text-gray-800">{studentName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Hóa đơn</p>
                        <p className="font-semibold text-gray-800">Tháng {invoice.month}/{invoice.year}</p>
                    </div>
                    <div className="text-center bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">TỔNG SỐ TIỀN</p>
                        <p className="text-3xl font-bold text-primary-600">{formatCurrency(invoice.total)}</p>
                    </div>

                    {/* Mock Payment Form */}
                    <div className="space-y-3">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Số thẻ</label>
                             <input type="text" placeholder="**** **** **** 1234" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" disabled/>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Ngày hết hạn</label>
                                <input type="text" placeholder="MM/YY" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" disabled/>
                            </div>
                             <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">CVV</label>
                                <input type="text" placeholder="***" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" disabled/>
                            </div>
                        </div>
                    </div>
                     {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onClose} disabled={isProcessing} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50">
                        Hủy
                    </button>
                    <button onClick={handlePayment} disabled={isProcessing} className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 flex items-center justify-center min-w-[120px]">
                        {isProcessing ? <Spinner /> : 'Thanh toán'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
