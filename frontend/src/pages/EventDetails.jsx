import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, User, ArrowLeft, Ticket, Edit } from 'lucide-react';
import { toast } from 'sonner';
import LocationMap from '@/components/LocationMap';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EventDetails = () => {
  const { id } = useParams();
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEvent();
    fetchTicketTypes();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API}/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketTypes = async () => {
    try {
      const response = await axios.get(`${API}/events/${id}/ticket-types`);
      setTicketTypes(response.data);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      login();
      return;
    }

    if (!selectedTicketType) {
      toast.error('Please select a ticket type');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    try {
      setBooking(true);
      const response = await axios.post(
        `${API}/bookings`,
        {
          event_id: id,
          ticket_type_id: selectedTicketType,
          quantity: parseInt(quantity)
        },
        { withCredentials: true }
      );

      const { booking: newBooking, requires_payment } = response.data;

      if (requires_payment) {
        // Redirect to payment
        const checkoutResponse = await axios.post(
          `${API}/bookings/checkout`,
          {
            booking_id: newBooking.id,
            origin_url: window.location.origin
          },
          { withCredentials: true }
        );
        window.location.href = checkoutResponse.data.url;
      } else {
        // Free ticket - booking confirmed
        toast.success('Booking confirmed!');
        setShowBookingDialog(false);
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.detail || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailableTickets = (ticketType) => {
    return ticketType.quantity_available - ticketType.quantity_sold;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) return null;

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  const canEditEvent = user && (user.role === 'admin' || event.creator_id === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            data-testid="back-to-events-btn"
            onClick={() => navigate('/events')}
            variant="ghost"
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          
          {canEditEvent && (
            <Button
              onClick={() => navigate(`/edit-event/${event.id}`)}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="h-80 bg-gradient-to-br from-blue-400 to-purple-500 relative">
            {event.image_url ? (
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full font-semibold text-gray-700 dark:text-gray-200">
              {event.category}
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
            
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mb-6">
              <User className="w-5 h-5" />
              <span>Organized by <span className="font-semibold">{event.creator_name}</span></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Capacity</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.capacity} attendees</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About This Event</h2>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>

            {/* Location Map */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Location</h2>
              <LocationMap location={event.location} className="shadow-lg" />
            </div>

            {ticketTypes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tickets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ticketTypes.map((ticket) => {
                    const available = getAvailableTickets(ticket);
                    return (
                      <div
                        key={ticket.id}
                        data-testid={`ticket-type-${ticket.id}`}
                        className="p-5 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{ticket.name}</h3>
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {ticket.price === 0 ? 'FREE' : `₹${ticket.price.toFixed(2)}`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {available > 0 ? `${available} tickets available` : 'Sold out'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Button
              data-testid="book-tickets-btn"
              onClick={() => {
                if (!user) {
                  login();
                } else {
                  setShowBookingDialog(true);
                }
              }}
              disabled={ticketTypes.length === 0 || ticketTypes.every(t => getAvailableTickets(t) === 0)}
              className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
            >
              <Ticket className="w-5 h-5 mr-2" />
              {user ? 'Book Tickets' : 'Sign In to Book'}
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent data-testid="booking-dialog" className="max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Book Tickets</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">Select ticket type and quantity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Ticket Type</label>
              <Select value={selectedTicketType || undefined} onValueChange={setSelectedTicketType}>
                <SelectTrigger data-testid="ticket-type-select" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {ticketTypes
                    .filter(t => getAvailableTickets(t) > 0)
                    .map((ticket) => (
                      <SelectItem key={ticket.id} value={ticket.id} className="dark:text-white">
                        {ticket.name} - {ticket.price === 0 ? 'FREE' : `₹${ticket.price.toFixed(2)}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Quantity</label>
              <Input
                data-testid="quantity-input"
                type="number"
                min="1"
                max={selectedTicket ? getAvailableTickets(selectedTicket) : 1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            {selectedTicket && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between text-sm mb-1 text-gray-900 dark:text-gray-100">
                  <span>Ticket Price:</span>
                  <span className="font-semibold">₹{selectedTicket.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2 text-gray-900 dark:text-gray-100">
                  <span>Quantity:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                    <span>Total:</span>
                    <span className="text-blue-600 dark:text-blue-400">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            <Button
              data-testid="confirm-booking-btn"
              onClick={handleBooking}
              disabled={booking || !selectedTicketType}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {booking ? 'Processing...' : totalPrice === 0 ? 'Confirm Booking' : 'Proceed to Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetails;
