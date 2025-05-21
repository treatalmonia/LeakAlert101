import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { UploadCloud, MapPin, ChevronLeft, AlertTriangle, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';


const LeakReportPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, requesting, detected, denied, error
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [manualAddressEntry, setManualAddressEntry] = useState(false);


  useEffect(() => {
    // Automatically request location when component mounts
    // or if user lands on this page directly
    // This can be triggered by a button if preferred.
    handleRequestLocation();
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    const newPreviews = [];

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: `${file.name} is not a supported image file.`,
        });
      }
    });
    setImages(prev => [...prev.slice(0, 5 - newImages.length), ...newImages].slice(0,5)); // Limit to 5 images
    setImagePreviews(prev => [...prev.slice(0, 5 - newPreviews.length), ...newPreviews].slice(0,5));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
        const updated = prev.filter((_, i) => i !== index);
        updated.forEach(preview => URL.revokeObjectURL(preview)); // Clean up old URLs
        return updated;
    });
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setAddress("Geolocation is not supported by your browser.");
      setManualAddressEntry(true);
      return;
    }
    
    setLocationStatus('requesting');
    setShowPermissionDialog(true); // Show custom dialog before OS dialog
  };
  
  const proceedWithGeolocation = () => {
    setShowPermissionDialog(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationStatus('detected');
        // Simulate reverse geocoding
        setAddress(` Approx. Location: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`);
        toast({ title: "Location Detected!", description: "Drag pin to adjust if needed." });
        setManualAddressEntry(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
          setAddress("Location access denied. Please enter manually or enable in settings.");
        } else {
          setLocationStatus('error');
          setAddress(`Error getting location: ${error.message}. Please enter manually.`);
        }
        setManualAddressEntry(true);
        toast({ variant: "destructive", title: "Location Access Failed", description: "Please enter address manually or check permissions."})
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!severity) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please select a leak severity." });
        return;
    }
    if (!address && !location) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please provide the leak location (detected or manual)." });
        return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const reportData = {
      images,
      severity,
      duration,
      notes,
      mobileNumber,
      location: location || null, // If GPS location was fetched
      address: address, // Manual or reverse-geocoded address
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for now
    const existingReports = JSON.parse(localStorage.getItem('leakReports') || '[]');
    localStorage.setItem('leakReports', JSON.stringify([...existingReports, reportData]));

    setIsSubmitting(false);
    toast({
      title: 'Report Submitted!',
      description: 'Thank you for helping us conserve water.',
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
    navigate('/'); // Navigate to homepage or a "my reports" page
  };

  const LocationMapPlaceholder = () => (
    <div className="w-full h-48 bg-slate-700/50 rounded-lg flex items-center justify-center relative border-2 border-slate-600 overflow-hidden">
      {locationStatus === 'detected' && location && (
        <>
          <MapPin className="h-10 w-10 text-red-500 z-10 transform -translate-y-1/2" />
          <p className="absolute bottom-2 text-xs text-slate-300 bg-slate-800/70 px-2 py-1 rounded">Your detected location. Drag to adjust (simulated).</p>
          <div className="absolute inset-0 bg-green-500/10">
            <img-replace alt="Map background showing a generic city area" className="w-full h-full object-cover opacity-30"/>
          </div>
        </>
      )}
      {locationStatus === 'requesting' && !showPermissionDialog && <Loader2 className="h-12 w-12 text-purple-400 animate-spin" />}
      {locationStatus === 'idle' && <p className="text-slate-400">Click button above to detect location.</p>}
      {(locationStatus === 'denied' || locationStatus === 'error') && <p className="text-red-400 p-4 text-center">{address || "Failed to get location."}</p>}
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <Header />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md shadow-lg mt-16 sm:mt-0"
      >
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-yellow-400">Report a New Leak</h1>
        <div className="w-10"></div>
      </motion.header>

      <main className="flex-grow pt-32 sm:pt-20 p-4 md:p-6 lg:p-8">
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Upload */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center"><UploadCloud className="mr-2 h-6 w-6" />Upload Photos (Optional)</CardTitle>
              <CardDescription className="text-slate-400">Add up to 5 images of the leak. Clear photos help us assess the situation faster.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button type="button" variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 py-6 text-lg" onClick={() => fileInputRef.current?.click()}>
                Select Images
              </Button>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img-replace src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md border-2 border-slate-600 group-hover:opacity-80 transition-opacity" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Location Section */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center"><MapPin className="mr-2 h-6 w-6" />Leak Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <AlertDialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
                 <AlertDialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 py-3 text-base"
                      onClick={handleRequestLocation}
                      disabled={locationStatus === 'requesting' || locationStatus === 'detected'}
                    >
                      {locationStatus === 'requesting' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {locationStatus === 'detected' ? 'Location Acquired' : 'Detect My Location'}
                    </Button>
                 </AlertDialogTrigger>
                 <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
                   <AlertDialogHeader>
                     <AlertDialogTitle className="text-yellow-400">Location Permission</AlertDialogTitle>
                     <AlertDialogDescription className="text-slate-300">
                       LeakAlert needs access to your device’s location to accurately report leaks. Your location data is used solely for this purpose.
                     </AlertDialogDescription>
                   </AlertDialogHeader>
                   <AlertDialogFooter>
                     <AlertDialogCancel 
                        className="border-slate-600 hover:bg-slate-700"
                        onClick={() => {setLocationStatus('denied'); setManualAddressEntry(true); toast({title: "Manual entry required.", description: "Location permission was not granted."})}}
                      >Deny & Enter Manually</AlertDialogCancel>
                     <AlertDialogAction 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={proceedWithGeolocation}
                      >Allow While Using App</AlertDialogAction>
                   </AlertDialogFooter>
                 </AlertDialogContent>
               </AlertDialog>

              <LocationMapPlaceholder />

              { (locationStatus === 'denied' || locationStatus === 'error' || manualAddressEntry) && (
                <div>
                  <Label htmlFor="address" className="text-slate-300">Street Address / Landmark</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Near 123 Rizal St, Brgy. Poblacion, or beside the old Mango tree"
                    className="mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 min-h-[80px]"
                    required={!location}
                  />
                </div>
              )}
              { locationStatus === 'detected' && address && 
                <p className="text-sm text-green-400 bg-green-900/30 p-2 rounded-md border border-green-700">{address}</p>
              }

            </CardContent>
          </Card>


          {/* Leak Details */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center"><AlertTriangle className="mr-2 h-6 w-6" />Leak Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-slate-300 mb-2 block text-base">Severity <span className="text-red-500">*</span></Label>
                <RadioGroup value={severity} onValueChange={setSeverity} className="flex flex-col sm:flex-row gap-4">
                  {['Minor', 'Major', 'Emergency'].map((level) => (
                    <div key={level} className="flex items-center space-x-2 flex-1">
                      <RadioGroupItem value={level} id={`severity-${level}`} className="border-slate-500 text-purple-500 focus:ring-purple-500" />
                      <Label htmlFor={`severity-${level}`} className={`text-slate-200 p-3 rounded-md border-2 flex-1 text-center cursor-pointer transition-all
                        ${severity === level ? 'bg-purple-600 border-purple-500 shadow-lg' : 'bg-slate-700/50 border-slate-600 hover:border-purple-400'} `}>
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="duration" className="text-slate-300">Leak Duration (Optional)</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 2 hours, 1 day, unsure"
                  className="mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-slate-300">Additional Notes/Comments (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nearby hazards, obstructions, specific details..."
                  className="mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="mobileNumber" className="text-slate-300">Mobile Number (Optional)</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="For follow-up via SMS or calls"
                  className="mt-1 bg-slate-700/50 border-slate-600 focus:bg-slate-700 focus:border-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              'Submit Report'
            )}
          </Button>
        </motion.form>
      </main>
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LeakAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LeakReportPage;