import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-5 w-48 mb-8" />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Gallery Skeleton */}
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-[450px] w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
        </div>

        {/* Right Info Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-24" />
          
          <div className="flex gap-4 items-center">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>

          <Skeleton className="h-4 w-40" />
          
          <div className="border-t border-b border-gray-200 py-6 space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
