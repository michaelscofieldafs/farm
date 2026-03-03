import React, { useEffect, useState } from 'react'

export default function RemoteHoursUntil() {
    const [hoursDiff, setHoursDiff] = useState<number | null>(null);
    const [nowMs, setNowMs] = useState<number | null>(null);
    const TARGET = Date.UTC(2026, 2, 4, 20, 0, 0);

    const formatDurationMs = (ms: number) => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    };

    const fetchRemoteTime = async () => {
        try {
            const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
            if (!res.ok) throw new Error('time fetch failed');
            const data = await res.json();
            let now: number;
            if (data.dateTime) {
                now = new Date(data.dateTime).getTime();
            } else if (typeof data.year === 'number') {
                const yr = data.year || 0;
                const mo = (data.month || 1) - 1;
                const day = data.day || 1;
                const hr = data.hour || 0;
                const min = data.minute || 0;
                const sec = data.seconds || 0;
                now = Date.UTC(yr, mo, day, hr, min, sec);
            } else {
                now = Date.now();
            }
            // store remote now and compute diff to fixed target
            setNowMs(now);
            const diffMs = TARGET - now;
            const diffHours = diffMs / (1000 * 60 * 60);
            setHoursDiff(diffHours);
        } catch (err) {
            setHoursDiff(null);
            setNowMs(null);
        }
    };

    useEffect(() => {
        let fetchId: ReturnType<typeof setInterval> | null = null;
        let tickId: ReturnType<typeof setInterval> | null = null;
        const start = async () => {
            await fetchRemoteTime();
            fetchId = setInterval(fetchRemoteTime, 60 * 1000);
            tickId = setInterval(() => {
                setNowMs(prev => {
                    if (prev == null) return prev;
                    const next = prev + 1000;
                    const diffMs = TARGET - next;
                    setHoursDiff(diffMs / (1000 * 60 * 60));
                    return next;
                });
            }, 1000);
        };
        const timer = setTimeout(start, 1000);
        return () => {
            clearTimeout(timer);
            if (fetchId) clearInterval(fetchId);
            if (tickId) clearInterval(tickId);
        };
    }, []);

    if (hoursDiff == null) return <div className='flex flex-col items-center'>
        <div className='text-primary font-extrabold text-xl md:text-3xl tracking-wider mb-2'>BOOST 2X REWARDS</div>
        <div className='text-sm text-muted'>
            {nowMs ? (
                <span className='text-red-500 font-semibold text-3xl md:text-3xl'>{formatDurationMs(TARGET - nowMs)}</span>
            ) : (
                <span className='text-red-500 font-semibold text-3xl md:text-3xl'>--:--:--</span>
            )}
        </div>
    </div>;

    const future = hoursDiff >= 0;
    const absMs = Math.abs(hoursDiff * 60 * 60 * 1000);
    const totalMinutes = Math.floor(absMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    const human = parts.length > 0 ? parts.join(' ') : '0 minutes';

    const textElement = (() => {
        if (!nowMs) return <span className='text-red-500 font-semibold'>{human}</span>;
        const remainingMs = TARGET - nowMs;
        const dur = formatDurationMs(Math.abs(remainingMs));
        if (future) {
            return (<>
                <span className='text-red-500 font-semibold text-3xl md:text-3xl'>{dur}</span>
            </>);
        }
        return (<>
            <span>{`Boost ended `}</span>
            <span className='text-red-500 font-semibold text-3xl md:text-3xl'>{dur}</span>
            <span>{` ago`}</span>
        </>);
    })();

    return (
        <div className='flex flex-col items-center'>
            <div className='text-primary font-extrabold text-xl md:text-3xl tracking-wider mb-2'>BOOST 2X REWARDS</div>
            <div className='text-sm text-muted'>
                {textElement}
            </div>
        </div>
    );
}
