import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   Button,
//   Image,
//   Platform
// } from 'react-native';

// import { ImagePicker, Permissions, FileSystem } from 'expo';

import { API } from 'aws-amplify';
import config from '../../config';
import { s3Upload } from '../../libs/awsLib';

import AllIngredients from '../AllIngredients';
import AddIngredient from '../AddIngredient';

// import globalStyles from '../styles/GlobalStyles';
// import formStyles from '../styles/FormStyles';

import './index.scss';

class CreateRecipe extends Component {
  static propTypes = {
    authenticate: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: '',
      ingredients: [],
      instructions: '',
      isCreating: false,
      showPhotos: false,
      photos: [],
      imageObject: null,
      image: ''
    }

    // this.file = null;
  }

  onChangeText = (key, event) => {
    const target = event.target;
    const value = target.value;

    this.setState({
      [key]: value
    });
  }

  handleFileChange = (event) => {
    this.setState({ imageObject: event.target.files[0] });
  }

  handleCreate = async () => {
    const { title, ingredients, instructions, imageObject } = this.state;
    console.log('handle create');
    console.log('title: ', title);
    console.log('ingredients: ', ingredients);
    console.log('instructions: ', instructions);
    console.log('imageObject: ', imageObject);

    if (imageObject && imageObject.size > config.s3.MAX_FILE_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_FILE_SIZE/1000000} MB.`);
      return;
    }
  
    this.setState({ isCreating: true });
  
    try {
      const attachment = imageObject
        ? await s3Upload(imageObject)
        : null;
      
      await this.createRecipe({
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        attachment
      }).then(console.log('createrecipe finish'));
      this.props.history.push('/recipes');
    } catch (e) {
      console.log('handle create error: ', e);
      console.log(e);
      this.setState({ isCreating: false });
    }
  }

  createRecipe = (recipe) => {
    console.log('createRecipe recipe: ', recipe);
    return API.post('recipes', '/recipes', {
      body: recipe
    });
  }

  // handleImageButton = async () => {
  //   if (Platform.OS === 'ios') {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status === 'granted') {
  //       this.chooseImage();
  //     } else {
  //       const error = 'Camera Roll permission not granted';
  //       console.log('error: ', error);
  //       throw new Error(error);
  //     }
  //   } else {
  //     this.chooseImage();
  //   }
  // }

  // chooseImage = () => {
  //   ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   })
  //   .then(result => {
  //     if (result && !result.cancelled) {
  //       this.setState({
  //         imageObject: result,
  //         image: result.uri
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //       console.log('ImagePicker error: ', err);
  //   });
  // }

  addIngredient = () => {
    const { ingredients } = this.state;
    const newIngredient = { name: null, amount: null, unit: null}
    const updatedIngredients = new Array(ingredients);

    updatedIngredients[0].push(newIngredient);
    console.log('updatedIngredients: ', updatedIngredients);
    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  handleIngredientsChange = (i, key, value) => {
    const { ingredients } = this.state;
    const updatedIngredients = new Array(ingredients);

    updatedIngredients[0][i][key] = value;
    console.log('updatedIngredients: ', updatedIngredients);

    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  ingredientDelete = (i) => {
    console.log('handleIngredientsChange: ', i);
    const { ingredients } = this.state;
    const updatedIngredients = new Array(ingredients);

    updatedIngredients[0].splice(i, 1);
    console.log('updatedIngredients: ', updatedIngredients);

    this.setState({
      ingredients: updatedIngredients[0]
    });
  }

  render() {
    const { title, instructions, imageObject, image, ingredients } = this.state;
    console.log('imageObject: ', imageObject);
    console.log('image: ', image);
    console.log('create recipe pathname: ', this.props.location.pathname);
    console.log('history: ', this.props.history);

    return (
      <div id="create-recipe" className="container">
        <div className="back" onClick={() => this.props.history.goBack()}>&lt; All Recipes</div>
        <form className="form-box">
          <input
            type="text"
            value={title}
            onChange={value => this.onChangeText('title', value)}
            placeholder="Recipe Title"
            // autofocus={true}
          />
          <AllIngredients
            ingredients={ingredients}
            editMode={true}
            onIngredientsChange={this.handleIngredientsChange}
            onIngredientDelete={this.ingredientDelete}
          />
          <AddIngredient
            handleOnPress={() => this.addIngredient()}
          />
          <textarea
            rows="7"
            value={instructions}
            onChange={value => this.onChangeText('instructions', value)}
            placeholder="Instructions"
          />
          <input
            type="file"
            id="recipe-img" name="recipe-img"
            accept="image/png, image/jpeg"
            onChange={this.handleFileChange}
          />
          {/* {
            image
            ? <Image
                style={{
                  width: 300,
                  height: 100,
                }}
                source={{ uri: image }}
              />
            : null
          } */}
          {/* <button onClick={this.handleImageButton}>Load Images</button> */}
          <button
          type="submit"
            onClick={this.handleCreate}
          >
            Create Recipe
          </button>
        </form>
      </div>
    );
  }

}

export default CreateRecipe;
