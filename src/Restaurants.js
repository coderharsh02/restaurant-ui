import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Table, Pagination } from "react-bootstrap";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(null);
  const [page, setPage] = useState(1);
  let borough = new URLSearchParams(useLocation().search).get("borough");

  borough = borough ? `&borough=${borough}` : "";

  let perPage = 10;

  let url = `${process.env.REACT_APP_API_URL}/api/restaurants?page=${page}&perPage=${perPage}&borough=${borough}`;
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => {
        console.log(err);
      });
  }, [url]);

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }
  function nextPage() {
    setPage(page + 1);
  }

  const navigate = useNavigate();

  return (
    <>
      <Card>
        <Card.Header>
          <h2>Restaurant List</h2>
          <h6>Full list of restaurants. Optionally sorted by borough</h6>
        </Card.Header>
      </Card>
      <br />
      {restaurants && restaurants.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Borough</th>
                <th>Cuisine</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => {
                return (
                  <tr
                    onClick={() => {
                      navigate(`/restaurant/${restaurant._id}`);
                    }}
                    key={restaurant._id}
                  >
                    <td>{restaurant.name}</td>
                    <td>
                      {restaurant.address.building} {restaurant.address.street}
                    </td>
                    <td>{restaurant.borough}</td>
                    <td>{restaurant.cuisine}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.Prev onClick={previousPage} />
            <Pagination.Item>{page}</Pagination.Item>
            <Pagination.Next onClick={nextPage} />
          </Pagination>
        </>
      ) : (
        <Card>
          {restaurants ? (
            <Card.Header>No Restaurants...</Card.Header>
          ) : (
            <Card.Header>Loading Restaurants...</Card.Header>
          )}
        </Card>
      )}
    </>
  );
}
