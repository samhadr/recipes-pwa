import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { API } from "aws-amplify";

import { s3Path } from '../../../libs/awsLib';

import Recipe from '../../components/Recipe';

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
      recipesImgPaths: [],
      recipeSlugs: [],
      currentRecipe: []
    }
  }

  componentDidMount() {
    let recipes = sessionStorage.getItem('recipes'),
        imgPaths = sessionStorage.getItem('imgPaths'),
        slugs = sessionStorage.getItem('slugs');

    if (recipes) {
      recipes = JSON.parse(recipes);
      imgPaths = JSON.parse(imgPaths);
      slugs = JSON.parse(slugs);
      this.setState({
        recipesData: recipes,
        recipesImgPaths: imgPaths,
        recipeSlugs: slugs
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
      this.getSlugs();
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

  async getSlugs() {
    const { recipesData } = this.state;
    let slugs = [];
    if (recipesData) {
      for (let r of recipesData) {
        console.log('r.title: ', r.title);
        const slug = r.title.toLowerCase().replace(/&|,/g, '').split(' ').join('-'); 
        slugs.push(slug);
      }
      this.setState({
        recipeSlugs: slugs
      });
      sessionStorage.setItem('slugs', JSON.stringify(slugs));
    }
  }

  renderRecipes = (recipes) => {
    const{ recipesImgPaths, recipeSlugs } = this.state;
    console.log('recipes: ', recipes);
    return [{}].concat(recipes).map((item, i) =>
      // const slug = item.title.toLowerCase().replace(' ', '-'); 
      i !== 0
      ?
      <Link key={i} to={`/recipes/${recipeSlugs[i-1]}`}>
        <div
          // key={item.recipeId}
          className="recipe-listing"
          onClick={() => this.handleRecipeClick(item)}
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
      </Link>
      : null
    )
  }

  handleRecipeClick = (recipe) => {
    console.log('recipe click');
  }

  renderRoutes = () => {
    const { recipesData, recipeSlugs, recipesImgPaths } = this.state;
    // const slug = currentRecipe[0].title.toLowerCase().replace(' ', '-');

    return recipesData.length > 0
    ?
    recipesData.map((item, i) => {
      const slug = item.title.toLowerCase().replace(/&|,/g, '').split(' ').join('-');
      console.log('slug: ', slug);
      console.log('recipeSlugs[i-1]: ', recipeSlugs[i]);
      return (
        slug === recipeSlugs[i]
        ?
        (
          <Route
            key={i}
            path={`/recipes/${slug}`}
            render={() => 
                // console.log('match.params.slug: ', match.params.slug);
                <Recipe
                  // key={currentRecipe[0].recipeId}
                  recipe={item}
                  imgPath={recipesImgPaths[i]}
                  // slug={slug}
                  // handleActiveRecipe={this.setcurrentRecipe}
                />
              
            }
          />
        )
        : null
      )
    })
    :
    null
  }

  render() {
    const { isAuthenticated } = this.props;
    const { recipesData } = this.state;
    console.log('slugs: ', this.state.recipeSlugs);
    console.log('currentRecipe: ', this.state.currentRecipe);
    // console.log('recipesData: ', recipesData);
    // console.log('recipesImgPaths: ', recipesImgPaths);
    const showRecipes = Object.keys(recipesData).length > 0 ? this.renderRecipes(recipesData) : null;
    const routes = this.renderRoutes();
    console.log('routes: ', routes);
    console.log('this.props: ', this.props);

    return (
      this.props.location.pathname === '/recipes'
      ?
        <div id="recipes" className="container">
          {/* { isAuthenticated ? <div className="sign-out" onClick={() => this.signOut()}>Sign Out</div> : null } */}
          <div /*onClick={() => this.props.navigation.push('CreateRecipe')}*/>
            <Link to="/create-recipe" className="create-recipe">Create Recipe</Link>
          </div>
          {showRecipes}
        </div>
      :
        <Router>
          {routes}
        </Router>
    );
  }
}

export default withRouter(Recipes);
