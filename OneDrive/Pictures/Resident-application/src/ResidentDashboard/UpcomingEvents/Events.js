import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Toolbar,
  Button,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/events');
        const result = await response.json();
        if (result.success) {
          setEvents(result.data);
        } else {
          console.error('Failed to fetch events:', result.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
            Fetching events...
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Please wait while we load the latest events.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
      <><Toolbar>
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
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.event_id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {event.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mt={2}>
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {event.start_date} - {event.end_date}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {event.start_time} - {event.end_time}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mt={1}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {event.Facility?.name} ({event.Facility?.location})
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Chip
                      label={event.status.toUpperCase()}
                      color={event.status === 'upcoming' ? 'primary' : 'default'}
                      variant="outlined"
                    />
                    <Button
                      size="small"
                      sx={{ float: 'right', color: 'white', backgroundColor: 'blue', textTransform: 'none' }}
                      onClick={() => navigate(`/events`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box></>
  );
};

export default Events;
