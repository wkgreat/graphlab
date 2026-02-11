import React, { type FC } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import './Sidebar.css'; // 引入上面的 CSS

export interface SiderbarPorps {
    title: string
    description: string
    children: React.ReactNode
}

const Sidebar: FC<SiderbarPorps> = (props) => {
    // 控制侧边栏状态
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>

            {/* 触发按钮 */}
            <Dialog.Trigger asChild>
                <button className="IconButton" style={{ position: 'relative', top: 0, right: 0 }}>
                    <HamburgerMenuIcon width={24} height={24} />
                </button>
            </Dialog.Trigger>

            {/* Portal 确保组件渲染在 body 的最末端，避免 z-index 问题 */}
            <Dialog.Portal>

                {/* 遮罩层 */}
                <Dialog.Overlay className="SidebarOverlay" />

                {/* 内容层 */}
                <Dialog.Content className="SidebarContent">

                    <Dialog.Title className="SidebarTitle">
                        {props.title}
                    </Dialog.Title>

                    <Dialog.Description className="SidebarDescription">
                        {props.description}
                    </Dialog.Description>

                    {/* 这里可以放入你的 React Complex Tree */}
                    <div style={{ marginTop: '20px' }}>
                        {props.children}
                    </div>

                    {/* 关闭按钮 */}
                    <Dialog.Close asChild>
                        <button className="IconButton" aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Sidebar;

interface SidebarDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children: React.ReactNode;
}

export const SidebarDrawer: FC<SidebarDrawerProps> = ({ isOpen, onOpenChange, title, children }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="SidebarOverlay" />
                <Dialog.Content className="SidebarContent">

                    <div className="SidebarHeader">
                        <Dialog.Title className="SidebarTitle">{title}</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="SidebarBody">
                        {children}
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};