import { useEffect, useState } from 'react';
import { fetchIndicators } from '../services/worldBankApi.cjs';
import '../App.css'

const COUNTRY_OPTIONS = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'RU', name: 'Russia' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MX', name: 'Mexico' },
];

const INDICATOR_OPTIONS = [
  { code: 'SP.POP.TOTL', name: 'Total Population' },
  { code: 'NY.GDP.MKTP.CD', name: 'GDP (current US$)' },
  { code: 'SP.DYN.LE00.IN', name: 'Life Expectancy at Birth' },
  { code: 'SE.PRM.ENRR', name: 'Primary School Enrollment' },
  { code: 'SH.XPD.CHEX.GD.ZS', name: 'Health Expenditure (% of GDP)' },
  { code: 'EN.ATM.CO2E.PC', name: 'CO2 Emissions (metric tons per capita)' },
  { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment Rate (% of total labor force)' },
  { code: 'SP.URB.TOTL.IN.ZS', name: 'Urban Population (% of total)' },
  { code: 'AG.SRF.TOTL.K2', name: 'Surface Area (sq. km)' },
  { code: 'EG.USE.PCAP.KG.OE', name: 'Energy Use (kg of oil equivalent per capita)' },
];

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState('IN');
  const [indicator, setIndicator] = useState('SP.POP.TOTL');
  const [year, setYear] = useState('2010:2020');
  const [loading, setLoading] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);


  useEffect(() => {
    setLoading(true);
    fetchIndicators(country, indicator, year)
      .then(res => setData(res.data[1] || []))
      .finally(() => setLoading(false));
  }, [country, indicator, year]);

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Clean up on unmount
    return () => document.body.classList.remove('dark-theme');
  }, [darkTheme]);

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>World Bank Data Dashboard</h2>
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkTheme(t => !t)}
          aria-label="Toggle theme"
        >
          <i className={darkTheme ? 'fas fa-moon' : 'fas fa-sun'}></i>
        </button>
      </div>
      <div className="dashboard-filters">
        <label>
          Country:
          <select value={country} onChange={e => setCountry(e.target.value)}>
            {COUNTRY_OPTIONS.map(opt => (
              <option key={opt.code} value={opt.code}>{opt.name}</option>
            ))}
          </select>
        </label>
        <label>
          Indicator:
          <select value={indicator} onChange={e => setIndicator(e.target.value)}>
            {INDICATOR_OPTIONS.map(opt => (
              <option key={opt.code} value={opt.code}>{opt.name}</option>
            ))}
          </select>
        </label>
        <label>
          Year:
          <input value={year} onChange={e => setYear(e.target.value)} />
        </label>
      </div>
      {loading ? <p>Loading...</p> : (
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}