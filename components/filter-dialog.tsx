"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";

interface FilterState {
  yoe: string[];
  designation: string[];
  country: string[];
  openToWorkOnly: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  matchingCount: number;
}

const YOE_OPTIONS = [
  "Less than 1 year",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "6 years",
  "7 years",
  "8 years",
  "10+ years",
];

const DESIGNATION_OPTIONS = [
  "Product Designer",
  "Senior UX Designer",
  "Lead Visual Designer",
  "Design Founder",
  "Senior Frontend Engineer",
  "Fullstack & Systems Engineer",
  "Creative Director",
  "Brand & Motion Designer",
  "Staff Product Designer",
];

const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "Canada",
  "UK",
  "Germany",
  "UAE",
  "Singapore",
  "Australia",
];

export function FilterDialog({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  matchingCount,
}: Props) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [showMoreYoe, setShowMoreYoe] = useState(false);
  const [showMoreDesig, setShowMoreDesig] = useState(false);
  const [showMoreCountry, setShowMoreCountry] = useState(false);

  if (!isOpen) return null;

  const toggleYoe = (val: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      yoe: prev.yoe.includes(val)
        ? prev.yoe.filter((item) => item !== val)
        : [...prev.yoe, val],
    }));
  };

  const toggleDesig = (val: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      designation: prev.designation.includes(val)
        ? prev.designation.filter((item) => item !== val)
        : [...prev.designation, val],
    }));
  };

  const toggleCountry = (val: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      country: prev.country.includes(val)
        ? prev.country.filter((item) => item !== val)
        : [...prev.country, val],
    }));
  };

  const toggleOpenToWork = () => {
    setLocalFilters((prev) => ({
      ...prev,
      openToWorkOnly: !prev.openToWorkOnly,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const empty = { yoe: [], designation: [], country: [], openToWorkOnly: false };
    setLocalFilters(empty);
    onClearFilters();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[85vh] rounded-3xl bg-white text-[#111827] shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827]">Filters</h2>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Years of experience */}
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-3">
              Years of experience
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(showMoreYoe ? YOE_OPTIONS : YOE_OPTIONS.slice(0, 6)).map((option) => {
                const isSelected = localFilters.yoe.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleYoe(option)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? "bg-[#111827] text-white border-black"
                        : "bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:border-[#9CA3AF]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? "bg-white text-black border-white" : "border-[#D1D5DB]"
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                    <span className="truncate">{option}</span>
                  </button>
                );
              })}
            </div>
            {YOE_OPTIONS.length > 6 && (
              <button
                type="button"
                onClick={() => setShowMoreYoe(!showMoreYoe)}
                className="mt-2 text-xs font-semibold text-[#4B5563] hover:text-black"
              >
                {showMoreYoe ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* Designation */}
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-3">
              Designation / Role
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(showMoreDesig ? DESIGNATION_OPTIONS : DESIGNATION_OPTIONS.slice(0, 6)).map(
                (option) => {
                  const isSelected = localFilters.designation.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDesig(option)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? "bg-[#111827] text-white border-black"
                          : "bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:border-[#9CA3AF]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isSelected ? "bg-white text-black border-white" : "border-[#D1D5DB]"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                      <span className="truncate">{option}</span>
                    </button>
                  );
                }
              )}
            </div>
            {DESIGNATION_OPTIONS.length > 6 && (
              <button
                type="button"
                onClick={() => setShowMoreDesig(!showMoreDesig)}
                className="mt-2 text-xs font-semibold text-[#4B5563] hover:text-black"
              >
                {showMoreDesig ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          {/* Country */}
          <div>
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide mb-3">
              Country
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(showMoreCountry ? COUNTRY_OPTIONS : COUNTRY_OPTIONS.slice(0, 6)).map(
                (option) => {
                  const isSelected = localFilters.country.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleCountry(option)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? "bg-[#111827] text-white border-black"
                          : "bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:border-[#9CA3AF]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isSelected ? "bg-white text-black border-white" : "border-[#D1D5DB]"
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                      <span className="truncate">{option}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Open to Work Toggle */}
          <div className="pt-2 border-t border-[#E5E7EB]">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="text-sm font-bold text-[#111827]">
                  Show only builders open to work
                </span>
                <p className="text-xs text-[#6B7280]">
                  Filter profiles actively looking for opportunities
                </p>
              </div>
              <input
                type="checkbox"
                checked={localFilters.openToWorkOnly}
                onChange={toggleOpenToWork}
                className="w-5 h-5 accent-black rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-[#6B7280] hover:text-black transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-[#27272A] font-semibold text-sm transition-all shadow-sm"
          >
            See Profiles ({matchingCount})
          </button>
        </div>
      </div>
    </div>
  );
}
