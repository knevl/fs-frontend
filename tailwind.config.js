export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pixelGreen: '#00FF00',
        pixelBlue: '#0000FF',
        pixelRed: '#FF0000',
        pixelGray: '#808080',
        pixelBlack: '#000000',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '1rem',
        base: '1.25rem',
        lg: '1.5rem',
      },
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
      },
    },
  },
  plugins: [],
};
