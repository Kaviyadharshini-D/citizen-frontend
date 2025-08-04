// Mock data for constituency, panchayat, and ward dropdowns

export const locationData = [
  {
    constituency: "Constituency A",
    panchayats: [
      {
        name: "Panchayat 1",
        wards: ["Ward 1", "Ward 2", "Ward 3"]
      },
      {
        name: "Panchayat 2",
        wards: ["Ward 4", "Ward 5"]
      }
    ]
  },
  {
    constituency: "Constituency B",
    panchayats: [
      {
        name: "Panchayat 3",
        wards: ["Ward 6", "Ward 7"]
      },
      {
        name: "Panchayat 4",
        wards: ["Ward 8", "Ward 9", "Ward 10"]
      }
    ]
  }
];

export type LocationData = typeof locationData;