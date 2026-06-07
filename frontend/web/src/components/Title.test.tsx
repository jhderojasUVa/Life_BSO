import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Title from './Title';

describe('Title', () => {
  it('renders app title', () => {
    render(<Title className="title" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Life BSO' })).toBeInTheDocument();
  });
});
