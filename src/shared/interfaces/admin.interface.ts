export interface DashboardOverview {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  availableDrivers: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  metrics: {
    totalBookings: number;
    activeBookings: number;
    availableDrivers: number;
    onlineDrivers: number;
    pendingPayments: number;
  };
  alerts: string[];
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  bookings: number;
}
