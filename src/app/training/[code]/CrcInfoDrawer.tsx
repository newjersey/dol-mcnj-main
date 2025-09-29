"use client";
import { X } from '@phosphor-icons/react';

interface CrcInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrcInfoDrawer = ({ isOpen, onClose }: CrcInfoDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              About Consumer Report Cards
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Consumer Report Cards provide transparent information about training program outcomes 
                to help you make informed decisions about your education and career path.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Completion Percentage</h3>
                  <p className="text-sm text-gray-600">
                    The percentage of students who successfully completed the training program.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Employment Rate</h3>
                  <p className="text-sm text-gray-600">
                    The percentage of program completers who found employment at 6 months and 12 months after graduation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Median Wage</h3>
                  <p className="text-sm text-gray-600">
                    The middle wage earned by program completers at 6 months and 12 months after graduation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Top Industries</h3>
                  <p className="text-sm text-gray-600">
                    The three most common industries where program completers find employment.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500">
                  Data is based on program completers from the most recent available reporting period.
                  Individual results may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};