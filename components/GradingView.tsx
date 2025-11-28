import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Submission, Assignment } from '../types';
import { MockAPI } from '../services/mockData';
import { generateFeedback } from '../services/gemini';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const GradingView: React.FC = () => {
  const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignment, setAssignment] = useState<Assignment | undefined>(undefined);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Grading State
  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (assignmentId && id) {
      MockAPI.getCourse(id).then(c => {
        setAssignment(c?.assignments.find(a => a.id === assignmentId));
      });
      MockAPI.getSubmissions(assignmentId).then(setSubmissions);
    }
  }, [assignmentId, id]);

  const handleSelect = (sub: Submission) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.grade || 0);
    setFeedbackInput(sub.feedback || '');
  };

  const handleAiAssist = async () => {
    if (!selectedSubmission) return;
    setAiGenerating(true);
    const rubricText = "Grading Criteria: Accuracy of the diagram, proper use of UML notation, clarity of flow.";
    const feedback = await generateFeedback(selectedSubmission.content, rubricText);
    setFeedbackInput(feedback);
    setAiGenerating(false);
  };

  const handleSave = async () => {
    if (selectedSubmission) {
      await MockAPI.updateGrade(selectedSubmission.id, gradeInput, feedbackInput);
      // Refresh list locally
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, grade: gradeInput, feedback: feedbackInput, status: 'GRADED' } : s));
      alert("Grade saved!");
    }
  };

  // Stats
  const gradedCount = submissions.filter(s => s.status === 'GRADED').length;
  const pendingCount = submissions.length - gradedCount;
  const pieData = [
    { name: 'Graded', value: gradedCount, color: '#238CC8' },
    { name: 'Pending', value: pendingCount, color: '#F09628' },
  ];

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-arrow-left"></i> Back
            </button>
            <h2 className="text-xl font-bold text-gray-800 ml-4">Grading: {assignment.title}</h2>
         </div>
         <div className="flex gap-4 items-center">
            <div className="text-sm text-gray-600">
                Avg Grade: <span className="font-bold text-fintech-primary">
                    {gradedCount > 0 ? (submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedCount).toFixed(1) : '-'}
                </span>
            </div>
         </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* List */}
        <div className="w-1/3 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Submissions ({submissions.length})</h3>
                <div className="w-6 h-6">
                    <PieChart width={24} height={24}>
                        <Pie data={pieData} dataKey="value" outerRadius={12} isAnimationActive={false}>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {submissions.map(sub => (
                    <div 
                        key={sub.id}
                        onClick={() => handleSelect(sub)}
                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition ${selectedSubmission?.id === sub.id ? 'bg-blue-50 border-l-4 border-l-fintech-primary' : ''}`}
                    >
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-800">{sub.studentName}</span>
                            {sub.status === 'GRADED' 
                                ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{sub.grade} / {assignment.maxPoints}</span>
                                : <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Pending</span>
                            }
                        </div>
                        <p className="text-xs text-gray-400">{sub.submittedAt}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Detail */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 flex flex-col overflow-y-auto">
            {selectedSubmission ? (
                <>
                    <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Student Submission</h4>
                        <p className="text-gray-800 whitespace-pre-wrap">{selectedSubmission.content}</p>
                        {/* Simulation of file viewer */}
                        <div className="mt-4 p-3 border border-gray-300 rounded bg-white flex items-center gap-3 w-max">
                            <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                            <span className="text-sm underline text-blue-600 cursor-pointer">assignment_file.pdf</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Score (max {assignment.maxPoints})</label>
                            <input 
                                type="number" 
                                className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-fintech-primary outline-none"
                                value={gradeInput}
                                onChange={(e) => setGradeInput(Number(e.target.value))}
                                max={assignment.maxPoints}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                                <button 
                                    onClick={handleAiAssist}
                                    disabled={aiGenerating}
                                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
                                >
                                    {aiGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-robot"></i>}
                                    Generate AI Feedback
                                </button>
                            </div>
                            <textarea 
                                className="w-full p-3 border border-gray-300 rounded h-32 focus:ring-2 focus:ring-fintech-primary outline-none text-sm"
                                placeholder="Enter constructive feedback..."
                                value={feedbackInput}
                                onChange={(e) => setFeedbackInput(e.target.value)}
                            />
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button 
                                onClick={handleSave}
                                className="bg-fintech-primary text-white px-6 py-2 rounded shadow hover:bg-fintech-dark transition"
                            >
                                Save & Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    Select a student to grade
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GradingView;