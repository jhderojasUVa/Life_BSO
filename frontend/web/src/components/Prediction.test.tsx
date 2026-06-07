import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Prediction from './Prediction';

describe('Prediction', () => {
  it('renders prediction text when provided', () => {
    render(<Prediction prediction="Predicted object: keyboard" className="prediction" />);

    expect(screen.getByText('Predicted object: keyboard')).toBeInTheDocument();
  });

  it('renders nothing when prediction is empty', () => {
    const { container } = render(<Prediction prediction="" className="prediction" />);

    expect(container).toBeEmptyDOMElement();
  });
});
