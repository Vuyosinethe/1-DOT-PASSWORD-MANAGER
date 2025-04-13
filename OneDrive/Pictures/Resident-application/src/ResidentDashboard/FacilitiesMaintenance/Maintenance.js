// src/pages/Maintenance.jsx
import React from 'react';
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
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const maintenanceList = [
  {
    facility: 'Swimming Pool',
    location: 'Aquatic Center',
    startDate: '2025-04-12',
    endDate: '2025-04-15',
    status: 'Scheduled',
  },
  {
    facility: 'Tennis Court 1',
    location: 'Outdoor Courts',
    startDate: '2025-04-10',
    endDate: '2025-04-13',
    status: 'In Progress',
  },
  {
    facility: 'Swimming Pool',
    location: 'Aquatic Center',
    startDate: '2025-04-12',
    endDate: '2025-04-15',
    status: 'Scheduled',
  },
  {
    facility: 'Tennis Court 1',
    location: 'Outdoor Courts',
    startDate: '2025-04-10',
    endDate: '2025-04-13',
    status: 'In Progress',
  },
  {
    facility: 'Swimming Pool',
    location: 'Aquatic Center',
    startDate: '2025-04-12',
    endDate: '2025-04-15',
    status: 'Scheduled',
  },
  {
    facility: 'Tennis Court 1',
    location: 'Outdoor Courts',
    startDate: '2025-04-10',
    endDate: '2025-04-13',
    status: 'In Progress',
  },
];

const Maintenance = () => {
  const navigate = useNavigate();
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
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Facility Maintenance
        </Typography>
        <Grid container spacing={3}>
          {maintenanceList.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BuildIcon color="warning" />
                    <Typography variant="h6" fontWeight="bold">
                      {item.facility}
                    </Typography>
                    <Chip label={item.status} color={item.status === 'In Progress' ? 'error' : 'warning'} size="small" />
                  </Box>

                  <Box mt={1} display="flex" alignItems="center">
                    <LocationOnIcon sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">{item.location}</Typography>
                  </Box>

                  <Box mt={1} display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">
                      {item.startDate} to {item.endDate}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box></>
  );
};

export default Maintenance;
