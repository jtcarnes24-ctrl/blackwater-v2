import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { year: '2016', index: 8,  change: 8 },
  { year: '2017', index: 14, change: 6 },
  { year: '2018', index: 22, change: 8 },
  { year: '2019', index: 31, change: 9 },
  { year: '2020', index: 42, change: 11 },
  { year: '2021', index: 56, change: 14 },
  { year: '2022', index: 68, change: 12 },
  { year: '2023', index: 85, change: 17 },
  { year: '2024', index: 95, change: 10 },
  { year: '2025', index: 99, change: 4 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div style={{
      background: 'rgba(8,8,8,0.95)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem', letterSpacing: '0.1em' }}>{label}</p>
      <p style={{ color: '#ffffff', fontWeight: 700 }}>Demand Index: {row.index}</p>
      <p style={{ color: '#f2ede4', fontSize: '0.75rem' }}>+{row.change} YoY</p>
    </div>
  )
}

export function AIChart() {
  return (
    <div style={{ width: '100%' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem', fontWeight: 600 }}>
        AI in Marketing — Global Demand Index (2016–2025)
      </p>
      <div style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeDasharray: '4 4' }} />
            <Line
              type="monotone" dataKey="index"
              stroke="#f2ede4" strokeWidth={2}
              dot={{ r: 3, fill: '#f2ede4', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
