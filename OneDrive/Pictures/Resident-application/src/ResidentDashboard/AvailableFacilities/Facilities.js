// src/pages/Facilities.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  InputLabel,
  Paper,
  Select,
  Table,
  Card,
  Toolbar,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CardActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [loading, setLoading] = useState(true);

  const timeSlots = ['06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '15:00 - 16:00'];

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/facilities');
        if (response.data.success) {
          setFacilities(response.data.data);
        } else {
          console.error('Failed to fetch facilities:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setPurpose('');
    setAttendees(1);
  };

  const handleBookClick = (facility) => {
    setSelectedFacility(facility);
    setOpen(true);
  };

  const handleSubmitBooking = () => {
    setConfirmOpen(true);
    setOpen(false);
  };

  const handleConfirmBooking = () => {
    setConfirmOpen(false);
    alert('Booking Confirmed!');
    handleClose();
  };

   if (loading) {
      return (
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <CircularProgress size={80} thickness={5} />
            <Typography variant="h6" mt={3} color="primary">
              Fetching Facilities...
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Please wait while we load the Facilities.
            </Typography>
          </Paper>
        </Box>
      );
    }
  
  return (
    <>
      <Toolbar>
                    <Typography
                          variant="h4"
                          sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            color: 'brown',
                            letterSpacing: 1,
                          }}
                        >
                          iReserve
                      </Typography>
                      <Button
                        sx={{
                          color: 'blue',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 255, 0.08)',
                          },
                        }}
                        onClick={() => navigate('/dashboard')}
                      >
                        Dashboard
                      </Button>
                      <Button
                        sx={{
                          color: 'blue',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 255, 0.08)',
                          },
                        }}
                        onClick={() => navigate('/facilities')}
                      >
                        Facilities
                      </Button>
                      <Button
                        sx={{
                          color: 'blue',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 255, 0.08)',
                          },
                        }}
                        onClick={() => navigate('/maintenance')}
                      >
                        Maintenance
                      </Button>
                      <Button
                        sx={{
                          color: 'blue',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 255, 0.08)',
                          },
                        }}
                        onClick={() => navigate('/events')}
                      >
                        Events
                      </Button>
                    
      </Toolbar>


      <Box p={4}>
        <Grid container spacing={3} padding={3}>
          {facilities.map((f) => (
            <Grid item xs={12} md={4} key={f.facility_id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 4,
                  transition: '0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {f.name}
                    </Typography>
                    {f.status === 'maintenance' && (
                      <Chip label="Under Maintenance" color="error" size="small" />
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{f.location}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {f.open_time?.slice(0, 5)} - {f.close_time?.slice(0, 5)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <GroupIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">Capacity: {f.capacity}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{f.type}</Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={f.status === 'maintenance'}
                    sx={{
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#333' },
                    }}
                    onClick={() => handleBookClick(f)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Book {selectedFacility?.name}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              type="date"
              label="Select Date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{ my: 2 }}
            />
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Select Time Slot</InputLabel>
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                label="Select Time Slot"
              >
                {timeSlots.map((slot, idx) => (
                  <MenuItem key={idx} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Purpose"
              multiline
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              sx={{ my: 2 }}
            />
            <TextField
              fullWidth
              label={`Number of Attendees (Max: ${selectedFacility?.capacity})`}
              type="number"
              inputProps={{ min: 1, max: selectedFacility?.capacity }}
              value={attendees}
              onChange={(e) =>
                setAttendees(Math.min(selectedFacility?.capacity, parseInt(e.target.value) || 1))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmitBooking}
              sx={{ backgroundColor: 'black', color: 'white' }}
            >
              Submit Booking
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogContent>
            <Card sx={{ p: 2, borderRadius: 3 }}>
              <CardContent>
                <Typography><strong>Facility:</strong> {selectedFacility?.name}</Typography>
                <Typography><strong>Date:</strong> {selectedDate}</Typography>
                <Typography><strong>Time:</strong> {selectedTime}</Typography>
                <Typography><strong>Purpose:</strong> {purpose}</Typography>
                <Typography><strong>Attendees:</strong> {attendees}</Typography>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={handleConfirmBooking}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Facilities;
