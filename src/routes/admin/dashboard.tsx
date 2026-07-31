import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Image, Wrench, MessageSquare, Users, Eye, TrendingUp } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatCard } from '@/components/admin/ui/StatCard'
import { ChartCard } from '@/components/admin/ui/ChartCard'
import { useServices } from '@/hooks/use-services'
import { usePortfolio } from '@/hooks/use-portfolio'
import { useTestimonials } from '@/hooks/use-testimonials'
import { useLeads } from '@/hooks/use-leads'

import type { Lead } from '@/types/admin'

export const Route = createFileRoute('/admin/dashboard')({
  component: Dashboard,
})

const COLORS = ['#d4af37', '#b38f29', '#f3e5ab', '#8a7322']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
}

function Dashboard() {
  const { data: services } = useServices()
  const { data: projects } = usePortfolio()
  const { data: testimonials } = useTestimonials()
  const { data: leads } = useLeads()

  const newLeadsCount = leads?.filter((l: Lead) => l.status === 'new').length || 0

  const leadsTrendData = useMemo(() => {
    if (!leads?.length) return [];
    const months: Record<string, number> = {};
    leads.forEach((lead: Lead) => {
      const month = new Date(lead.createdAt).toLocaleString('default', { month: 'short' });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const serviceDistData = useMemo(() => {
    if (!leads?.length) return [];
    const services: Record<string, number> = {};
    leads.forEach((lead: Lead) => {
      const svc = lead.service || 'Other';
      services[svc] = (services[svc] || 0) + 1;
    });
    return Object.entries(services).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const leadsByStatusData = useMemo(() => {
    if (!leads?.length) return [];
    const statuses: Record<string, number> = {};
    leads.forEach((lead: Lead) => {
      const s = lead.status.replace('_', ' ');
      statuses[s] = (statuses[s] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const projectsByCategoryData = useMemo(() => {
    if (!projects?.length) return [];
    const cats: Record<string, number> = {};
    projects.forEach((p: any) => {
      cats[p.category || 'Other'] = (cats[p.category || 'Other'] || 0) + 1;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [projects]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back, Admin" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Projects"
            value={projects?.length || 0}
            icon={<Image className="w-5 h-5 text-gold" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Services"
            value={services?.length || 0}
            icon={<Wrench className="w-5 h-5 text-gold" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Testimonials"
            value={testimonials?.length || 0}
            icon={<MessageSquare className="w-5 h-5 text-gold" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="New Leads"
            value={newLeadsCount}
            icon={<Users className="w-5 h-5 text-gold" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Leads"
            value={leads?.length || 0}
            icon={<Eye className="w-5 h-5 text-gold" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Featured Projects"
            value={projects?.filter((p: any) => p.featured).length || 0}
            icon={<TrendingUp className="w-5 h-5 text-gold" />}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <ChartCard title="Leads by Status">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f9f9f9' }} />
                  <Bar dataKey="value" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Leads Trend">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={3} dot={{ r: 4, fill: '#d4af37' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Projects by Category">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectsByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#d4af37" fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Service Distribution">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {serviceDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
            <Link to="/admin/leads" className="text-sm text-gold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {leads && leads.length > 0 ? (
              leads.slice(0, 5).map((lead: Lead) => (
                <div key={lead.id} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'new' ? 'bg-gold/20 text-gold' : 'bg-muted text-muted-foreground'
                  }`}>
                    {lead.status === 'new' ? 'New' : lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm py-4">No recent leads found.</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/services" className="flex items-center p-4 border border-border rounded-lg hover:border-gold hover:bg-gold/5 transition-colors group">
              <div className="bg-muted p-2 rounded-full mr-3 group-hover:bg-gold/20 transition-colors">
                <Wrench className="w-5 h-5 text-gold" />
              </div>
              <span className="font-medium text-foreground">Add Service</span>
            </Link>
            <Link to="/admin/portfolio" className="flex items-center p-4 border border-border rounded-lg hover:border-gold hover:bg-gold/5 transition-colors group">
              <div className="bg-muted p-2 rounded-full mr-3 group-hover:bg-gold/20 transition-colors">
                <Image className="w-5 h-5 text-gold" />
              </div>
              <span className="font-medium text-foreground">Add Project</span>
            </Link>
            <Link to="/admin/leads" className="flex items-center p-4 border border-border rounded-lg hover:border-gold hover:bg-gold/5 transition-colors group sm:col-span-2">
              <div className="bg-muted p-2 rounded-full mr-3 group-hover:bg-gold/20 transition-colors">
                <Users className="w-5 h-5 text-gold" />
              </div>
              <span className="font-medium text-foreground">View All Leads</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
