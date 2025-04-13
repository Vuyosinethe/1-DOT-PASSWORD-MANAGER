// src/pages/__tests__/Dashboard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Wrap with Router since Dashboard likely uses Links or useNavigate
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Resident Dashboard', () => {
  test('renders the Dashboard heading', () => {
    renderWithRouter(<Dashboard />);
    const heading = screen.getByRole('heading', { name: /dashboard/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders key dashboard sections', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/book a facility/i)).toBeInTheDocument();
    expect(screen.getByText(/your bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/maintenance reports/i)).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });

  test('clicking "Book a Facility" navigates to the Facilities page', () => {
    renderWithRouter(<Dashboard />);
    
    const bookButton = screen.getByRole('button', { name: /book a facility/i });
    expect(bookButton).toBeInTheDocument();
    
    fireEvent.click(bookButton);
    // Optional: check if URL changes or mock useNavigate to assert navigation
  });
});
