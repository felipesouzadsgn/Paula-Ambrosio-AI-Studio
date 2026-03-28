import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  Calendar, 
  MonitorPlay, 
  ShoppingCart, 
  Clock, 
  MessageSquare, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProjectWorkspace() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('schedules');

  const tabs = [
    { id: 'design', label: 'AI Design', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'schedules', label: 'Schedules', icon: <Calendar className="w-4 h-4" /> },
    { id: 'client', label: 'Client Dashboard', icon: <MonitorPlay className="w-4 h-4" /> },
    { id: 'procurement', label: 'Procurement', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'time', label: 'Time Tracking', icon: <Clock className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments & Flags', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif">Miami Penthouse Project</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">From Excel chaos to structured growth</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-medium italic">
          "Now we're getting to the end of projects with literally no surprises"
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-muted overflow-hidden">
                <img src={`https://picsum.photos/seed/designer${i}/100/100`} alt="Designer" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-medium">
              +2
            </div>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors">
            Share Project
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-border px-6">
        <div className="flex space-x-8 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'design') {
                  window.location.href = `/editor?project=${id}`;
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex items-center gap-2 py-4 text-xs uppercase tracking-widest font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-primary/80'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="workspaceTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'schedules' && <SchedulesView />}
              {activeTab === 'client' && <ClientDashboardView />}
              {activeTab === 'procurement' && <ProcurementView />}
              {activeTab === 'time' && <TimeTrackingView />}
              {activeTab === 'comments' && <CommentsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-views ---

function SchedulesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif mb-1">Schedules</h2>
          <p className="text-sm text-muted-foreground">Every product, every room, no confusion.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-xs uppercase tracking-widest font-medium hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Room</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { name: 'Camaleonda Sofa', room: 'Living Room', status: 'Approved', price: '$12,500', img: 'https://picsum.photos/seed/sofa/100/100' },
              { name: 'Flos Arco Lamp', room: 'Living Room', status: 'Pending', price: '$3,200', img: 'https://picsum.photos/seed/lamp/100/100' },
              { name: 'Custom Marble Table', room: 'Dining Room', status: 'Ordered', price: '$8,400', img: 'https://picsum.photos/seed/table/100/100' },
              { name: 'Wishbone Chairs (x8)', room: 'Dining Room', status: 'Approved', price: '$4,800', img: 'https://picsum.photos/seed/chair/100/100' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{item.room}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'Ordered' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{item.price}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientDashboardView() {
  const [pendingItems, setPendingItems] = useState([
    { id: 1, title: 'Master Bedroom Layout V2', date: 'Today, 10:30 AM', img: 'https://picsum.photos/seed/layout/400/300' },
    { id: 2, title: 'Kitchen Material Palette', date: 'Yesterday', img: 'https://picsum.photos/seed/palette/400/300' }
  ]);

  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'Client approved', item: 'Living Room Render', time: '2 hours ago', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
    { id: 2, action: 'Client commented on', item: 'Dining Chairs', time: '5 hours ago', icon: <MessageSquare className="w-4 h-4 text-blue-500" /> },
    { id: 3, action: 'You uploaded', item: 'Lighting Schedule', time: '1 day ago', icon: <Plus className="w-4 h-4 text-primary" /> },
  ]);

  const [activeFeedback, setActiveFeedback] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleApprove = (item: any) => {
    setPendingItems(prev => prev.filter(p => p.id !== item.id));
    setActivityLog(prev => [
      { id: Date.now(), action: 'Client approved', item: item.title, time: 'Just now', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
      ...prev
    ]);
  };

  const handleReject = (item: any) => {
    if (!feedbackText.trim()) return;
    setPendingItems(prev => prev.filter(p => p.id !== item.id));
    setActivityLog(prev => [
      { id: Date.now(), action: 'Client requested changes on', item: item.title, time: 'Just now', icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
      ...prev
    ]);
    setActiveFeedback(null);
    setFeedbackText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif mb-1">Client Dashboard</h2>
          <p className="text-sm text-muted-foreground">Live updates, recorded approvals.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-xs uppercase tracking-widest font-medium hover:bg-muted transition-colors">
          <MonitorPlay className="w-4 h-4" /> Preview as Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest font-medium mb-4">Pending Approvals</h3>
            
            {pendingItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 border-2 border-dashed border-border rounded-xl"
              >
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h4 className="font-medium text-sm">All caught up!</h4>
                <p className="text-xs text-muted-foreground mt-1">Waiting for new items to approve.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {pendingItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
                    >
                      <img src={item.img} alt={item.title} className="w-full sm:w-32 h-32 sm:h-24 rounded-lg object-cover" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        
                        {activeFeedback === item.id ? (
                          <div className="mt-3 flex gap-2">
                            <input 
                              type="text" 
                              autoFocus
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="What needs to change?" 
                              className="flex-1 text-xs px-3 py-1.5 border border-border rounded-md focus:outline-none focus:border-primary"
                              onKeyDown={(e) => e.key === 'Enter' && handleReject(item)}
                            />
                            <button onClick={() => handleReject(item)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-[10px] uppercase tracking-widest font-medium">Send</button>
                            <button onClick={() => setActiveFeedback(null)} className="px-3 py-1.5 border border-border rounded-md text-[10px] uppercase tracking-widest font-medium hover:bg-muted">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-3 sm:mt-0">
                            <button onClick={() => handleApprove(item)} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-[10px] uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors">Approve</button>
                            <button onClick={() => setActiveFeedback(item.id)} className="px-4 py-1.5 border border-border rounded-full text-[10px] uppercase tracking-widest font-medium hover:bg-muted transition-colors">Request Changes</button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest font-medium mb-4">Activity Log</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <AnimatePresence>
                {activityLog.map((log) => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-muted text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {log.icon}
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded-xl border border-border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{log.action}</span>
                        <span className="text-[10px] text-muted-foreground">{log.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.item}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcurementView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif mb-1">Procurement</h2>
          <p className="text-sm text-muted-foreground">Auto-calculated markups, instant POs.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create PO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Budget', value: '$250,000' },
          { label: 'Spent', value: '$145,200' },
          { label: 'Markup Profit', value: '$32,450' },
          { label: 'Pending POs', value: '4' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-serif">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">PO Number</th>
              <th className="px-6 py-4 font-medium">Vendor</th>
              <th className="px-6 py-4 font-medium">Net Cost</th>
              <th className="px-6 py-4 font-medium">Markup (20%)</th>
              <th className="px-6 py-4 font-medium">Client Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { po: 'PO-2026-041', vendor: 'Design Within Reach', cost: '$10,400', markup: '$2,080', price: '$12,480', status: 'Sent' },
              { po: 'PO-2026-042', vendor: 'Restoration Hardware', cost: '$22,000', markup: '$4,400', price: '$26,400', status: 'Draft' },
              { po: 'PO-2026-043', vendor: 'Waterworks', cost: '$8,500', markup: '$1,700', price: '$10,200', status: 'Paid' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium text-primary">{item.po}</td>
                <td className="px-6 py-4">{item.vendor}</td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{item.cost}</td>
                <td className="px-6 py-4 font-mono text-xs text-green-600">+{item.markup}</td>
                <td className="px-6 py-4 font-mono text-xs font-medium">{item.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    item.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    item.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimeTrackingView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif mb-1">Time Tracking</h2>
          <p className="text-sm text-muted-foreground">Real project costs, accurate quotes.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Play className="w-4 h-4 fill-current" /> Start Timer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-sm uppercase tracking-widest font-medium mb-6">Hours by Phase</h3>
          <div className="space-y-4">
            {[
              { phase: 'Concept Design', hours: 45, total: 50, color: 'bg-blue-500' },
              { phase: 'Design Development', hours: 82, total: 100, color: 'bg-purple-500' },
              { phase: 'Procurement', hours: 12, total: 40, color: 'bg-amber-500' },
              { phase: 'Installation', hours: 0, total: 60, color: 'bg-green-500' },
            ].map((phase, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{phase.phase}</span>
                  <span className="text-muted-foreground">{phase.hours} / {phase.total}h</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${phase.color}`} 
                    style={{ width: `${(phase.hours / phase.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-sm uppercase tracking-widest font-medium">Recent Entries</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border">
              {[
                { user: 'Sarah J.', task: 'Sourcing living room fabrics', date: 'Today', duration: '2h 30m', billable: true },
                { user: 'Mike T.', task: 'Client presentation prep', date: 'Yesterday', duration: '4h 00m', billable: true },
                { user: 'Elena R.', task: 'Vendor coordination (Plumbing)', date: 'Mar 25', duration: '1h 15m', billable: false },
              ].map((entry, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                        <img src={`https://picsum.photos/seed/${entry.user}/100/100`} alt={entry.user} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{entry.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{entry.task}</td>
                  <td className="px-6 py-4 text-xs">{entry.date}</td>
                  <td className="px-6 py-4 font-mono text-xs font-medium">{entry.duration}</td>
                  <td className="px-6 py-4">
                    {entry.billable && <span className="w-2 h-2 rounded-full bg-green-500 inline-block" title="Billable"></span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CommentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif mb-1">Comments & Flags</h2>
          <p className="text-sm text-muted-foreground">6 designers, 1 source of truth.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-border rounded-full text-xs uppercase tracking-widest font-medium hover:bg-muted transition-colors">
            Resolved
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors">
            Active Flags
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            author: 'Sarah Jenkins', 
            role: 'Lead Designer',
            time: '10 mins ago', 
            text: 'The lead time on the Camaleonda sofa just increased to 16 weeks. We need to notify the client or find an alternative.',
            flagged: true,
            replies: 2
          },
          { 
            author: 'Mike Torres', 
            role: 'Procurement',
            time: '2 hours ago', 
            text: 'Approved the PO for the marble slabs. They will be delivered to the fabricator on Tuesday.',
            flagged: false,
            replies: 0
          },
          { 
            author: 'Elena Rodriguez', 
            role: 'Junior Designer',
            time: 'Yesterday', 
            text: 'Can someone review the lighting plan for the master bath? I added the extra sconces the client requested.',
            flagged: true,
            replies: 4
          }
        ].map((comment, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${comment.flagged ? 'border-red-200 bg-red-50/30' : 'border-border bg-white'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={`https://picsum.photos/seed/${comment.author}/100/100`} alt={comment.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-medium text-sm">{comment.author}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{comment.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {comment.flagged && <AlertCircle className="w-4 h-4 text-red-500" />}
                <span className="text-xs text-muted-foreground">{comment.time}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">{comment.text}</p>
            <div className="flex items-center gap-4 border-t border-border/50 pt-4">
              <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> {comment.replies} Replies
              </button>
              <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                Reply
              </button>
              {comment.flagged && (
                <button className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors ml-auto">
                  Resolve Flag
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
