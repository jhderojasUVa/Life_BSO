import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CaptureButton from './CaptureButton';

describe('CaptureButton', () => {
  it('renders text and calls handler on click', () => {
    const onClick = vi.fn();

    render(<CaptureButton onClick={onClick} text="Start" />);

    const button = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
