import React, { useEffect, useState } from 'react';
import Overview from './components/Overview';
import BrandChart from './components/Brandchart';
import GrowthChart from './components/Growthchart';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({ totalEVs: 0, brands: [], growth: [] });
  useEffect(()=>{
  const fetchData = async () => {
    const response = await fetch('/evdata.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csvData = decoder.decode(result.value);
    const parsedData = Papa.parse(csvData, { header: true }).data;
    setData(parsedData);
    calculateMetrics(parsedData);
  };
  fetchData();
  },[])

  const calculateMetrics = (parsedData) => {
    const totalEVs = parsedData.length;
    
    const brands = parsedData.reduce((acc, curr) => {
      acc[curr.Make] = (acc[curr.Make] || 0) + 1;
      return acc;
    }, {});

    const brandData = Object.keys(brands).map(brand => ({ brand, count: brands[brand] }));

    const growth = parsedData.reduce((acc, curr) => {
      const year = new Date(curr.ModelYear).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const growthData = Object.keys(growth).map(year => ({ year, count: growth[year] }));

    setMetrics({ totalEVs, brands: brandData, growth: growthData });
  };
  return (
    <div className="App">
    <h1>Electric Vehicle Dashboard</h1>
    <Overview totalEVs={metrics.totalEVs} />
    <BrandChart data={metrics.brands} />
    <GrowthChart data={metrics.growth} />
  </div>
  )
   
  
}

export default App;
