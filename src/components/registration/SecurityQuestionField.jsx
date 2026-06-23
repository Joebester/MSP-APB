import { ChevronRight } from 'lucide-react';
import { Input } from '../ui/Input';

export function SecurityQuestionField({ number, question, value, onChange }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-bold text-gray-900">
          {number}. {question}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>
      <Input
        placeholder="Enter your an answer here"
        value={value}
        onChange={onChange}
        inputClassName="bg-white"
      />
    </div>
  );
}
