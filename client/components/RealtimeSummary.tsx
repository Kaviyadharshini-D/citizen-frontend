export function RealtimeSummary() {
  const summaryCards = [
    {
      title: "Total Issues",
      value: "1,250",
    },
    {
      title: "Active Issues", 
      value: "320",
    },
    {
      title: "Avg. Response Time",
      value: "2 days",
    },
  ];

  return (
    <div className="bg-white">
      <div className="px-4 py-5">
        <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7 mb-3">
          Real-time Summary
        </h2>
      </div>
      
      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className="border border-dashboard-border rounded-lg p-6 bg-white"
            >
              <div className="mb-2">
                <div className="text-dashboard-text-primary text-base font-medium">
                  {card.title}
                </div>
              </div>
              <div className="text-dashboard-text-primary text-2xl font-bold leading-7">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
