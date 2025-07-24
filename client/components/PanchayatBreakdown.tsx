export function PanchayatBreakdown() {
  return (
    <div className="bg-white">
      {/* Section Header */}
      <div className="px-4 py-5">
        <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
          Panchayat-level Breakdown
        </h2>
      </div>

      {/* Map */}
      <div className="px-4 pb-3">
        <div className="rounded-lg overflow-hidden">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/ade6f7aba196df02cb12aac9165fcb93cb938971?width=1752"
            alt="Ward 14 Banglakar map"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
