import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";

export default function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.hasOwnProperty("_id")) {
          setRestaurant(data);
        } else {
          setRestaurant(null);
        }
      })
      .catch((err) => {
        console.err(err);
        setLoading(false);
        setRestaurant(null);
      });
  }, [id]);

  if (loading) {
    return (
      <Card>
        <Card.Header>Loading Restaurant Data..</Card.Header>
      </Card>
    );
  } else if (restaurant === null) {
    return (
      <Card>
        <Card.Header>Unable to find Restaurant with id: {id}</Card.Header>
      </Card>
    );
  } else {
    return (
      <>
        <Card>
          <Card.Header>
            <h2>{restaurant.name}</h2>
            <h6>
              {`${restaurant.address.building} ${restaurant.address.street}`}
            </h6>
          </Card.Header>
        </Card>

        <br />
        <MapContainer
          style={{ height: "400px" }}
          center={[restaurant.address.coord[1], restaurant.address.coord[0]]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[
              restaurant.address.coord[1],
              restaurant.address.coord[0],
            ]}
          ></Marker>
        </MapContainer>

        <br />
        <CardDeck>
          {restaurant.grades.map((data) => {
            return (
              <Card key={data._id}>
                <Card.Body>
                  <Card.Title>Grade: {data.grade}</Card.Title>
                  <Card.Text>Completed: {data.date.slice(0, 10)}</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </CardDeck>
      </>
    );
  }
}
