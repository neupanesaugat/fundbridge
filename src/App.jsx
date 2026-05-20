import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Heart, Users, BarChart3, ShieldCheck, PlusCircle, Menu, X, ArrowRight,
  CalendarDays, Wallet, CheckCircle2, TrendingUp, Bell, UserRound, LayoutDashboard,
  LogOut, Trash2, Edit3, Save, AlertCircle
} from 'lucide-react';
import { categories, initialCampaigns } from './data/campaigns';
import { currency, getFundingPercent } from './utils';

const STORAGE_KEY = 'fundbridge_campaigns_v1';
const USER_KEY = 'fundbridge_user_v1';

function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>{children}</button>;
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function ProgressBar({ value }) {
  return <div className="progress"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(value, 100)}%` }} transition={{ duration: 0.7 }} /></div>;
}

function Header({ activePage, setActivePage, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const nav = [
    { key: 'home', label: 'Home' },
    { key: 'campaigns', label: 'Campaigns' },
    { key: 'create', label: 'Start a Campaign' },
    { key: 'dashboard', label: 'Dashboard' }
  ];
  const go = (key) => { setActivePage(key); setOpen(false); };
  return <header className="header">
    <div className="header-inner">
      <button className="brand" onClick={() => go('home')}>
        <span className="brand-logo"><Heart size={20} /></span>
        <span><strong>FundBridge</strong><small>Community crowdfunding</small></span>
      </button>
      <nav className="nav desktop-only">
        {nav.map(item => <button key={item.key} onClick={() => go(item.key)} className={activePage === item.key ? 'active' : ''}>{item.label}</button>)}
      </nav>
      <div className="desktop-only header-actions">
        {user ? <><span className="user-chip">{user.name}</span><Button variant="outline" onClick={onLogout}>Logout</Button></> : <Button variant="outline" onClick={() => go('login')}>Login</Button>}
        <Button onClick={() => go('create')}><PlusCircle size={16} /> Create</Button>
      </div>
      <button className="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="mobile-nav">
      {nav.map(item => <button key={item.key} onClick={() => go(item.key)}>{item.label}</button>)}
      {user ? <button onClick={onLogout}>Logout</button> : <button onClick={() => go('login')}>Login</button>}
    </div>}
  </header>;
}

function CampaignCard({ campaign, onOpen, onDonate }) {
  const percent = getFundingPercent(campaign);
  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="campaign-card-wrap">
    <Card className="campaign-card">
      <img src={campaign.image} alt={campaign.title} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'; }} />
      <div className="campaign-body">
        <div className="row-between"><span className="tag">{campaign.category}</span><span className="muted icon-text"><CalendarDays size={15} /> {campaign.daysLeft} days left</span></div>
        <h3>{campaign.title}</h3>
        <p>{campaign.summary}</p>
        <div className="funding">
          <div className="row-between"><strong>{currency(campaign.raised)}</strong><span>{percent}%</span></div>
          <ProgressBar value={percent} />
          <small>Goal: {currency(campaign.goal)} · {campaign.backers} backers</small>
        </div>
        <div className="two-buttons"><Button onClick={() => onDonate(campaign)}>Donate</Button><Button variant="outline" onClick={() => onOpen(campaign)}>Details</Button></div>
      </div>
    </Card>
  </motion.div>;
}

function HomePage({ campaigns, setActivePage, onOpen, onDonate }) {
  const totalRaised = campaigns.reduce((s, c) => s + Number(c.raised || 0), 0);
  const totalBackers = campaigns.reduce((s, c) => s + Number(c.backers || 0), 0);
  return <main>
    <section className="hero">
      <div className="container hero-grid">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="pill"><ShieldCheck size={16} /> Secure, transparent, community-driven</span>
          <h1>Fund ideas that create real impact.</h1>
          <p className="lead">FundBridge connects donors with community projects, startups, and charitable causes through a simple crowdfunding platform.</p>
          <div className="hero-actions"><Button size="lg" onClick={() => setActivePage('campaigns')}>Explore Campaigns <ArrowRight size={18} /></Button><Button size="lg" variant="outline" onClick={() => setActivePage('create')}>Start a Campaign</Button></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="hero-card">
            <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80" alt="Community fundraising" />
            <div><h2>Live Platform Summary</h2><div className="summary-grid"><Summary number={campaigns.length} label="Campaigns" /><Summary number={currency(totalRaised)} label="Raised" /><Summary number={totalBackers} label="Backers" /></div></div>
          </Card>
        </motion.div>
      </div>
    </section>
    <section className="container section">
      <div className="section-heading"><div><span className="eyebrow">Featured campaigns</span><h2>Support active projects</h2></div><Button variant="outline" onClick={() => setActivePage('campaigns')}>View all</Button></div>
      <div className="grid-3">{campaigns.slice(0, 3).map(c => <CampaignCard key={c.id} campaign={c} onOpen={onOpen} onDonate={onDonate} />)}</div>
    </section>
    <section className="dark-section"><div className="container features"><Feature icon={Wallet} title="Easy Donations" text="Donors can support campaigns through a simple demo payment flow." /><Feature icon={BarChart3} title="Transparent Progress" text="Campaign progress, goals, and updates are visible to all users." /><Feature icon={Users} title="Community Trust" text="Project owners can share updates and build trust with backers." /></div></section>
  </main>;
}

function Summary({ number, label }) { return <div className="summary-item"><strong>{number}</strong><span>{label}</span></div>; }
function Feature({ icon: Icon, title, text }) { return <div className="feature"><Icon /><h3>{title}</h3><p>{text}</p></div>; }

function CampaignsPage({ campaigns, onOpen, onDonate }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popular');
  const filtered = useMemo(() => {
    let result = campaigns.filter(c => {
      const q = query.toLowerCase();
      return (category === 'All' || c.category === category) && [c.title, c.summary, c.owner, c.location].join(' ').toLowerCase().includes(q);
    });
    if (sort === 'ending') result = result.sort((a, b) => a.daysLeft - b.daysLeft);
    if (sort === 'funded') result = result.sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
    if (sort === 'popular') result = result.sort((a, b) => b.backers - a.backers);
    return result;
  }, [campaigns, query, category, sort]);
  return <main className="container page">
    <PageTitle eyebrow="Browse projects" title="Campaigns" text="Search, filter, and support verified campaigns from the FundBridge community." />
    <Card className="filters"><div className="search-box"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaign, owner, or keyword" /></div><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select><select value={sort} onChange={e => setSort(e.target.value)}><option value="popular">Most popular</option><option value="funded">Most funded</option><option value="ending">Ending soon</option></select></Card>
    <div className="grid-3">{filtered.map(c => <CampaignCard key={c.id} campaign={c} onOpen={onOpen} onDonate={onDonate} />)}</div>
    {filtered.length === 0 && <div className="empty">No campaigns matched your search.</div>}
  </main>;
}

function PageTitle({ eyebrow, title, text }) { return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>; }

function CreateCampaignPage({ onCreate }) {
  const [form, setForm] = useState({ title: '', category: 'Community', goal: '', location: '', summary: '', image: '' });
  const [message, setMessage] = useState('');
  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.goal || Number(form.goal) <= 0 || !form.summary.trim()) { setMessage('Please enter a title, valid goal, and summary.'); return; }
    onCreate(form);
    setForm({ title: '', category: 'Community', goal: '', location: '', summary: '', image: '' });
    setMessage('Campaign created successfully and saved in this browser.');
  }
  return <main className="container page">
    <PageTitle eyebrow="Project owner portal" title="Start a Campaign" text="Create a campaign with a funding goal, project story, and category. The data is saved locally for the demo." />
    <div className="form-layout">
      <Card className="form-card">
        {message && <div className={`notice ${message.includes('success') ? 'success' : 'error'}`}>{message.includes('success') ? <CheckCircle2 /> : <AlertCircle />}{message}</div>}
        <form onSubmit={submit}>
          <label>Campaign Title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Solar Lights for Community Center" /></label>
          <div className="form-grid"><label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}</select></label><label>Funding Goal<input type="number" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} placeholder="10000" /></label></div>
          <label>Location<input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City or country" /></label>
          <label>Image URL optional<input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://example.com/image.jpg" /></label>
          <label>Campaign Summary<textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows="6" placeholder="Explain the problem, solution, and how funds will be used." /></label>
          <Button size="lg" className="full">Publish Campaign</Button>
        </form>
      </Card>
      <Card className="checklist"><h2>Submission Checklist</h2>{['Clear project title and purpose', 'Realistic funding goal', 'Campaign category selected', 'Impact and fund usage explained', 'Updates shared with backers'].map(item => <p key={item}><CheckCircle2 /> {item}</p>)}</Card>
    </div>
  </main>;
}

function DashboardPage({ campaigns, onDeleteCampaign, onAddUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [updateText, setUpdateText] = useState('');
  const totalRaised = campaigns.reduce((s, c) => s + Number(c.raised || 0), 0);
  const totalGoal = campaigns.reduce((s, c) => s + Number(c.goal || 0), 0);
  const totalBackers = campaigns.reduce((s, c) => s + Number(c.backers || 0), 0);
  const avgFunded = totalGoal ? Math.round((totalRaised / totalGoal) * 100) : 0;
  function saveUpdate(id) { if (updateText.trim()) { onAddUpdate(id, updateText.trim()); setUpdateText(''); setEditingId(null); } }
  return <main className="container page">
    <div className="dashboard-top"><PageTitle eyebrow="Admin and user analytics" title="Dashboard" text="Track campaign activity, donations, project performance, and updates." /><Button><Bell size={16} /> Notifications</Button></div>
    <div className="stat-grid"><Stat icon={Wallet} title="Total Raised" value={currency(totalRaised)} note="Across all active campaigns" /><Stat icon={Users} title="Total Backers" value={totalBackers} note="Donors supporting projects" /><Stat icon={TrendingUp} title="Average Funded" value={`${avgFunded}%`} note="Compared with total goals" /><Stat icon={LayoutDashboard} title="Active Campaigns" value={campaigns.length} note="Currently visible on platform" /></div>
    <div className="dashboard-grid">
      <Card><h2>Campaign Performance</h2><div className="performance-list">{campaigns.map(c => <div className="performance-item" key={c.id}><div className="row-between"><div><strong>{c.title}</strong><small>{c.backers} backers · {c.daysLeft} days left</small></div><strong>{getFundingPercent(c)}%</strong></div><ProgressBar value={getFundingPercent(c)} /><div className="admin-actions"><Button variant="outline" onClick={() => setEditingId(c.id)}><Edit3 size={15} /> Add Update</Button><Button variant="danger" onClick={() => onDeleteCampaign(c.id)}><Trash2 size={15} /> Delete</Button></div>{editingId === c.id && <div className="update-editor"><input value={updateText} onChange={e => setUpdateText(e.target.value)} placeholder="Write a campaign update" /><Button onClick={() => saveUpdate(c.id)}><Save size={15} /> Save</Button></div>}</div>)}</div></Card>
      <Card><h2>Recent Activity</h2><div className="activity-list"><p>New donation flow is working.</p><p>Campaign creation stores data locally.</p><p>Admin can add project updates.</p><p>Dashboard calculates live statistics.</p></div></Card>
    </div>
  </main>;
}

function Stat({ icon: Icon, title, value, note }) { return <Card className="stat"><Icon /><div><span>{title}</span><strong>{value}</strong><small>{note}</small></div></Card>; }

function LoginPage({ setActivePage, onLogin }) {
  const [email, setEmail] = useState('demo@fundbridge.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  function submit(e) { e.preventDefault(); if (!email || !password) { setError('Email and password are required.'); return; } onLogin({ name: 'Demo User', email }); setActivePage('dashboard'); }
  return <main className="container login-page"><div><span className="eyebrow">Secure access</span><h1>Login to FundBridge</h1><p>This demo login represents the authentication module for project owners, donors, and administrators.</p></div><Card className="login-card"><div className="login-heading"><UserRound /><div><h2>Welcome back</h2><p>Use demo credentials to continue.</p></div></div>{error && <div className="notice error"><AlertCircle />{error}</div>}<form onSubmit={submit}><input value={email} onChange={e => setEmail(e.target.value)} /><input value={password} onChange={e => setPassword(e.target.value)} type="password" /><Button size="lg" className="full">Login</Button><Button type="button" variant="outline" className="full" onClick={() => setActivePage('home')}><LogOut size={16} /> Continue as Guest</Button></form></Card></main>;
}

function CampaignDetailsModal({ campaign, onClose, onDonate }) {
  if (!campaign) return null;
  return <div className="modal-backdrop"><motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="modal large-modal"><div className="modal-image"><img src={campaign.image} alt={campaign.title} /><button className="close" onClick={onClose}><X /></button></div><div className="modal-grid"><div><span className="tag">{campaign.category}</span><h1>{campaign.title}</h1><p className="muted">By {campaign.owner} · {campaign.location}</p><p className="modal-summary">{campaign.summary}</p><h2>Project Updates</h2>{campaign.updates.map((u, i) => <p className="update" key={i}>{u}</p>)}</div><Card className="donate-box"><h2>{currency(campaign.raised)}</h2><p>raised of {currency(campaign.goal)} goal</p><ProgressBar value={getFundingPercent(campaign)} /><div className="mini-stats"><span><strong>{campaign.backers}</strong>Backers</span><span><strong>{campaign.daysLeft}</strong>Days Left</span></div><Button size="lg" className="full" onClick={() => onDonate(campaign)}>Donate Now</Button></Card></div></motion.div></div>;
}

function DonateModal({ campaign, onClose, onSubmit }) {
  const [amount, setAmount] = useState(50);
  const [name, setName] = useState('Guest Donor');
  if (!campaign) return null;
  function submit() { if (Number(amount) > 0) onSubmit(campaign.id, Number(amount), name); }
  return <div className="modal-backdrop"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="modal donate-modal"><div className="row-between"><div><h2>Support this campaign</h2><p className="muted">{campaign.title}</p></div><button className="close light" onClick={onClose}><X /></button></div><div className="amount-grid">{[25, 50, 100].map(v => <button key={v} className={amount === v ? 'selected' : ''} onClick={() => setAmount(v)}>${v}</button>)}</div><label>Your name<input value={name} onChange={e => setName(e.target.value)} /></label><label>Custom amount<input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></label><div className="demo-note">This is a demo payment module. In production, it can connect with Stripe, PayPal, or a banking payment gateway.</div><Button size="lg" className="full" onClick={submit}>Confirm Demo Donation</Button></motion.div></div>;
}

function Footer() { return <footer><div className="container footer-inner"><p>© 2026 FundBridge. Academic project demo.</p><p>Built for Principles of Software Systems.</p></div></footer>; }

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [campaigns, setCampaigns] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialCampaigns; } catch { return initialCampaigns; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationCampaign, setDonationCampaign] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY); }, [user]);

  function handleCreate(form) {
    const newCampaign = { id: Date.now(), title: form.title.trim(), category: form.category, owner: user?.name || 'Demo Project Owner', location: form.location || 'Not specified', goal: Number(form.goal), raised: 0, daysLeft: 30, image: form.image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', summary: form.summary.trim(), updates: ['Campaign has been created and is ready for supporters.'], backers: 0, status: 'Active' };
    setCampaigns(current => [newCampaign, ...current]);
    setActivePage('campaigns');
  }
  function handleDonation(id, amount) {
    setCampaigns(current => current.map(c => c.id === id ? { ...c, raised: Number(c.raised) + amount, backers: Number(c.backers) + 1, updates: [`A new demo donation of ${currency(amount)} was received.`, ...c.updates] } : c));
    setDonationCampaign(null); setSelectedCampaign(null); setActivePage('dashboard');
  }
  function handleDeleteCampaign(id) { if (confirm('Delete this campaign from the demo?')) setCampaigns(current => current.filter(c => c.id !== id)); }
  function handleAddUpdate(id, text) { setCampaigns(current => current.map(c => c.id === id ? { ...c, updates: [text, ...c.updates] } : c)); }
  function handleLogout() { setUser(null); setActivePage('home'); }

  return <div className="app">
    <Header activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout} />
    {activePage === 'home' && <HomePage campaigns={campaigns} setActivePage={setActivePage} onOpen={setSelectedCampaign} onDonate={setDonationCampaign} />}
    {activePage === 'campaigns' && <CampaignsPage campaigns={campaigns} onOpen={setSelectedCampaign} onDonate={setDonationCampaign} />}
    {activePage === 'create' && <CreateCampaignPage onCreate={handleCreate} />}
    {activePage === 'dashboard' && <DashboardPage campaigns={campaigns} onDeleteCampaign={handleDeleteCampaign} onAddUpdate={handleAddUpdate} />}
    {activePage === 'login' && <LoginPage setActivePage={setActivePage} onLogin={setUser} />}
    <Footer />
    <CampaignDetailsModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} onDonate={setDonationCampaign} />
    <DonateModal campaign={donationCampaign} onClose={() => setDonationCampaign(null)} onSubmit={handleDonation} />
  </div>;
}
