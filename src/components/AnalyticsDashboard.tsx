import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { translate } from '../utils/translations';

interface AnalyticsData {
  date: string;
  visitors: number;
  sales: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData[];
  language?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, language = 'en' }) => {
  const totalVisitors = data.reduce((sum, d) => sum + d.visitors, 0);
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  const avgVisitors = Math.round(totalVisitors / data.length) || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <motion.div variants={itemVariants} className="glass-panel p-4 rounded-xl border border-orange-500/30 dark:border-orange-500/20 hover:border-orange-400/50 transition-colors">
          <div className="flex flex-col items-start justify-between h-full">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{translate('Total Visitors', language)}</p>
            <div className="flex items-end justify-between w-full">
              <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{totalVisitors}</p>
              <Users className="w-6 h-6 text-orange-400/40" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-4 rounded-xl border border-green-500/30 dark:border-green-500/20 hover:border-green-400/50 transition-colors">
          <div className="flex flex-col items-start justify-between h-full">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{translate('Total Sales', language)}</p>
            <div className="flex items-end justify-between w-full overflow-hidden">
              <p className="text-2xl font-bold text-green-500 dark:text-green-400 truncate">₹{totalSales.toLocaleString()}</p>
              <ShoppingBag className="w-6 h-6 text-green-400/40 flex-shrink-0 ml-2" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-4 rounded-xl border border-blue-500/30 dark:border-blue-500/20 hover:border-blue-400/50 transition-colors">
          <div className="flex flex-col items-start justify-between h-full">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">{translate('Avg Daily Visitors', language)}</p>
            <div className="flex items-end justify-between w-full">
              <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">{avgVisitors}</p>
              <TrendingUp className="w-6 h-6 text-blue-400/40" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl border border-orange-500/30 dark:border-orange-500/20 hover:border-orange-400/50 transition-colors">
        <h3 className="text-lg font-semibold mb-4 gradient-text">{translate('Visitor Trends', language)}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF9933" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 15, 30, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#FF9933"
              fillOpacity={1}
              fill="url(#colorVisitors)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl border border-green-500/30 dark:border-green-500/20 hover:border-green-400/50 transition-colors">
        <h3 className="text-lg font-semibold mb-4 gradient-text">{translate('Sales Performance', language)}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 15, 30, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};
