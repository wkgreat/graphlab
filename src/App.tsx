import "@radix-ui/themes/styles.css";
import { DemoList } from './components/DemoList';
import './App.css';
import { Box, Grid, Theme } from "@radix-ui/themes";
import { GRAPHLAB_DEMOS } from "./demo";

export default function App() {

  return <Theme appearance="dark" radius="none">

    <Grid columns="20% 80%" height="100vh" className="ClsGrid">
      <Box className="ClsGridColumn">
        <DemoList></DemoList>
      </Box>
      <Box className="ClsGridColumn">
        <iframe id='demo-frame' src={GRAPHLAB_DEMOS[0].url}></iframe>
      </Box>
    </Grid>
  </Theme>;
}