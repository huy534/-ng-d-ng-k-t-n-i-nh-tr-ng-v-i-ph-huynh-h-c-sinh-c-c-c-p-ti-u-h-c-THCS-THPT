import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import { useAuth } from '../contexts/AuthContext';
import { Classroom, Student } from '../types';
import { PencilIcon } from '../components/icons';

const ClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getClassroomsByTeacher().then(data => {
        setClassrooms(data);
        if (data.length > 0) {
            handleSelectClass(data[0]);
        }
        setLoading(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const handleSelectClass = (classroom: Classroom) => {
    setSelectedClass(classroom);
    api.getStudentsByClass(classroom.id).then(setStudents);
  };

  if (loading) return <p>Đang tải danh sách lớp...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Lớp học</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Danh sách Lớp</h3>
            <ul>
              {classrooms.map(c => (
                <li key={c.id} 
                    onClick={() => handleSelectClass(c)}
                    className={`p-3 rounded-md cursor-pointer ${selectedClass?.id === c.id ? 'bg-primary-100 text-primary-800 font-bold' : 'hover:bg-gray-100'}`}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:w-2/3">
          {selectedClass ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-bold text-gray-800">{selectedClass.name}</h3>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">Thêm học sinh</button>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="p-3 font-medium text-sm text-gray-600">Ảnh</th>
                              <th className="p-3 font-medium text-sm text-gray-600">Tên học sinh</th>
                              <th className="p-3 font-medium text-sm text-gray-600">Hành động</th>
                          </tr>
                      </thead>
                      <tbody>
                          {students.map(student => (
                              <tr key={student.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3">
                                      <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />
                                  </td>
                                  <td className="p-3 text-gray-800">{student.name}</td>
                                  <td className="p-3">
                                      <Link to={`/class/${selectedClass.id}/student/${student.id}/report`}
                                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-200"
                                      >
                                          <PencilIcon className="w-4 h-4 mr-1" />
                                          Cập nhật học bạ
                                      </Link>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
              <p className="text-gray-500">Vui lòng chọn một lớp để xem chi tiết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;