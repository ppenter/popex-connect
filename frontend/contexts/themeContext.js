import React from "react";

export const ThemeContext = React.createContext({
  mode: "light",
  theme: null,
  switchTheme: () => null,
});

export const ThemeContextProvider = (props) => {
  const [mode, setMode] = React.useState("dark");

  const lightTheme = {
    dark: false,
    colors: {
      // primary: "#FE2472",
      primary: "#6792FF",
      secondary: "#84ABFF",
      text: "#000000",
      background: "#FFFFFF",
      button: "#625ECA",
      card: "#FFFFFF",
      search: "#2C2C2C",
      notification: "#FC7750",
      border: "transparent",
      disable: "#A0A1A5",
    },
  };

  const darkTheme = {
    dark: true,
    colors: {
      ...lightTheme.colors,
      text: "#FFFFFF",
      // background: "#0E0B1F",
      background: "#0E0B1F",
      card: "#242732",
    },
  };

  const switchTheme = () => {
    if (mode == "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const value = {
    mode: mode,
    theme: mode == "light" ? lightTheme : darkTheme,
    switchTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => React.useContext(ThemeContext);
