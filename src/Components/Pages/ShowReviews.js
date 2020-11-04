import React from "react";
import { gql, useQuery } from "@apollo/client";
import Divider from "@material-ui/core/Divider";
import { Alert, AlertTitle } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

const GET_REVIEWS = gql`
  query q2 {
    queryReview {
      reviewed_film {
        id
        data {
          id
          name
        }
        reviews {
          posted_by {
            username
          }
          rating
          text
        }
      }
    }
  }
`;

function ShowReviews() {
  const { loading, error, data } = useQuery(GET_REVIEWS);

  if (loading) {
    return <CircularProgress />;
  } else if (error) {
    console.log(error);
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Sorry, something might not be working at the moment!
      </Alert>
    );
  }

  return (
    <div className="review-content">
      <Typography id="page-title" variant="h2" align="center">
        Reviews
      </Typography>
      {/* map over to render the review details */}
      {data.queryReview.map((content) => (
        <div id="review-details">
          <Typography variant="h4" align="left">
            {content.reviewed_film.data.name}
          </Typography>
          <Divider />
          <br></br>
          {content.reviewed_film.reviews.map((reviewObj) => (
            <Typography variant="subtitle2" align="left">
              {reviewObj.posted_by.username}
              <Typography variant="subtitle1" align="left">
                Rating: {reviewObj.rating}
              </Typography>
              <Typography variant="body1" align="left">
                {reviewObj.text}
              </Typography>
              <br></br>
              <Divider light />
              <br></br>
            </Typography>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ShowReviews;
