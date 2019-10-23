import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { API } from "aws-amplify";

import { s3Path } from '../../../libs/awsLib';

import Logo from '../../components/icons/Logo';

import './index.scss';

class Recipes extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      // isAuthenticated: false,
      isLoading: true,
      recipesData: [],
      recipesImgPaths: []
    }
  }

  componentDidMount() {
    let recipes = sessionStorage.getItem('recipes'),
        imgPaths = sessionStorage.getItem('imgPaths');

    if (recipes) {
      recipes = JSON.parse(recipes);
      imgPaths = JSON.parse(imgPaths);
      this.setState({
        recipesData: recipes,
        recipesImgPaths: imgPaths
      });
    } else {
      this.handleRecipes();
    }

    this.setState({ isAuthenticated: this.props.isAuthenticated });
  }

  async handleRecipes() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const recipesData = await this.getRecipes();
      this.setState({ recipesData });
      this.getImgPaths();
      sessionStorage.setItem('recipes', JSON.stringify(recipesData));
    } catch (e) {
      console.log('recipesData error: ', e);
    }

    this.setState({ isLoading: false });
  }
  
  getRecipes() {
    console.log('getting recipes from API');
    return API.get('recipes', '/recipes');
  }

  async getImgPaths() {
    const { recipesData } = this.state;
    let paths = [];
    if (recipesData) {
      for (let r of recipesData) {
        console.log('r: ', r);
        console.log('r.attachment: ', r.attachment);
        if (r.attachment.length > 0) {
          try {
            let path = await s3Path(r.attachment);
            console.log('path: ', path);
            paths.push(path);
          } catch (err) {
            console.log(err);
          }
        } else {
          paths.push("");
        }
      }
      this.setState({
        recipesImgPaths: paths
      });
      sessionStorage.setItem('imgPaths', JSON.stringify(paths));
    }
  }

  renderRecipes = (recipes) => {
    const{ recipesImgPaths } = this.state;
    console.log('recipes: ', recipes);
    return [{}].concat(recipes).map((item, i) =>
      // const slug = item.title.toLowerCase().replace(' ', '-'); 
      i !== 0
      ?
      <div
        key={item.recipeId}
        className="recipe-listing"
        onClick={this.handleRecipeClick(item)}
      >
        {
          item.attachment !== null
          ? <img
              className="thumb"
              src={recipesImgPaths[i-1]}
              // style={recipeStyles.recipeThumb}
            />
          : <div /*style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.sageGreen, width: 50, height: 50, marginRight: 10, padding: 10 }}*/>
              <Logo />
            </div>
        }
        <div className="recipe-info">
          <h2>{item.title}</h2>
        </div>
      </div>
      : null
    )
  }

  handleRecipeClick = (recipe) => {
    console.log('recipe click');
    const slug = recipe.title.toLowerCase().replace(' ', '-'); 
    <Redirect to={`/recipes/${slug}`} />
  }

  // renderRoutes = () => {
  //   const { recipesData } = this.state;

  //   return recipesData.length > 0
  //   ?
  //   recipesData.map((item, i) => {
  //     const slug = item.title.toLowerCase().replace(' ', '-');
  //     console.log('slug: ', slug);
  //     console.log('this.props.path: ', this.props.path);
  //     return (
  //       this.props.path.includes(this.props.path + '/' + slug)
  //       ?
  //       (
  //         <Route
  //           key={i}
  //           path={'/recipes/:title'}
  //           render={props => <route.component {...props} />}
  //         />
  //       )
  //       : null
  //     )
  //   })
  //   :
  //   null
  // }

  render() {
    const { recipesData } = this.state;
    // console.log('recipesData: ', recipesData);
    // console.log('recipesImgPaths: ', recipesImgPaths);
    const showRecipes = Object.keys(recipesData).length > 0 ? this.renderRecipes(recipesData) : null;
    // const routes = this.renderRoutes();
    // console.log('this.props.path: ', this.props.path);

    return (
      <div>
      {
      this.props.isAuthenticated
      ?
      <div id="recipes">
        <div /*onClick={() => this.props.navigation.push('CreateRecipe')}*/>
          <p> Add Recipe</p>
        </div>
        {showRecipes}
      </div>
      :
      <Redirect to="/" />
      }
      {/* {routes} */}
      </div>
    );
  }
}

export default Recipes;
