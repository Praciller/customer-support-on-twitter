/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Brutalist color palette - only black, white, and light gray
      colors: {
        'brutal-black': '#000000',
        'brutal-white': '#FFFFFF',
        'brutal-gray': '#F5F5F5',
      },
      // Brutalist typography - monospace fonts only
      fontFamily: {
        'mono': ['Courier New', 'Monaco', 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier', 'monospace'],
      },
      // Brutalist spacing - only specific increments
      spacing: {
        '20': '20px',
        '40': '40px', 
        '60': '60px',
        '80': '80px',
        '100': '100px',
        '120': '120px',
      },
      // Brutalist borders - thick black borders only
      borderWidth: {
        '2': '2px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      // No border radius - brutalist design
      borderRadius: {
        'none': '0px',
      },
      // Grid layouts for brutalist structure
      gridTemplateColumns: {
        'brutal-main': '1fr',
        'brutal-form': '1fr 1fr',
        'brutal-results': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      // Brutalist box shadows - none allowed
      boxShadow: {
        'none': 'none',
      },
      // Animation - instant transitions only
      transitionDuration: {
        '0': '0ms',
      },
    },
    // Override default values to enforce brutalist principles
    borderRadius: {
      'none': '0px',
    },
    boxShadow: {
      'none': 'none',
    },
    // Restrict color palette
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
      gray: {
        100: '#F5F5F5',
        900: '#000000',
      },
    },
  },
  plugins: [],
  // Disable features that go against brutalist principles
  corePlugins: {
    borderRadius: false,
    boxShadow: false,
    gradientColorStops: false,
    backgroundImage: false,
  }
}
