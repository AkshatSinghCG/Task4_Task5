import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import * as api from '../services/worldBankApi.cjs';

jest.mock('../services/worldBankApi');

describe('Dashboard Component', () => {
  const mockData = {
    data: [
      {},
      [
        { date: '2020', value: 100 },
        { date: '2019', value: 90 },
      ],
    ],
  };

  beforeEach(() => {
    api.fetchIndicators.mockResolvedValue(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard and fetches data', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/World Bank Data Dashboard/i)).toBeInTheDocument();
    expect(api.fetchIndicators).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('2020')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('changes country and fetches new data', async () => {
    render(<Dashboard />);
    const select = screen.getByLabelText(/Country:/i);
    fireEvent.change(select, { target: { value: 'US' } });
    expect(api.fetchIndicators).toHaveBeenCalledWith('US', expect.any(String), expect.any(String));
  });

  it('toggles theme when button is clicked', () => {
    render(<Dashboard />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    fireEvent.click(btn);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    fireEvent.click(btn);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });
});
