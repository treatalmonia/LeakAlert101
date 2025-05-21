import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Added Label import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronLeft, User, MapPin, Search, Filter, Layers, LocateFixed, ZoomIn, ZoomOut, List } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockLeaks = [
  { id: 1, address: '123 Rizal St, Brgy. Poblacion', severity: 'Emergency', status: 'Pending', time: '2 hours ago', lat: 14.5995, lng: 120.9842, photo: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530' },
  { id: 2, address: '456 Mabini Ave, Brgy. San Jose', severity: 'Major', status: 'In-progress', time: '1 day ago', lat: 14.6050, lng: 120.9900, photo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a' },
  { id: 3, address: '789 Bonifacio Drive, Brgy. Sta. Cruz', severity: 'Minor', status: 'Resolved', time: '3 days ago', lat: 14.5950, lng: 120.9780, photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' },
  { id: 4, address: '101 Aguinaldo Hwy, Brgy. Uno', severity: 'Major', status: 'Pending', time: '5 hours ago', lat: 14.6100, lng: 120.9800, photo: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9' },
];

const severityColors = {
  Emergency: 'bg-red-500',
  Major: 'bg-orange-500',
  Minor: 'bg-green-500',
  Resolved: 'bg-gray-500',
};
const severityTextColors = {
  Emergency: 'text-red-400',
  Major: 'text-orange-400',
  Minor: 'text-green-400',
  Resolved: 'text-gray-400',
};

const MapPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ severity: 'all', status: 'all', time: 'all' });
  const [selectedLeak, setSelectedLeak] = useState(null);
  const [mapType, setMapType] = useState('street'); // street or satellite
  const [filteredLeaks, setFilteredLeaks] = useState(mockLeaks);

  useEffect(() => {
    let leaks = mockLeaks;
    if (searchTerm) {
      leaks = leaks.filter(leak => leak.address.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filters.severity !== 'all') {
      leaks = leaks.filter(leak => leak.severity.toLowerCase() === filters.severity);
    }
    if (filters.status !== 'all') {
      leaks = leaks.filter(leak => leak.status.toLowerCase().replace('-', '') === filters.status.replace('-', ''));
    }
    // Time filter logic would be more complex, simplified for now
    setFilteredLeaks(leaks);
  }, [searchTerm, filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handlePinClick = (leak) => {
    setSelectedLeak(leak);
  };
  
  const MapPlaceholder = () => (
    <div className="w-full h-full bg-slate-700/50 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-slate-600">
      <MapPin className="h-24 w-24 text-purple-400 opacity-30" />
      <p className="absolute bottom-4 text-slate-400 text-sm">Map Area (OpenStreetMap integration pending)</p>
      {filteredLeaks.map((leak, index) => (
        <motion.div
          key={leak.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`absolute p-1 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform ${severityColors[leak.severity]}`}
          style={{ 
            top: `${20 + (index * 15)}%`, 
            left: `${20 + (index * 10)}%`, 
            transform: 'translate(-50%, -50%)' 
          }}
          onClick={() => handlePinClick(leak)}
        >
          <MapPin className="h-5 w-5 text-white" />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md shadow-lg"
      >
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-yellow-400">Map of Leaks</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
              <User className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-slate-800 border-slate-700 text-slate-200 mr-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">User Profile</h4>
                <p className="text-sm text-slate-400">Profile actions here.</p>
              </div>
              <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300">
                Settings
              </Button>
              <Button variant="destructive" className="w-full">Logout</Button>
            </div>
          </PopoverContent>
        </Popover>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-grow pt-20 p-4 flex flex-col md:flex-row gap-4">
        {/* Map Section */}
        <div className="flex-grow h-[calc(100vh-10rem)] md:h-auto md:flex-[3] relative">
          <MapPlaceholder />
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <Button variant="outline" size="icon" className="bg-slate-800/80 border-slate-600 hover:bg-slate-700" onClick={() => toast({ title: 'Re-centering map...' })}>
              <LocateFixed className="h-5 w-5 text-purple-400" />
            </Button>
            <Button variant="outline" size="icon" className="bg-slate-800/80 border-slate-600 hover:bg-slate-700" onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}>
              <Layers className="h-5 w-5 text-purple-400" />
            </Button>
            <Button variant="outline" size="icon" className="bg-slate-800/80 border-slate-600 hover:bg-slate-700" onClick={() => toast({ title: 'Zooming In...' })}>
              <ZoomIn className="h-5 w-5 text-purple-400" />
            </Button>
            <Button variant="outline" size="icon" className="bg-slate-800/80 border-slate-600 hover:bg-slate-700" onClick={() => toast({ title: 'Zooming Out...' })}>
              <ZoomOut className="h-5 w-5 text-purple-400" />
            </Button>
          </div>
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-800/80 p-2 rounded-md border border-slate-600 text-xs">
            <h4 className="font-semibold mb-1 text-slate-300">Legend:</h4>
            {Object.entries(severityColors).map(([key, colorClass]) => (
              <div key={key} className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
                <span className="text-slate-400">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar + List (Sidebar on Desktop, Sheet on Mobile) */}
        <div className="md:flex-[1] md:max-w-sm">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex flex-col gap-4 p-4 bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg h-full">
            <FilterAndSearchPanel 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              filters={filters} 
              handleFilterChange={handleFilterChange}
            />
            <LeakListPanel leaks={filteredLeaks} handlePinClick={handlePinClick} />
          </div>
          {/* Mobile Sheet Trigger */}
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <List className="mr-2 h-5 w-5" /> Filters & List
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-slate-800/90 border-slate-700 text-white h-[75vh] flex flex-col">
                <SheetHeader className="mb-2">
                  <SheetTitle className="text-yellow-400">Filters & Reported Leaks</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto flex-grow pr-2">
                  <FilterAndSearchPanel 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    filters={filters} 
                    handleFilterChange={handleFilterChange}
                    isMobile={true}
                  />
                  <LeakListPanel leaks={filteredLeaks} handlePinClick={handlePinClick} isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </main>

      {/* Leak Info Popup (Modal) */}
      {selectedLeak && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedLeak(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700"
          >
            <CardHeader className="p-0 mb-4">
              <CardTitle className={`text-2xl ${severityTextColors[selectedLeak.severity]}`}>{selectedLeak.severity} Leak</CardTitle>
              <CardDescription className="text-slate-400">{selectedLeak.address}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {selectedLeak.photo && (
                <img-replace alt={`Leak at ${selectedLeak.address}`} className="w-full h-48 object-cover rounded-md mb-3 border border-slate-600" />
              )}
              <p className="text-sm text-slate-300"><strong className="text-slate-100">Status:</strong> {selectedLeak.status}</p>
              <p className="text-sm text-slate-300"><strong className="text-slate-100">Reported:</strong> {selectedLeak.time}</p>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => { toast({ title: 'Viewing full report...' }); setSelectedLeak(null); }}>
                View Full Report (Soon)
              </Button>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
      <footer className="text-center py-4 text-slate-500 text-xs bg-slate-900/50">
        <p>&copy; {new Date().getFullYear()} LeakAlert. Map data &copy; OpenStreetMap contributors.</p>
      </footer>
    </div>
  );
};

const FilterAndSearchPanel = ({ searchTerm, setSearchTerm, filters, handleFilterChange, isMobile = false }) => (
  <div className={`space-y-4 ${isMobile ? 'p-2' : ''}`}>
    <div>
      <Label htmlFor="search-map" className="text-slate-300">Search Location</Label>
      <div className="relative mt-1">
        <Input
          id="search-map"
          type="text"
          placeholder="Barangay, street, landmark..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <Label htmlFor="filter-severity" className="text-slate-300">Severity</Label>
        <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
          <SelectTrigger id="filter-severity" className="w-full mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="major">Major</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="filter-status" className="text-slate-300">Status</Label>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger id="filter-status" className="w-full mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inprogress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div>
      <Label htmlFor="filter-time" className="text-slate-300">Time Period</Label>
      <Select value={filters.time} onValueChange={(value) => handleFilterChange('time', value)}>
        <SelectTrigger id="filter-time" className="w-full mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500">
          <SelectValue placeholder="All Time" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="last7days">Last 7 Days</SelectItem>
          <SelectItem value="custom">Custom (Soon)</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300">
      <Filter className="mr-2 h-4 w-4" /> Apply Filters
    </Button>
  </div>
);

const LeakListPanel = ({ leaks, handlePinClick, isMobile = false }) => (
  <div className={`mt-4 ${isMobile ? '' : 'flex-grow overflow-y-auto pr-1'}`}>
    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Reported Leaks ({leaks.length})</h3>
    {leaks.length === 0 && <p className="text-slate-400 text-sm">No leaks match your current filters.</p>}
    <div className="space-y-3">
      {leaks.map(leak => (
        <motion.div
          key={leak.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            className="bg-slate-700/60 border-slate-600 hover:border-purple-500/70 cursor-pointer transition-all hover:shadow-purple-500/10"
            onClick={() => handlePinClick(leak)}
          >
            <CardContent className="p-3 text-xs">
              <p className={`font-semibold ${severityTextColors[leak.severity]}`}>{leak.severity}</p>
              <p className="text-slate-300 truncate">{leak.address}</p>
              <p className="text-slate-400">{leak.time} - {leak.status}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);


export default MapPage;