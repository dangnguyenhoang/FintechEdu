import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Module, Lesson, Assignment } from '../types';
import { MockAPI } from '../services/mockData';
import { generateLessonPlan } from '../services/gemini';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'materials' | 'assignments' | 'people'>('curriculum');
  const [isLoading, setIsLoading] = useState(true);

  // Gemini State
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (id) {
      MockAPI.getCourse(id).then(c => {
        setCourse(c || null);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleCreateLessonWithAI = async (moduleId: string) => {
    const topic = prompt("Enter a topic for the AI lesson plan:");
    if (!topic) return;

    setAiLoading(true);
    const content = await generateLessonPlan(topic);
    setAiLoading(false);

    // Optimistically update
    if (course) {
        const newLesson: Lesson = {
            id: `l-ai-${Date.now()}`,
            title: topic,
            content: content,
            durationMinutes: 45,
            materials: [],
            isPublished: false
        };
        const updatedModules = course.modules.map(m => {
            if (m.id === moduleId) {
                return { ...m, lessons: [...m.lessons, newLesson] };
            }
            return m;
        });
        setCourse({ ...course, modules: updatedModules });
    }
  };

  const handleCreateAssignment = async () => {
      // Simple mock creation
      const title = prompt("Assignment Title:");
      if (!title || !course) return;
      
      const newAsg = await MockAPI.createAssignment(course.id, { 
          title, 
          description: 'Created via Course Builder',
          dueDate: new Date().toISOString().split('T')[0]
      });
      
      setCourse({ ...course, assignments: [...course.assignments, newAsg] });
  };

  if (isLoading) return <div className="p-8 text-center">Loading Course...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">Course not found</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
      {/* Course Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 rounded-t-xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-fintech-dark">{course.title}</h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-fintech-secondary text-white">{course.code}</span>
          </div>
          <p className="text-gray-600 max-w-2xl">{course.description}</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium shadow-sm">
                Edit Details
            </button>
            <button className="px-4 py-2 bg-fintech-primary text-white rounded-lg hover:bg-fintech-dark text-sm font-medium shadow-sm">
                Publish Changes
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <nav className="flex gap-6 -mb-px">
          <TabButton label="Curriculum" active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')} icon="fa-list-ol" />
          <TabButton label="Materials" active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} icon="fa-folder-open" />
          <TabButton label="Assignments" active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} icon="fa-tasks" />
          <TabButton label="People & Stats" active={activeTab === 'people'} onClick={() => setActiveTab('people')} icon="fa-users" />
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'curriculum' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Modules & Lessons</h3>
              <button className="text-fintech-secondary hover:text-fintech-primary font-medium text-sm">
                + Add Module
              </button>
            </div>
            
            {course.modules.length === 0 && <p className="text-gray-400 italic">No modules created yet.</p>}

            {course.modules.map(module => (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
                   <div className="flex items-center gap-3">
                     <i className="fas fa-grip-vertical text-gray-300 cursor-move"></i>
                     <h4 className="font-semibold text-gray-800">{module.title}</h4>
                   </div>
                   <div className="flex gap-2">
                     <button 
                        onClick={() => handleCreateLessonWithAI(module.id)}
                        disabled={aiLoading}
                        className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition flex items-center gap-1"
                     >
                        {aiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                        AI Lesson
                     </button>
                     <button className="text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-300 transition">
                        + Lesson
                     </button>
                   </div>
                </div>
                <div className="p-2 space-y-2">
                  {module.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-100 ml-4 hover:shadow-sm transition group">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-file-alt text-fintech-secondary opacity-70"></i>
                        <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                        <span className="text-xs text-gray-400">({lesson.durationMinutes} min)</span>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-gray-400 hover:text-fintech-primary"><i className="fas fa-edit"></i></button>
                         <button className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                  {module.lessons.length === 0 && <div className="p-3 text-sm text-gray-400 ml-4">No lessons in this module.</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assignments' && (
            <div className="space-y-4">
                <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Assignments</h3>
                    <button 
                        onClick={handleCreateAssignment}
                        className="bg-fintech-primary text-white px-3 py-1.5 rounded text-sm hover:bg-fintech-dark"
                    >
                        + Create Assignment
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.assignments.map(a => (
                        <div key={a.id} className="border p-4 rounded-lg hover:shadow-md transition bg-white relative">
                            <h4 className="font-bold text-gray-800">{a.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                            <div className="mt-3 flex gap-2">
                                {a.skills.map(s => (
                                    <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{s}</span>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t flex justify-between items-center">
                                <span className="text-xs font-mono text-gray-500">Due: {a.dueDate}</span>
                                <button 
                                    onClick={() => navigate(`/course/${course.id}/grade/${a.id}`)}
                                    className="text-sm text-fintech-primary hover:underline font-medium"
                                >
                                    Grade Submissions &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'materials' && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">Drag and drop files here to upload materials</p>
                <p className="text-xs text-gray-400 mt-1">(Cloud Storage Simulation)</p>
                <input type="file" className="mt-4 text-sm" />
                <div className="mt-8 text-left max-w-2xl mx-auto">
                    <h4 className="font-bold text-gray-700 mb-2">Existing Files:</h4>
                    {course.materials.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-2 border-b">
                            <span className="text-sm"><i className="fas fa-file-pdf mr-2 text-red-500"></i>{m.title}</span>
                            <span className="text-xs text-gray-400">{m.uploadedAt}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'people' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="font-bold text-gray-700 mb-4">Instructors</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <div className="w-8 h-8 rounded-full bg-fintech-primary text-white flex items-center justify-center">S</div>
                            <span>Dr. Sarah Smith</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded ml-auto">Lead</span>
                        </li>
                    </ul>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-700 mb-4">Students ({course.studentIds.length})</h3>
                    <div className="bg-white border rounded h-64 overflow-y-auto p-2">
                        {course.studentIds.map((sid, idx) => (
                             <div key={sid} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded border-b border-gray-50">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                                    {sid.toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-700">Student {idx + 1}</span>
                             </div>
                        ))}
                    </div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ label, active, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`py-4 px-2 mr-6 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
      active
        ? 'border-fintech-primary text-fintech-primary'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <i className={`fas ${icon}`}></i> {label}
  </button>
);

export default CourseDetail;