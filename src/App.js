import './App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from './component/searchbar';
import axios from 'axios';

const fetchDataFromApi = async (page, limit) => {
  try {
    const response = await fetch(`https://api.spacexdata.com/v4/launches/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {},
        options: {
          page: page,
          limit: limit,
        },
      }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    return {
      data: jsonResponse.docs,
      moreData: jsonResponse.hasNextPage,
    };
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};


function App() {
  const [launchData, setLaunchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [launches, setLaunches] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const limit = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchDataFromApi(page, limit);
      if (response && response.data) {
        setLaunchData(prevLaunchData => [...prevLaunchData, ...response.data]);
        setHasMore(response.moreData);
        setLaunches(prevLaunches => [...prevLaunches, ...response.data]);
        setFilteredLaunches(prevFilteredLaunches => [...prevFilteredLaunches, ...response.data]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const observer = useRef();
  const lastElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page, fetchData]);

  useEffect(() => {
    const filteredData = launches.filter(launch =>
      launch.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredLaunches(filteredData);
  }, [searchKeyword, launches]);

  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
  };

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await axios.get(`/api/samples`);
        console.log("data", response.data)
      } catch (error) {
        console.error('Error fetching samples:', error);
      }
    };

    fetchSamples();
  }, []);

  return (
    <div className="app-container">
      <div className="search-container">
        <SearchBar onSearchChange={handleSearchChange} />
      </div>
      <div className="launches-container">
        {filteredLaunches.map((launch, index) => {
          const launchElement = (
            <div key={index} className="launch">
              <img src={launch.links.patch.small} alt={`Launch patch for flight number ${launch.name}`} className="launch-image" />
              <div className="launch-details">
                <h2>Flight number: {launch.name} ({new Date(launch.date_utc).getFullYear()})</h2>
                <p>Details: {launch.details || 'No details available'}</p>
              </div>
            </div>
          );

          if (launchData.length === index + 1) {
            return <div ref={lastElementRef} key={launch.id}>{launchElement}</div>;
          } else {
            return launchElement;
          }
        })}
      </div>
      {loading && <div className="loader"></div>}
      {!hasMore && <div>No more data to show.</div>}
    </div>
  );
}

export default App;
