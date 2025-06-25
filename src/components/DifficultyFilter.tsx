
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface DifficultyFilterProps {
  selectedDifficulties: string[];
  onDifficultyChange: (difficulties: string[]) => void;
}

const DifficultyFilter = ({ selectedDifficulties, onDifficultyChange }: DifficultyFilterProps) => {
  const difficulties = [
    { value: 'easy', label: '쉬움', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: '보통', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'hard', label: '어려움', color: 'bg-red-100 text-red-800' }
  ];

  const handleDifficultyToggle = (difficulty: string) => {
    if (selectedDifficulties.includes(difficulty)) {
      onDifficultyChange(selectedDifficulties.filter(d => d !== difficulty));
    } else {
      onDifficultyChange([...selectedDifficulties, difficulty]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          난이도 선택
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {difficulties.map((difficulty) => (
            <div key={difficulty.value} className="flex items-center justify-between">
              <label 
                htmlFor={difficulty.value}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <input
                  type="checkbox"
                  id={difficulty.value}
                  checked={selectedDifficulties.includes(difficulty.value)}
                  onChange={() => handleDifficultyToggle(difficulty.value)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <Badge className={difficulty.color}>
                  {difficulty.label}
                </Badge>
              </label>
            </div>
          ))}
          {selectedDifficulties.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              모든 난이도의 경로가 표시됩니다
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyFilter;
