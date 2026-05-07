/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //     primary: "#003663",
    //     white: "#fff",
    //     black: "#000",
    //     secondary: "#9a9a9a",
    //     orange: "#eabc3f",
    //     sidebar: "#d4d4d4",
        
    //     "gray-100": "#f1b9b9",
    // },
    extend: {
        colors: {
            // primary: "#2c9a9b",
            primary: "#ec7f8a",
            "primary-1": "#ecbac0",
            "primary-2": "#D67C85",
            "primary-3": "#F8F9FA",
            "primary-4": "#f1f1f1",
            "primary-5": "#B7D6D7",
            white: "#fff",
            black: "#000",
            secondary: "#3d3d3d",
            orange: "#eabc3f",
            "orange-hover": "#c19723",
            sidebar: "#d4d4d4",
            warning: "#ed6c02",
            error: "#ff0000",
            "error-hover": "#cc0000",
            info: "#1ba3d6",
            "info-hover": "#0e698c",
            success: "#00a300",
            "success-hover": "#007700",
        },
    },
  },
  plugins: [],
}

