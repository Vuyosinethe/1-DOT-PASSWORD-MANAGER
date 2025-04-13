import React from 'react';

import { useNavigate } from 'react-router-dom';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Menu,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Table,
  Card,
  CssBaseline,
  Tooltip,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Popover,
  CardActions,
  List,
  Chip,
  ListItem,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CloudIcon from  '@mui/icons-material/Cloud';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { BookOpen, Pencil, Calendar, Settings } from "lucide-react";



//import FacilityIcon from '@mui/icons-material/Facility';
import ReportIcon from '@mui/icons-material/Report';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import BugReportIcon from "@mui/icons-material/BugReport";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import { Dashboard } from '@mui/icons-material';

export default function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [showFacilities, setShowFacilities] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const notifications = [
    'Your booking for Football Field was approved.',
    'Maintenance report for Badminton Court was received.',
    'Booking request for Swimming Pool was rejected.'
  ];

  const handleNotificationClick = (event) => {
    if (notificationAnchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const bookings = [
    { facility: 'Indoor Basketball Court', date: '2025-04-05', time: '10:00 - 12:00', status: 'Approved' },
    { facility: 'Football Field', date: '2025-04-07', time: '18:00 - 20:00', status: 'Approved' },
  ]; 

  const reports = [
    { facility: 'Indoor Basketball Court', issue: 'Scoreboard malfunction', status: 'Reported', priority: 'Medium' },
    { facility: 'Badminton Court', issue: 'Lighting issues', status: 'Scheduled', priority: 'Medium' },
    { facility: 'Football Field', issue: 'Sprinkler system malfunction', status: 'Reported', priority: 'Critical' },
  ];
  const quickActions = [
    {
      title: "Book a Facility",
      description: "Reserve sports facilities for your activities",
      icon: BookOpen,
      href: "/facilities",
    },
    {
      title: "Report Issue",
      description: "Report maintenance problems with facilities",
      icon: Pencil,
      href: "/maintenance",
    },
    {
      title: "View Events",
      description: "Check upcoming community events and activities",
      icon: Calendar,
      href: "/events",
    },
    {
      title: "My Profile",
      description: "View and edit your profile settings",
      icon: Settings,
      href: "/profile",
    },
  ];
  //const timeSlots = ['06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00'];

  const handleBookClick = (facility) => {
    setSelectedFacility(facility);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setPurpose('');
    setAttendees(1);
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

  const handleQuickAction = (label) => {
    if (label === 'View Events') navigate('/events');
  };

  const handleNotificationClose = (event) => {
    setNotificationAnchorEl(null);
  };
  const cards = [
    {
      title: "Facilities",
      count: "4/6",
      subtitle: "Available facilities",
      icon: <ApartmentIcon color="action" />,
    },
    {
      title: "Your Bookings",
      count: "2",
      subtitle: "Total bookings",
      icon: <CalendarTodayIcon color="action" />,
    },
    {
      title: "Your Reports",
      count: "3",
      subtitle: "Submitted reports",
      icon: <ReportIcon color="action" />,
    },
    {
      title: "Weather Alerts",
      count: "3",
      subtitle: "Active weather alerts",
      icon: <CloudIcon color="action" />,
    },
  ];
  //const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
    <CssBaseline />
    <AppBar position="static" color="default" elevation={1}>
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

                
      <Tooltip title="Notifications">
        <IconButton onClick={handleNotificationClick} color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
        <Tooltip title="Account">
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem disabled>
              <Box>
                <Typography variant="body1">John Resident</Typography>
                <Typography variant="body2" color="text.secondary">
                  john@example.com
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Log out</MenuItem>
          </Menu>
      </Toolbar>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
      <h2 className="text-lg font-semibold mb-4">Welcome!</h2>

      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="subtitle1" fontWeight={600}>
                  {card.title}
                </Typography>
                {card.icon}
              </Box>

              <Box mt={3}>
                <Typography variant="h5" fontWeight="bold">
                  {card.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Weather Alerts */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
      <Typography variant="h5" fontWeight="bold" mt={5} mb={2}>Weather Alerts</Typography>
        </Typography>
        <Grid container spacing={2} mb={3}>
          {[
            { name: "Tennis Court 1", date: "2025-04-05", label: "Rain", note: "Moderate rainfall expected. Court may be slippery." },
            { name: "Football Field", date: "2025-04-06", label: "Thunderstorm", note: "Severe thunderstorm warning. Field will be closed for safety.", color: "error" },
            { name: "Tennis Court 1", date: "2025-04-07", label: "Wind", note: "Strong winds forecasted. May affect gameplay." },
          ].map((alert) => (
            <Grid item xs={12} md={4} key={alert.name + alert.date}>
              <Paper sx={{ p: 2, backgroundColor: "#f5faff" }}>
                <Typography fontWeight="bold">{alert.name}</Typography>
                <Typography variant="body2">{alert.date}</Typography>
                <Chip
                  label={alert.label}
                  color={alert.color || "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography variant="body2" mt={1}>
                  {alert.note}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <WarningAmberIcon fontSize="small" color="warning" />
                </Box>
              </Paper>
            </Grid>

          ))}

        </Grid>
          {/* New Book a Facility button */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="outlined"
            color="white"
            onClick={() => navigate('/Facilities')} 
            sx={{
              backgroundColor: 'green',
              color: 'white',
              borderRadius: 2,
              paddingX: 3,
              textTransform: 'none',
            }}
          >
            Availabe facilities
          </Button>
        </Box>

      </AppBar> 
      <Box p={4}>

        {/* Maintenance Reports */}
        <Typography variant="h5" fontWeight="bold" mt={5} mb={2}>Your Maintenance Reports</Typography>
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Facility</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.facility}</TableCell>
                  <TableCell>{r.issue}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color={r.status === 'Reported' ? 'error' : 'primary'} sx={{ borderRadius: 5 }}>
                      {r.status}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" sx={{ backgroundColor: r.priority === 'Critical' ? 'red' : 'black', borderRadius: 5 }}>
                      {r.priority}
                    </Button>
                  </TableCell>
                </TableRow>
                
              ))}
            </TableBody>
          </Table>
        </Paper>

    {/* Your Bookings */}
        <Typography variant="h5" fontWeight="bold" mt={5} mb={2}>Your Bookings</Typography>
        <Paper variant="outlined">
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Facility</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {bookings.map((b, i) => (
                <TableRow key={i}>
                    <TableCell>{b.facility}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{b.time}</TableCell>
                    <TableCell>
                    <Button size="small" variant="outlined" color="success" sx={{ borderRadius: 5 }}>
                        {b.status}
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </Paper>

              
        {/* Booking Confirmation Dialog */}
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
          <Button variant="contained" color="success" onClick={handleConfirmBooking}>Confirm</Button>
        </DialogActions>
      </Dialog>
      
      <Grid container spacing={2} mt={5}>
        {[{
          icon: <MeetingRoomIcon fontSize="large" />, label: 'Book a Facility'
        }, {
          icon: <ReportIcon fontSize="large" />, label: 'Report Issue'
        }, {
          icon: <EventIcon fontSize="large" />, label: 'View Events'
        }, {
          icon: <PersonIcon fontSize="large" />, label: 'My Profile'
        }].map((action, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card onClick={() => handleQuickAction(action.label)} sx={{ cursor: 'pointer', textAlign: 'center', p: 2, borderRadius: 4 }}>
              <CardContent>
                {action.icon}
                <Typography variant="subtitle1" mt={1}>{action.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      </Box>
    </>
  );
}
