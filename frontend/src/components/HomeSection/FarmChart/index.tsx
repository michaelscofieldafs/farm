'use client'

import { useAggregateChains } from '@/hooks/useAggregateChains';
import {
    bsc,
    bscTestnet,
    mainnet,
    plasma,
    plasmaTestnet,
    sepolia,
    sonic,
    sonicBlazeTestnet
} from '@reown/appkit/networks';
import { useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
// @ts-ignore
import AnimatedNumber from "animated-number-react"

const COLORS = [
    '#1E90FF', // Sonic
    '#F3BA2F', // BNB Smart Chain
    '#627EEA', // Ethereum (mainnet)
    '#00CFFF', // Plasma
    '#FF6B3A', // Sonic Blaze Testnet
    '#FFE58F', // BNB Smart Chain Testnet
    '#C695FF', // Sepolia
    '#99E6FF', // Plasma Testnet
];

export interface TableDataItem {
    chain: string;
    tvl: number;
    marketCap: number;
    supply: number;
}

export interface LineDataItem {
    month: string;
    total: number;
}

export type PieColors = string[];

export default function SavvyFarmStatisticsDashboard() {
    const { data, fetchAggregateFarmData, isLoading, isFirstLoaidng } = useAggregateChains();

    const { dataByChain, totalTvl, totalMarketCap } = data;

    const [pieData, setPieData] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
        if (data && dataByChain) {
            const chainOrder = [
                sonic.name,
                bsc.name,
                mainnet.name,
                plasma.name,
                sonicBlazeTestnet.name,
                bscTestnet.name,
                sepolia.name,
                plasmaTestnet.name
            ];

            const sortedData = Object.values(dataByChain).sort(
                (a, b) => chainOrder.indexOf(a.name) - chainOrder.indexOf(b.name)
            );

            const formattedData = sortedData.map(item => ({
                name: item.name,
                tvl: item.tvl,
                marketCap: item.marketCap,
                circulatingSupply: item.circulatingSupply
            }));

            setPieData(formattedData);
        }
    }, [data]);

    useEffect(() => {
        fetchAggregateFarmData();

        const interval = setInterval(() => {
            fetchAggregateFarmData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div id='charts' className="bg-gradient-to-b from-[#071019] to-[#0b1418] text-white p-10">
            <header className="max-w-6xl mx-auto mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className='text-white sm:text-28 text-18 mb-3'><span className='text-primary'>SavvyYield</span> Statistics & Charts</p>
                        <p className='text-muted/60 text-18 mb-7'>
                            Explore SavvyYield multichain performance at a glance.
                        </p>
                    </div>
                </div>
            </header>

            {isLoading && isFirstLoaidng ? <div className="w-full min-h-[200px] flex items-center justify-center">
                <CircleLoader color="#fff" loading={isLoading} size={50} />
            </div> :
                <main className="max-w-6xl mx-auto grid grid-cols-1 gap-8">
                    {/* Table Card */}
                    <section className="bg-section/10 rounded-lg p-6 shadow-lg ring-1 ring-white/3 opacity-85">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-center">
                                <thead>
                                    <tr className="text-slate-300 text-lg">
                                        <th className="py-4">Chain</th>
                                        <th className="py-4">TVL (USD)</th>
                                        <th className="py-4">Market Cap</th>
                                        <th className="py-4">Circulating Supply</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pieData.map((item) => {
                                        const name = (item as any).name as string;
                                        const tvl = (item as any).tvl as number;
                                        const marketCap = (item as any).marketCap as number;
                                        const circulatingSupply = (item as any).circulatingSupply as number;

                                        return (
                                            <tr key={name} className="border-t border-white/2">
                                                <td className="py-5 text-md">{name}</td>
                                                <td className="py-5">
                                                    <AnimatedNumber
                                                        includeComma
                                                        transitions={() => ({
                                                            type: "spring",
                                                            duration: 4,
                                                        })}
                                                        value={tvl}
                                                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`}
                                                    />
                                                </td>
                                                <td className="py-5">
                                                    <AnimatedNumber
                                                        includeComma
                                                        transitions={() => ({
                                                            type: "spring",
                                                            duration: 4,
                                                        })}
                                                        value={marketCap}
                                                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`}
                                                    /></td>
                                                <td className="py-5">
                                                    <AnimatedNumber
                                                        includeComma
                                                        transitions={() => ({
                                                            type: "spring",
                                                            duration: 4,
                                                        })}
                                                        value={circulatingSupply}
                                                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`}
                                                    /></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-black/30 rounded-2xl p-6 shadow-lg ring-1 ring-white/3 grid grid-cols-1 md:grid-cols-7 gap-6">
                        <div className="md:col-span-3 flex flex-col">
                            <h3 className="text-xl font-semibold mb-4">TVL distribution</h3>
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="tvl" nameKey="name" outerRadius={70} innerRadius={30} paddingAngle={3}>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Legend layout="vertical" align="left" verticalAlign="middle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-2 gap-2">
                            <div className="rounded-xl p-4 text-center">
                                <p className="text-md text-slate-400">TVL (Aggregate)</p>
                                <p className="text-2xl font-semibold text-[#99E39E] mt-2">
                                    <AnimatedNumber
                                        includeComma
                                        transitions={() => ({
                                            type: "spring",
                                            duration: 4,
                                        })}
                                        value={totalTvl}
                                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}`}
                                    /></p>
                            </div>
                            <div className="rounded-xl p-4 text-center">
                                <p className="text-md text-slate-400">Market Cap (Aggregate)</p>
                                <p className="text-2xl font-semibold text-[#99E39E] mt-2">
                                    <AnimatedNumber
                                        includeComma
                                        transitions={() => ({
                                            type: "spring",
                                            duration: 4,
                                        })}
                                        value={totalMarketCap}
                                        formatValue={(value: number) => `${Number(value).toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}`}
                                    /></p>
                            </div>
                        </div>
                    </section>
                </main>
            }
            <div className='bg-linear-to-br from-tealGreen to-charcoalGray sm:w-50 w-96 sm:h-50 h-96 rounded-full sm:-bottom-80 bottom-0 blur-400 z-0 absolute sm:-left-48 opacity-60'></div>
        </div>
    );
}
