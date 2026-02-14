import { useEffect, useState, type FC } from 'react';
import { LazyLog } from 'react-lazylog';
import "./LogMonitor.css";

interface LogMonitorProps {
    log: string;
}

const LogMonitor: FC<LogMonitorProps> = ({ log }) => {
    const [logs, setLogs] = useState<string[]>(["start log monitor"]);

    useEffect(() => {
        if (!log) return;
        // 异步更新状态，避免同步 setState 警告
        const timer = setTimeout(() => {
            setLogs(prev => [...prev, log]);
        });
        return () => clearTimeout(timer);
    }, [log]);

    return (
        <div style={{ height: '100%', width: '100%' }} className='LogMonitor'>
            <LazyLog
                text={logs.join("\n")}
                follow
                lineNumbers={false}
                caseInsensitive
            />
        </div>
    );
};

export default LogMonitor;