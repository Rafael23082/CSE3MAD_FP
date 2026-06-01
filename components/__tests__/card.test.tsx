import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../card';

jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: { text: '#000', background: '#fff', card: '#f5f5f5', border: '#e0e0e0' } }),
}));

describe('Card', () => {
  it('renders metric and value', () => {
    const { getByText } = render(<Card metric="Time" value="1.5s" maximumWidth={false} />);
    expect(getByText('Time')).toBeTruthy();
    expect(getByText('1.5s')).toBeTruthy();
  });

  it('renders with full width when maximumWidth is true', () => {
    const { toJSON } = render(<Card metric="Score" value="95%" maximumWidth={true} />);
    expect(toJSON()).toBeTruthy();
  });
});
