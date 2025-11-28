import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillAnalyticsProps {
  skills: Record<string, number>;
}

const SkillAnalytics: React.FC<SkillAnalyticsProps> = ({ skills }) => {
  const data = Object.keys(skills).map(key => ({
    subject: key,
    A: skills[key],
    fullMark: 100,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#1446A0"
            fill="#238CC8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillAnalytics;