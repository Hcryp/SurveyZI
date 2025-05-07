/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
  "./index.html",
  "./resources/**/*.{js,ts,jsx,tsx}",
],
theme: {
  extend: {
    colors: {
      primary: {
        '50': '#ecfdf5',
        '100': '#d1fae5',
        '200': '#a7f3d0',
        '300': '#6ee7b7',
        '400': '#34d399',
        '500': '#021c13',
        '600': '#059669',
        '700': '#047857',
        '800': '#065f46',
        '900': '#064e3b',
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        '50': '#f0f7ff',
        '100': '#d6ecff',
        '200': '#addcff',
        '300': '#7fc9ff',
        '400': '#50b5ff',
        '500': '#1f93ff',
        '600': '#1677cc',
        '700': '#105c99',
        '800': '#0a4066',
        '900': '#042633',
        '950': '#02141a',
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      accent: {
        '50': '#fefce8',
        '100': '#fef9c3',
        '200': '#fef08a',
        '300': '#fde047',
        '400': '#facc15',
        '500': '#eab308',
        '600': '#ca8a04',
        '700': '#a16207',
        '800': '#854d0e',
        '900': '#713f12',
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      success: {
        '50': '#ecfdf5',
        '500': '#10b981',
        '600': '#059669'
      },
      warning: {
        '50': '#fffbeb',
        '500': '#f59e0b',
        '600': '#d97706'
      },
      error: {
        '50': '#fef2f2',
        '500': '#ef4444',
        '600': '#dc2626'
      },
      info: {
        '50': '#eff6ff',
        '500': '#3b82f6',
        '600': '#2563eb'
      },
      surface: {
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#e5e5e5',
        '300': '#d4d4d4',
        '400': '#a3a3a3',
        '500': '#737373',
        '600': '#525252',
        '700': '#404040',
        '800': '#262626',
        '900': '#171717'
      },
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      chart: {
        '1': 'hsl(var(--chart-1))',
        '2': 'hsl(var(--chart-2))',
        '3': 'hsl(var(--chart-3))',
        '4': 'hsl(var(--chart-4))',
        '5': 'hsl(var(--chart-5))'
      }
    },
    fontFamily: {
      sans: [
        'Plus Jakarta Sans',
        'system-ui',
        'sans-serif'
      ],
      jakarta: [
        'Plus Jakarta Sans',
        'system-ui',
        'sans-serif'
      ],
      display: [
        'Plus Jakarta Sans',
        'sans-serif'
      ]
    },
    borderRadius: {
      '4xl': '2rem',
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    boxShadow: {
      neumorph: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
      'neumorph-dark': '20px 20px 60px #1a1a1a, -20px -20px 60px #242424',
      glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      'button-3d': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025), inset 0 -8px 0 -4px rgba(0, 0, 0, 0.05)',
      'button-3d-hover': '0 12px 20px -3px rgba(0, 0, 0, 0.05), 0 8px 14px -2px rgba(0, 0, 0, 0.025), inset 0 -10px 0 -4px rgba(0, 0, 0, 0.05)',
      'button-3d-active': '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 2px 2px -1px rgba(0, 0, 0, 0.04), inset 0 -2px 0 -1px rgba(0, 0, 0, 0.03)',
      'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
      soft: '0 4px 15px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03)',
      'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.04), 0 5px 15px rgba(0, 0, 0, 0.03)'
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.5s ease-out',
      'slide-down': 'slideDown 0.5s ease-out',
      'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'bounce-slow': 'bounce 3s ease-in-out infinite',
      float: 'float 6s ease-in-out infinite',
      'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'
    },
    keyframes: {
      fadeIn: {
        '0%': {
          opacity: '0'
        },
        '100%': {
          opacity: '1'
        }
      },
      slideUp: {
        '0%': {
          transform: 'translateY(10px)',
          opacity: '0'
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: '1'
        }
      },
      slideDown: {
        '0%': {
          transform: 'translateY(-10px)',
          opacity: '0'
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: '1'
        }
      },
      float: {
        '0%, 100%': {
          transform: 'translateY(0)'
        },
        '50%': {
          transform: 'translateY(-20px)'
        }
      },
      pulse: {
        '0%, 100%': {
          opacity: '1'
        },
        '50%': {
          opacity: '0.5'
        }
      },
      ping: {
        '75%, 100%': {
          transform: 'scale(2)',
          opacity: '0'
        }
      }
    },
    backgroundImage: {
      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      'gradient-3d-blue': 'linear-gradient(145deg, #2563eb, #3b82f6)',
      'gradient-3d-green': 'linear-gradient(145deg, #059669, #10b981)',
      'gradient-3d-purple': 'linear-gradient(145deg, #7c3aed, #8b5cf6)',
      'gradient-3d-orange': 'linear-gradient(145deg, #ea580c, #f97316)',
      'gradient-3d-teal': 'linear-gradient(145deg, #0d9488, #14b8a6)',
      'gradient-3d-yellow': 'linear-gradient(145deg, #ca8a04, #eab308)',
      'aurora-green': 'linear-gradient(120deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.4) 50%, rgba(6, 95, 70, 0.2) 100%)',
      'aurora-blue': 'linear-gradient(120deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.4) 50%, rgba(30, 64, 175, 0.2) 100%)',
      'aurora-yellow': 'linear-gradient(120deg, rgba(234, 179, 8, 0.8) 0%, rgba(202, 138, 4, 0.4) 50%, rgba(161, 98, 7, 0.2) 100%)',
      'mesh-1': 'radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(234, 179, 8, 0.1) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%)',
      'mesh-2': 'radial-gradient(at 20% 30%, rgba(16, 185, 129, 0.15) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 70% 70%, rgba(234, 179, 8, 0.15) 0px, transparent 50%)'
    }
  }
},
plugins: [
  require("daisyui"),
  require("tailwindcss-animate")
],
daisyui: {
  themes: [
    {
      mytheme: {
        "primary": "#021c13",
        "secondary": "#1f93ff",
        "accent": "#eab308",
        "neutral": "#2a323c",
        "base-100": "#ffffff",
        "info": "#3b82f6",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#ef4444",
      },
    },
    "light",
    "dark",
  ],
},
} 