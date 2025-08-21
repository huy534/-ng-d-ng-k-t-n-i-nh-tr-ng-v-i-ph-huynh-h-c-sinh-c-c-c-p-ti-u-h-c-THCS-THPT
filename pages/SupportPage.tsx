
import React, { useState } from 'react';

const faqData = [
    {
        question: "Làm cách nào để xem báo cáo học tập của con tôi?",
        answer: "Để xem báo cáo học tập, vui lòng điều hướng đến mục 'Học bạ' từ thanh menu bên trái. Tại đây, bạn có thể chọn học sinh (nếu có nhiều hơn một) và xem tất cả các báo cáo có sẵn theo từng học kỳ."
    },
    {
        question: "Tôi không thể đăng nhập vào tài khoản của mình. Tôi nên làm gì?",
        answer: "Nếu bạn quên mật khẩu, hãy nhấp vào liên kết 'Quên mật khẩu?' trên trang đăng nhập và làm theo hướng dẫn để đặt lại. Nếu bạn vẫn gặp sự cố, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi qua email support@edconnect.com."
    },
    {
        question: "Làm thế nào để thanh toán học phí trực tuyến?",
        answer: "Truy cập mục 'Học phí' từ menu. Bạn sẽ thấy danh sách các hóa đơn. Nhấp vào nút 'Thanh toán ngay' bên cạnh hóa đơn chưa thanh toán và làm theo các bước để hoàn tất giao dịch."
    },
    {
        question: "Tôi có thể liên lạc với giáo viên của con tôi bằng cách nào?",
        answer: "Bạn có thể gửi tin nhắn trực tiếp cho giáo viên thông qua mục 'Tin nhắn'. Chọn tên giáo viên từ danh bạ của bạn để bắt đầu cuộc trò chuyện."
    }
];

const FAQItem: React.FC<{ item: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b">
            <button
                onClick={onClick}
                className="flex justify-between items-center w-full p-5 text-left font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
            >
                <span>{item.question}</span>
                <svg className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="p-5 pt-0 text-gray-600">
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};


const SupportPage: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [formState, setFormState] = useState({ subject: '', message: '' });
    const [formStatus, setFormStatus] = useState('');

    const handleToggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setFormStatus('success');
            setFormState({ subject: '', message: '' });
        }, 1500);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Hỗ trợ Kỹ thuật</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md mb-8">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Câu hỏi thường gặp (FAQ)</h3>
                        </div>
                        <div>
                            {faqData.map((item, index) => (
                                <FAQItem
                                    key={index}
                                    item={item}
                                    isOpen={openFAQ === index}
                                    onClick={() => handleToggleFAQ(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md">
                         <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Gửi yêu cầu hỗ trợ</h3>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Chủ đề</label>
                                <input type="text" name="subject" id="subject" value={formState.subject} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nội dung</label>
                                <textarea name="message" id="message" rows={5} value={formState.message} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={formStatus === 'sending'} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
                                    {formStatus === 'sending' ? 'Đang gửi...' : 'Gửi yêu cầu'}
                                </button>
                            </div>
                             {formStatus === 'success' && <p className="text-green-600 text-center">Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>}
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Thông tin liên hệ</h3>
                        <div className="space-y-4 text-gray-700">
                            <p>Nếu bạn cần hỗ trợ khẩn cấp, vui lòng liên hệ với chúng tôi qua các kênh dưới đây:</p>
                            <div>
                                <p className="font-semibold">Email hỗ trợ:</p>
                                <a href="mailto:support@edconnect.com" className="text-primary-600 hover:underline">support@edconnect.com</a>
                            </div>
                            <div>
                                <p className="font-semibold">Hotline:</p>
                                <p className="text-primary-600">(+84) 28 1234 5678</p>
                                <p className="text-sm text-gray-500">(Giờ hành chính: 8:00 - 17:00, T2-T6)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
