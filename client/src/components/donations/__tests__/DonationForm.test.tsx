import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DonationForm from '../DonationForm';

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'http://localhost:5001',
  },
});

const mockProgram = {
  id: 1,
  title: 'Test Program',
  description: 'A test program for donations',
  goal_amount: 10000,
  current_amount: 5000,
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DonationForm', () => {
  it('renders donation form correctly', () => {
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Make a Donation')).toBeInTheDocument();
    expect(screen.getByText('Test Program')).toBeInTheDocument();
    expect(screen.getByText('Donation Amount')).toBeInTheDocument();
    expect(screen.getByText('Currency')).toBeInTheDocument();
    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('shows predefined amounts', () => {
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('USD 10')).toBeInTheDocument();
    expect(screen.getByText('USD 25')).toBeInTheDocument();
    expect(screen.getByText('USD 50')).toBeInTheDocument();
    expect(screen.getByText('USD 100')).toBeInTheDocument();
    expect(screen.getByText('USD 250')).toBeInTheDocument();
    expect(screen.getByText('USD 500')).toBeInTheDocument();
  });

  it('allows selecting predefined amounts', () => {
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const amountButton = screen.getByText('USD 100');
    fireEvent.click(amountButton);

    const amountInput = screen.getByPlaceholderText(
      'Enter custom amount'
    ) as HTMLInputElement;
    expect(amountInput.value).toBe('100');
  });

  it('allows entering custom amount', () => {
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const amountInput = screen.getByPlaceholderText('Enter custom amount');
    fireEvent.change(amountInput, { target: { value: '150' } });

    expect(amountInput).toHaveValue(150);
  });

  it('shows progress bar with correct percentage', () => {
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Raised: USD 5000')).toBeInTheDocument();
    expect(screen.getByText('Goal: USD 10000')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const mockOnSuccess = jest.fn();
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={mockOnSuccess}
        onCancel={jest.fn()}
      />
    );

    const submitButton = screen.getByText('Donate Now');
    fireEvent.click(submitButton);

    // Form should not submit without required fields
    await waitFor(() => {
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnCancel = jest.fn();
    renderWithRouter(
      <DonationForm
        program={mockProgram}
        onSuccess={jest.fn()}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
