/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fundo suave - rosa/lilás bem claro
        soft: {
          50: '#FDF5F7',    // fundo principal (rosa quase branco)
          100: '#F9E8ED',   // fundo cards hover
          200: '#F7C2CA',   // rosa claro da paleta
          300: '#F6A5C0',   // rosa da paleta
          400: '#E890AF',
          500: '#D47A9A',
        },
        // Rosa / Pink principal
        wine: {
          50: '#FEF0F4',
          100: '#FBD9E2',
          200: '#F7C2CA',   // rosa claro
          300: '#F6A5C0',   // rosa
          400: '#CC8DB3',   // rosa lilás
          500: '#B86B9A',   // rosa forte
          600: '#9D4D80',
          700: '#7E3566',
        },
        // Lilás / Roxo - cores de acento
        gold: {
          50: '#F5F0FA',
          100: '#EDE5F5',
          200: '#D4C5E6',   // lilás bem claro
          300: '#B9A5D4',   // lilás suave
          400: '#9D85B6',   // lilás da paleta
          500: '#837AB6',   // lilás médio da paleta
          600: '#6B5E9E',
          700: '#4A3878',
        },
        // Tons neutros com toque lilás
        warm: {
          50: '#FAF7FB',
          100: '#F0ECF3',
          200: '#E2DCE8',
          300: '#CFC7D6',
          400: '#8E7F99',
          500: '#5E4E6A',
        },
        // Verde - confiança
        sage: {
          50: '#F2FAF5',
          100: '#DCEEE3',
          200: '#B4DEC4',
          300: '#82C69E',
          400: '#58AD7C',
          500: '#3E9A66',
        },
        cream: {
          50: '#FEFCFD',
          100: '#FBF6F8',
          200: '#F7EEF1',
          300: '#F2E6EB',
        },
        // Roxo escuro principal - #250e2c
        dark: {
          900: '#250e2c',   // roxo escuro da paleta
          800: '#361A3E',
          700: '#4A2E53',
          600: '#6B4E75',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
