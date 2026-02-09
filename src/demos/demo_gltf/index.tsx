import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DemoView from "./DemoView";
import './styles.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme appearance="dark" radius="none">
            <DemoView></DemoView>
        </Theme>
    </StrictMode>,
)