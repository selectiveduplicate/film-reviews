import React, { useState } from "react";
import {
  useQuery,
  gql
} from "@apollo/client";
import {
  BrowserRouter as Router,
  useHistory,
  Route
} from 'react-router-dom';
import Container  from "@material-ui/core/Container";
import MaterialTable from 'material-table';
import BorderColorIcon from '@material-ui/icons/BorderColor';

import Header from './Components/Header';
import UserInput from './Components/UserInput';
import AddReviews from './Components/Pages/AddReviews';

const QUERY_FIND_FILMS = gql`
  query($filmName: String) {
    getMovieNames(name: $filmName) @cascade {
      name
      directed_by @cascade {
        name
      }
    }
}`;

const getContainerStyle = {
  marginTop: '5rem'
};

function App() {

  const [ nameFilter, setNameFilter ] = useState("");
  const [ dataForRender, setDataForRender ] = useState([]);

  const history = useHistory();

  // send query with variables as per user provided
  const { loading, error, data, refetch } = useQuery(QUERY_FIND_FILMS, 
    { variables: {filmName: nameFilter} });

  // variable with data for table
  var filmsAndDirectors;
  var arrayOfFilmNames = [];
  var arrayOfFilmDirectors = [];
  var multipleDirectors = "";

  // event handlers
  const handleInputChange = (event) => {
    if (event.target.value) {
      setNameFilter(event.target.value);
    } else {
      setNameFilter(null);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data: newData } = await refetch({ 
      variables: {filmName: nameFilter} 
    });

    // get film names
    newData.getMovieNames.forEach((filmObject) => arrayOfFilmNames.push(filmObject.name));

    // get corresponding directors
    newData.getMovieNames.forEach((filmObject) => {
      // for multiple directors show in comma-separated list
      if (filmObject.directed_by.length > 1) {
        filmObject.directed_by.forEach((dirObject) => {
          multipleDirectors += dirObject.name + ", ";
        })
        arrayOfFilmDirectors.push(
          multipleDirectors.trim().substr(0, multipleDirectors.length - 2));
        multipleDirectors = "";
      } 
      // for no directors
      else if (filmObject.directed_by.length === 0) arrayOfFilmDirectors.push("None found") 
      else filmObject.directed_by.forEach((dirObject) => arrayOfFilmDirectors.push(dirObject.name))
    });

    // create array of objects of film and their directors
    filmsAndDirectors = [];
    var tempObj = {};
    arrayOfFilmNames.forEach((key, i) => {
      tempObj.name = key;
      tempObj.director = arrayOfFilmDirectors[i];
      filmsAndDirectors.push(tempObj);
      tempObj = {};
    });

    setDataForRender(filmsAndDirectors);
  };


  return (
    <Router>
      <div>

        <Header />
        <Route exact path="/" render={ () =>
          <React.Fragment>
            <br></br>
            <Container maxWidth="xs" style={ getContainerStyle }>

              <h3 style={{ marginTop: 50 }}>
                Enter a film name or phrase:
              </h3>

              <UserInput handleInputChange={ handleInputChange } handleSubmit={ handleSubmit } />

            </Container>
            <MaterialTable 
                title=""
                columns={[
                  { title: 'Name', field: 'name', headerStyle: {
                    backgroundColor: '#A5B2FC'
                  } },
                  { title: 'Director', field: 'director', headerStyle: {
                    backgroundColor: '#A5B2FC'
                  } }
                ]}
                data={
                  dataForRender
                }
                options={{
                  search: true,
                  actionsColumnIndex: -1,
                  headerStyle: {
                    backgroundColor: "#A5B2FC"
                  }
                }}
                actions={[
                  {
                    icon: () => <BorderColorIcon />,
                    tooltip: 'Write a review',
                    // just using the window object to take to that route 
                    // with the movie name passed so that can be used there for running mutation
                    onClick: (event, rowData) => window.location.pathname = "/add-reviews/" + rowData.name.split(" ").join("-")
                  }
                ]}
                style={{ margin: '5rem' }}>
            </MaterialTable>
          </React.Fragment>
        }>
        </Route>
        {/* we need some dynamic part in our URL here */}
        <Route path="/add-reviews/:moviename">
          <AddReviews />
        </Route>
      </div>
      </Router>
  );
}

export default App;
