import React, { useEffect, useState } from 'react'

export default function RemoteHoursUntil() {
    const [hoursDiff, setHoursDiff] = useState<number | null>(null);

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
            const target = Date.UTC(2026, 2, 4, 13, 0, 0);
            const diffMs = target - now;
            const diffHours = diffMs / (1000 * 60 * 60);
            setHoursDiff(diffHours);
        } catch (err) {
            setHoursDiff(null);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchRemoteTime();
            const id = setInterval(fetchRemoteTime, 60 * 1000);
            return () => clearInterval(id);
        }, 1000);
    }, []);

    if (hoursDiff == null) return <div className='flex flex-col items-center'>
        <div className='text-primary font-extrabold text-sm md:text-base tracking-wider mb-2'>BOOST 2X</div>
        <div className='text-sm text-muted'>
            {'--:-- until the end of the boost, and receive 2x more rewards'}
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

    const text = future ? `${human} until the end of the boost, and receive 2x more rewards` : `Boost ended ${human} ago`;

    return (
        <div className='flex flex-col items-center'>
            <div className='text-primary font-extrabold text-sm md:text-base tracking-wider mb-2'>BOOST 2X</div>
            <div className='text-sm text-muted'>
                {text}
            </div>
        </div>
    );
}
