import React from "react";
import EditPage from "./pages/EditPage";

const App = () => {
  return (
    <div>
      <h1>Hello</h1>
      <EditPage />
    </div>
  );
};

export default App;

// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

// import Waveform from "./components/AudioWaveform.jsx";

// export default function App() {
//   return (
//     <div>
//       <Box sx={{ flexGrow: 1 }}>
//         <AppBar position="static" style={{ marginBottom: 20 }}>
//           <Toolbar>
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               sx={{ mr: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               Semantic Sound Editor
//             </Typography>
//             <Button color="inherit">Login</Button>
//           </Toolbar>
//         </AppBar>
//       </Box>

//       <Container maxWidth="xl">
//         <Grid container spacing={3}>
//           <Grid xs={2}>GRID 1 - OPTIONS</Grid>
//           <Grid xs={8}>
//             <Waveform />
//           </Grid>
//         </Grid>
//       </Container>
//     </div>
//   );
// }
