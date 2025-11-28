import React, { useEffect, useState } from 'react';
import { Course, User } from '../types';
import { MockAPI } from '../services/mockData';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    MockAPI.getCourses().then(setCourses);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Students" value="124" icon="fa-user-graduate" color="bg-fintech-primary" />
        <StatCard title="Active Courses" value={courses.length.toString()} icon="fa-book" color="bg-fintech-secondary" />
        <StatCard title="Assignments to Grade" value="5" icon="fa-clipboard-check" color="bg-fintech-accent" />
      </div>

      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-bold text-gray-800">Your Courses</h3>
        <button className="bg-fintech-primary text-white px-4 py-2 rounded-lg hover:bg-fintech-dark transition shadow-sm flex items-center gap-2">
          <i className="fas fa-plus"></i> New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div 
            key={course.id} 
            onClick={() => navigate(`/course/${course.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer overflow-hidden group"
          >
            <div className="h-2 bg-fintech-secondary group-hover:bg-fintech-primary transition-colors"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-fintech-secondary bg-blue-50 px-2 py-1 rounded">{course.code}</span>
                <i className="fas fa-ellipsis-h text-gray-400"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1"><i className="fas fa-users"></i> {course.studentIds.length} Students</span>
                <span className="flex items-center gap-1"><i className="fas fa-layer-group"></i> {course.modules.length} Modules</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-xl shadow-md`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;