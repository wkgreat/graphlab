import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Box, Flex } from '@radix-ui/themes';
import { GRAPHLAB_DEMOS } from '../demo';
import './styles.css';

const Content = (props) => {

    const demos = props.demos;

    return (
        <>
            {demos.map((d) => (
                <Box className="DemoOption" key={d.name} onClick={() => {
                    const frame = document.getElementById('demo-frame');
                    frame.setAttribute('src', d.url);
                }}>
                    <Box className='DemoOptionDescribe'>{d.name}</Box>
                </Box>
            ))}
        </>
    );
};

export const DemoList = () => {

    const demos = GRAPHLAB_DEMOS;

    return (
        <Flex direction="column" style={{ height: "95vh" }}>
            <SingleDemoList demos={demos}></SingleDemoList>
        </Flex>
    );

};

export const SingleDemoList = (props) => (

    <ScrollArea.Root className="ScrollAreaRoot">

        <ScrollArea.Viewport className="ScrollAreaViewport">
            <Content demos={props.demos} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
            className="ScrollAreaScrollbar"
            orientation="vertical"
        >
            <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>

        <ScrollArea.Scrollbar
            className="ScrollAreaScrollbar"
            orientation="horizontal"
        >
            <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner className="ScrollAreaCorner" />
    </ScrollArea.Root>

);