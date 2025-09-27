import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies default variant classes', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  test('applies outline variant classes', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
    expect(button).toHaveClass('bg-background');
  });

  test('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  test('applies destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  test('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('hover:bg-accent');
  });

  test('applies link variant classes', () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('underline-offset-4');
  });

  test('applies small size classes', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
  });

  test('applies large size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-8');
  });

  test('applies icon size classes', () => {
    render(<Button size="icon">🔍</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  test('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
    expect(button).toHaveClass('disabled:opacity-50');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('custom-class');
  });

  test('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});
