
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockApi';
import { SupportRequest } from '../../types';

const StatusBadge: React.FC<{ status: SupportRequest['status'] }> = ({ status }) => {
    const colorMap = {
        'Mới': 'bg-blue-100 text-blue-800',
        'Đang xử lý': 'bg-yellow-100 text-yellow-800',
        'Đã giải quyết': 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>
            {status}
        </span>
    );
};

const RequestDetailModal: React.FC<{ request: SupportRequest; onClose: () => void; onUpdate: (updatedRequest: SupportRequest) => void; }> = ({ request, onClose, onUpdate }) => {
    const [response, setResponse] = useState(request.response || '');
    const [status, setStatus] = useState(request.status);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updated = await api.updateSupportRequest(request.id, { status, response });
            onUpdate(updated);
            onClose();
        } catch(error) {
            console.error("Failed to update support request", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4">Chi tiết Yêu cầu Hỗ trợ #{request.id}</h3>
                <div className="space-y-4">
                    <p><span className="font-semibold">Người gửi:</span> {request.requesterInfo?.name} ({request.requesterType})</p>
                    <p><span className="font-semibold">Ngày gửi:</span> {new Date(request.createdAt).toLocaleString('vi-VN')}</p>
                    <div>
                        <p className="font-semibold">Nội dung:</p>
                        <p className="bg-gray-100 p-3 rounded-md mt-1">{request.content}</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block font-semibold">Trạng thái:</label>
                            <select value={status} onChange={e => setStatus(e.target.value as SupportRequest['status'])} className="w-full mt-1 p-2 border rounded-md">
                                <option>Mới</option>
                                <option>Đang xử lý</option>
                                <option>Đã giải quyết</option>
                            </select>
                        </div>
                         <div>
                            <label className="block font-semibold mt-2">Nội dung phản hồi:</label>
                            <textarea value={response} onChange={e => setResponse(e.target.value)} rows={4} className="w-full mt-1 p-2 border rounded-md"></textarea>
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                Đóng
                            </button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300">
                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const SupportManagementPage: React.FC = () => {
    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

    useEffect(() => {
        api.getSupportRequests().then(data => {
            setRequests(data);
            setLoading(false);
        });
    }, []);

    const handleUpdate = (updatedRequest: SupportRequest) => {
        setRequests(requests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
    };

    if (loading) return <p>Đang tải yêu cầu hỗ trợ...</p>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Yêu cầu Hỗ trợ</h2>
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-medium text-sm text-gray-600">ID</th>
                                <th className="p-3 font-medium text-sm text-gray-600">Người gửi</th>
                                <th className="p-3 font-medium text-sm text-gray-600">Ngày gửi</th>
                                <th className="p-3 font-medium text-sm text-gray-600">Trạng thái</th>
                                <th className="p-3 font-medium text-sm text-gray-600">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-gray-700 font-mono">#{request.id}</td>
                                    <td className="p-3 text-gray-800 font-medium">{request.requesterInfo?.name}</td>
                                    <td className="p-3 text-gray-700">{new Date(request.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="p-3"><StatusBadge status={request.status} /></td>
                                    <td className="p-3">
                                        <button onClick={() => setSelectedRequest(request)} className="text-blue-500 hover:underline text-sm font-semibold">Xem & Xử lý</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {requests.length === 0 && <p className="p-6 text-center text-gray-500">Không có yêu cầu hỗ trợ nào.</p>}
            </div>
            {selectedRequest && <RequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onUpdate={handleUpdate}/>}
        </div>
    );
};

export default SupportManagementPage;
