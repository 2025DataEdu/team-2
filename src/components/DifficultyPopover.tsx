
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DifficultyPopoverProps {
  selectedDifficulties: string[];
  onDifficultyChange: (difficulties: string[]) => void;
}

const DifficultyPopover = ({ selectedDifficulties, onDifficultyChange }: DifficultyPopoverProps) => {
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

  const getSelectedCount = () => {
    return selectedDifficulties.length;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full w-14 h-14 border-green-300 hover:bg-green-50 relative"
        >
          <Filter className="h-5 w-5" />
          {getSelectedCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getSelectedCount()}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-white border shadow-lg z-50" align="center">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            난이도 선택
          </h4>
          
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
          </div>
          
          {selectedDifficulties.length === 0 && (
            <p className="text-xs text-gray-500">
              모든 난이도의 경로가 표시됩니다
            </p>
          )}
          
          {selectedDifficulties.length > 0 && (
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDifficultyChange([])}
                className="w-full text-xs"
              >
                모든 선택 해제
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DifficultyPopover;
